const definitionRepository = require('../repositories/definitionRepository');

exports.getDefinitionsByCourseCode = async (courseCode) => {
    return await definitionRepository.getDefinitionsByCourseCode(courseCode);
}

exports.createDefinition = async (definitionData) => {
    const definitionIsComplete = definitionData.courseCode && definitionData.term && definitionData.definition && definitionData.example;
    if (!definitionIsComplete) {
        throw new Error('Definition data is incomplete');
    }
    return await definitionRepository.createDefinition(definitionData);
}

exports.deleteDefinition = async (id) => {
    const deletedDefinition = await definitionRepository.deleteDefinition(id);
    if (!deletedDefinition) {
        throw new Error('Definition not found');
    }
}

exports.updateDefinition = async (id, updateData) => {
    const definitionIsComplete = updateData.courseCode && updateData.term && updateData.definition && updateData.example;
    if (!definitionIsComplete) {
        throw new Error('Definition data is incomplete');
    }
    const updatedDefinition = await definitionRepository.updateDefinition(id, updateData);
    if (!updatedDefinition) {
        throw new Error('Definition not found');
    }
    return updatedDefinition
}


