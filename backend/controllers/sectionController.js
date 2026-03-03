const sectionService = require('../services/sectionServices');

exports.createSection = async (req, res) => {
    try {
        const sectionData = req.body;
        const newSection = await sectionService.createSection(sectionData);
        res.status(201).json(newSection);
    } catch (error) {
        if (error.message.includes('already exists')) {
            res.status(409).json({ error: error.message });
        } else if (error.message.includes('incomplete')) {
            res.status(422).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

exports.getSectionsByCourseCode = async (req, res) => {
    const { courseId } = req.params;
    try {
        const sections = await sectionService.getSectionsByCourseCode(courseId);
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteSection = async (req, res) => {
    const { id } = req.params;  
    try {
        const deletedSection = await sectionService.deleteSection(id);
        if (!deletedSection) {
            return res.status(404).json({ error: 'Section not found' });
        }
        res.status(200).json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateSection = async (req, res) => {   
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedSection = await sectionService.updateSection(id, updateData);
        if (!updatedSection) {
            return res.status(404).json({ error: 'Section not found' });
        }
        res.status(200).json(updatedSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}