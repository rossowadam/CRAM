const sectionRepository = require('../repositories/sectionRepository');

exports.createSection = async (sectionData) => {
    const { courseCode, title, subtitle, content } = sectionData; // extract data

    if (!courseCode || !title || !subtitle || !content) {
        throw new Error('Section data is incomplete');
    }
    
    // see if another section exists in the course with same title
    const existingSection = await sectionRepository.findSectionByTitle(courseCode, title);

    // titles must be unique within a course
    if (existingSection.length !== 0) {
        throw new Error('Section with this title already exists');
    }

     // create new section object to match Section schema
    const newSection = {
        course_code: courseCode,
        title,
        description: subtitle,
        body: content
    };

    return await sectionRepository.createSection(newSection);
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