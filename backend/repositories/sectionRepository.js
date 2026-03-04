const Section = require('../models/Section');


exports.createSection = async (sectionData) => {
    const newSection = new Section(sectionData);
    await newSection.save();
    return newSection.toJSON();
}


exports.getSectionsByCourseCode = async (courseCode) => {
    return await Section.find({ course_code: courseCode }).lean();
}

exports.deleteSection = async (id) => {
    return await Section.findByIdAndDelete(id);
}

exports.updateSection = async (id, updateData) => {
    return await Section.findByIdAndUpdate(id, updateData, { new: true }).lean();
}
