const definitionRepositoy = require('../repositories/definitionRepository');

exports.getDefinitionsByCourseCode = async (course_code) => {
    return await definitionRepositoy.getDefinitionsByCourseCode(course_code);
}

exports.createDefinition = async (definitionData) => {
    const definitionIsComplete = definitionData.course_code && definitionData.term && definitionData.definition && definitionData.example;
    if (!definitionIsComplete) {
        throw new Error('Definition data is incomplete');
    }
    return await definitionRepositoy.createDefinition(definitionData);
}

exports.deleteDefinition = async (id) => {
    const deletedDefinition = await definitionRepositoy.deleteDefinition(id);
    if (!deletedDefinition) {
        throw new Error('Definition not found');
    }
}

exports.updateDefinition = async (id, updateData) => {
    const definitionIsComplete = updateData.course_code && updateData.term && updateData.definition && updateData.example;
    if (!definitionIsComplete) {
        throw new Error('Definition data is incomplete');
    }
    const updatedDefinition = await definitionRepositoy.updateDefinition(id, updateData);
    if (!updatedDefinition) {
        throw new Error('Definition not found');
    }
    return updatedDefinition
}   


