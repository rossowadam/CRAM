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
    t.mock.method(definitionRepository, 'createDefinition', async (data) => {
        return data; // Simulate successful definition creation
    }); 
    const createdDefinition = await definitionService.createDefinition(definitionData);
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
        await definitionService.createDefinition(definitionData);
        assert.fail('Should have thrown an error for incomplete definition data');
    } catch (error) {
        assert.equal(error.message, 'definition data is incomplete');
    }   
});
