const Section = require("../models/Section");

exports.createSection = async (sectionData) => {
    const newSection = new Section(sectionData);
    await newSection.save();
    return newSection.toJSON();
};

exports.getSectionsByCourseCode = async (courseCode) => {
    return await Section.find({ courseCode: courseCode }).lean();
};

// return array of sections with the same code and title
exports.isDuplicateSection = async ({ courseCode, title }) => {
    const existingSection = await Section.find({
        courseCode: courseCode,
        title: title,
    }).lean();
    return existingSection.length !== 0;
};

exports.deleteSection = async (id) => {
    return await Section.findByIdAndDelete(id);
};

exports.updateSection = async (id, updateData) => {
    return await Section.findByIdAndUpdate(id, updateData, {
        new: true,
    }).lean();
};
