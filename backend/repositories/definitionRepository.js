const Defintion = require('../models/Definition');

exports.getDefinitionsByCourseCode = async (courseCode) => {
    return await Defintion.find({ courseCode }).lean();
}

exports.createDefinition = async (definitionData) => {
    const newDefinition = new Defintion(definitionData);
    await newDefinition.save();
    return newDefinition.toJSON();
}

exports.deleteDefinition = async (id) => {
    return await Defintion.findByIdAndDelete(id);
}

exports.updateDefinition = async (id, updateData) => {
    return await Defintion.findByIdAndUpdate(id, updateData, { new: true }).lean();
}