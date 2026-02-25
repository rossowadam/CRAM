import pdfplumber
import re
import json
import os
import sys

"""
PDF Course Parser Script
This script extracts course data from a PDF catalog, cleans the text using regex,
and structures it into a courses.json file for the backend.
"""

# --- Configuration ----------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Path to the source PDF and target output JSON files
PDF_PATH = os.path.join(SCRIPT_DIR, '..', 'data', '2025-2026-ug-course-descriptions.pdf')
OUTPUT_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'courses.json')
FLAGGED_PATH = os.path.join(SCRIPT_DIR, '..', 'data', 'flagged.json')

# PDF layout constants for cropping headers/footers and splitting multi-column pages
COLUMN_SPLIT_X = 306
HEADER_CROP_Y = 50
FOOTER_CROP_Y = 30

# --- Regex Patterns ---------------------------------------------------------
# These patterns identify subject headers, course headers, and specific metadata

SUBJECT_HEADER_RE = re.compile(r'^([A-Za-z][A-Za-z\s,&\'\-\.]+?)\s*\(([A-Z]{2,5})\)\s*$')
COURSE_HEADER_RE = re.compile(r'^([A-Z]{2,5})\s+(\d{4})\s+(.+?)\s+(\d+(?:\.\d+)?)\s+cr\s*$')
COURSE_HEADER_PARTIAL_RE = re.compile(r'^([A-Z]{2,5})\s+(\d{4})\s+(.+?)\s+(\d+(?:\.\d+)?)\s*$')
CR_LINE_RE = re.compile(r'^cr\s*$')
PREREQ_RE = re.compile(r'^(?:Prerequisite|Prerequisites|Pre-requisite|Pre-requisites):\s*(.*)', re.IGNORECASE)
PRCR_BOILERPLATE_RE = re.compile(r'^PR/CR:\s*A minimum grade of', re.IGNORECASE)
ATTRIBUTES_RE = re.compile(r'^Attributes?:\s*(.*)', re.IGNORECASE)
MUTUALLY_EXCLUSIVE_RE = re.compile(r'^Mutually Exclusive:\s*(.*)', re.IGNORECASE)
EQUIV_TO_RE = re.compile(r'^Equiv To:\s*(.*)', re.IGNORECASE)
LAB_RE = re.compile(r'\(Lab\s+[Rr]equired\)')
PAGE_NUMBER_PREFIX_RE = re.compile(r'^\d{3,4}\s+')
NOISE_LINE_RE = re.compile(r'^(\d{1,4}|2025-2026 UG \d+)\s*$')

# --- Processing -------------------------------------------------------------

def extract_text(pdf_path):
    """Opens the PDF and extracts text column by column to maintain logical order."""
    all_lines = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            try:
                # Process Left column
                lc = page.crop((0, HEADER_CROP_Y, COLUMN_SPLIT_X, page.height - FOOTER_CROP_Y)).extract_text()
                if lc: all_lines.extend([l.strip() for l in lc.split('\n') if l.strip()])
                # Process Right column
                rc = page.crop((COLUMN_SPLIT_X, HEADER_CROP_Y, page.width, page.height - FOOTER_CROP_Y)).extract_text()
                if rc: all_lines.extend([l.strip() for l in rc.split('\n') if l.strip()])
            except: continue
    return all_lines

def clean(lines):
    """Removes noises such as page numbers and headers from the extracted string list."""
    cleaned = []
    for l in lines:
        if NOISE_LINE_RE.match(l): continue
        m = PAGE_NUMBER_PREFIX_RE.match(l)
        if m:
            rest = l[m.end():]
            if SUBJECT_HEADER_RE.match(rest): l = rest
        cleaned.append(l)
    return cleaned

class Parser:
    """State machine that parses a stream of lines into structured Course and Subject objects."""
    def __init__(self):
        self.subjects = {}
        self.currentSubjName = None
        self.currentSubjCode = None
        self.currentCourse = None
        self.state = 'SEEK'  # States: SEEK (Looking for header), DESC (Parsing description), PRE (Parsing prerequisites)
        self.pending = None
        self.flagged = []

    def save(self):
        """Saves the currently parsed course into its parent subject's list."""
        if not self.currentCourse: return
        c = self.currentCourse
        c['description'] = c['description'].strip()
        c['hasPrerequisites'] = bool(c.pop('_rawP', '').strip())
        c['lab'] = bool(LAB_RE.search(c['description']))
        
        code = self.currentSubjCode or "UNK"
        if code not in self.subjects:
            self.subjects[code] = {'subjectName': self.currentSubjName or code, 'subjectCode': code, 'courses': []}
        
        # Courses without descriptions or credits are flagged for manual review
        if not c['description'] or c['credits'] == 0:
            self.flagged.append(c)
        
        self.subjects[code]['courses'].append(c)
        self.currentCourse = None

    def start(self, subj, num, title, creds):
        """Initializes a new Course object when a header match is found."""
        self.save()
        self.currentCourse = {
            'title': title.strip(),
            'courseCode': f"{subj} {num}",
            'description': '',
            'credits': float(creds) if '.' in str(creds) else int(creds),
            'hasPrerequisites': False,
            'attributes': [],
            'lab': False,
            '_rawP': ''
        }
        self.state = 'DESC'

    def run(self, lines):
        """Processes each line and switches parser state accordingly."""
        for l in lines:
            if self.pending:
                if CR_LINE_RE.match(l):
                    self.start(*self.pending)
                    self.pending = None
                    continue
                else:
                    self.start(*self.pending)
                    self.pending = None

            # Check for new Subject Headers
            m = SUBJECT_HEADER_RE.match(l)
            if m:
                self.save()
                self.currentSubjName, self.currentSubjCode = m.groups()
                self.state = 'SEEK'
                continue

            # Check for standard Course Headers
            m = COURSE_HEADER_RE.match(l)
            if m:
                self.start(*m.groups())
                continue

            # Check for multi-line Course Headers
            m = COURSE_HEADER_PARTIAL_RE.match(l)
            if m:
                self.pending = m.groups()
                continue

            if PRCR_BOILERPLATE_RE.match(l): continue

            # Extract course description or prerequisites based on current parser state
            if self.state == 'DESC':
                m = PREREQ_RE.match(l)
                if m:
                    self.currentCourse['_rawP'] = m.group(1)
                    self.state = 'PRE'
                elif m := ATTRIBUTES_RE.match(l):
                    if self.currentCourse: self.currentCourse['attributes'] = [a.strip() for a in m.group(1).split(',')]
                elif not (MUTUALLY_EXCLUSIVE_RE.match(l) or EQUIV_TO_RE.match(l)):
                    if self.currentCourse:
                        self.currentCourse['description'] += (' ' if self.currentCourse['description'] else '') + l
            elif self.state == 'PRE':
                if m := ATTRIBUTES_RE.match(l):
                    if self.currentCourse: self.currentCourse['attributes'] = [a.strip() for a in m.group(1).split(',')]
                    self.state = 'DESC'
                elif MUTUALLY_EXCLUSIVE_RE.match(l) or EQUIV_TO_RE.match(l):
                    self.state = 'DESC'
                elif self.currentCourse:
                    self.currentCourse['_rawP'] += ' ' + l
        self.save()

def main():
    """Entry point for the parser script."""
    print("Starting Refactored Parser...")
    lines = clean(extract_text(PDF_PATH))
    p = Parser()
    p.run(lines)
    
    # Save the structured data to external JSON files
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump({'subjects': sorted(p.subjects.values(), key=lambda s: s['subjectCode'])}, f, indent=2, ensure_ascii=False)
    with open(FLAGGED_PATH, 'w', encoding='utf-8') as f:
        json.dump(p.flagged, f, indent=2, ensure_ascii=False)
    print("JSON Generated.")

if __name__ == '__main__': main()
