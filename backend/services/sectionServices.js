const sectionRepository = require('../repositories/sectionRepository');

exports.createSection = async (sectionData) => {
    if (!sectionData.section_title || !sectionData.course_code || !sectionData.description || !sectionData.body) {
        throw new Error('Section data is incomplete');
    }
    const {section_title} = sectionData;
    const existingSection = await sectionRepository.findSectionByTitle(section_title);
    if (existingSection) {
        throw new Error('Section with this title already exists');
    }
    return await sectionRepository.createSection(sectionData);
}

exports.getSectionsByCourseCode = async (courseCode) => {
    return await sectionRepository.getSectionsByCourseCode(courseCode);
}

exports.deleteSection = async (id) => {
    return await sectionRepository.deleteSection(id);
}

exports.updateSection = async (id, updateData) => {
    return await sectionRepository.updateSection(id, updateData);
}