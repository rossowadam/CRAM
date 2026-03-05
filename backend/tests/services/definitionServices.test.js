const test = require('node:test');
const assert = require('node:assert/strict');
const definitionRepository = require('../../repositories/definitionRepository');
const definitionService = require('../../services/definitionServices');


test('definitionService - createdefinition', async (t) => {
    // Mock definition data
    const definitionData = {    
        id: 'definition123',
        term: 'Test definition',
        courseCode: 'TC101',
        definition: 'This is a test definition'
    };
    t.mock.method(definitionRepository, 'getDefinitionByCourseCode', async (courseCode) => {
        return null; // Simulate no existing definition with the same course code
    });
    t.mock.method(definitionRepository, 'createdefinition', async (data) => {
        return data; // Simulate successful definition creation
    }); 
    const createdDefinition = await definitionServices.createDefinition(definitionData);
    assert.deepStrictEqual(createdDefinition, definitionData);
});
test('definitionService - createdefinition with incomplete data', async (t) => {
    // Mock incomplete definition data
    const definitionData = {    
        id: 'definition123',
        term: 'Test definition',
        courseCode: 'TC101',
        definition: 'This is a test definition'
    };  
    try {
        await definitionServices.createDefinition(definitionData);
        assert.fail('Should have thrown an error for incomplete definition data');
    } catch (error) {
        assert.equal(error.message, 'definition data is incomplete');
    }   
});

test('definitionService - createdefinition with duplicate definition', async (t) => {
    // Mock definition data
    const definitionData = {
        id: 'definition123',
        term: 'Test definition',
        courseCode: 'TC101',       
        definition: 'This is a test definition'
    };
    t.mock.method(definitionRepository, 'getDefinitionByCourseCode', async (courseCode) => {
        return definitionData; // Simulate existing course with the same course code
    }); 
    try {
        await courseServices.createCourse(courseData);
        assert.fail('Should have thrown an error for duplicate course code');
    }
    catch (error) {
        assert.equal(error.message, 'Course with this course code already exists');
    }
});