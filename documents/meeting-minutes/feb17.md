Time: 4:50-7:30 pm

## Agenda
- Finalize database schema
- Confirm the prepopulation of courses

## Notes
- Sam started by sharing his drafts for the collections
- Chose to add a separate collection for Sections which will have the courseID within to connect with Courses collection
- Main reason for separating the collection was that it was too much to embed
- MongoDB also has limits for free tier
- Users: id, email, passwordHash, firstName, lastName, username, role
- Courses: subjectName, subjectCode, courses {title, subject, number, courseCode, description, credits, prerequisites, attributes, labRequired}
- Sections: courseCode, notes {units}, definitions {words}
- Found PDF link for all courses: https://umanitoba.ca/sites/default/files/2025-10/2025-2026-ug.pdf
  - Pages 950-1143 are relevant to us
- David also did the branching conventions
  - Create short-living branches per subtask from development
  - Once all subtasks of a feature are done, make a feature branch for any clean-up / polishing
