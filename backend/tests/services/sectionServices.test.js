const test = require('node:test');
const assert = require('node:assert/strict');
const sectionRepository = require('../../repositories/sectionRepository');
const sectionService = require('../../services/sectionServices');




test('sectionService - createsection', async (t) => {
    // Mock section data
    const sectionData = {    
        id: 'section123',
        title: 'Test section',
        courseCode: 'TC101',
        body: 'This is a test section'
    };
    t.mock.method(sectionRepository, 'findSectionByTitle', async (courseCode, title) => {
        return null; // Simulate no existing section with the same course code
    });
    t.mock.method(sectionRepository, 'createSection', async (data) => {
        return data; // Simulate successful section creation
    }); 
    const createdsection = await sectionService.createSection(sectionData);
    assert.deepStrictEqual(createdsection, sectionData);
});
test('sectionService - createsection with incomplete data', async (t) => {
    // Mock incomplete section data
    const sectionData = {    
        id: 'section123',
        title: 'Test section',
        courseCode: 'TC101',
        body: 'This is a test section'
    };  
    try {
        await sectionService.createSection(sectionData);
        assert.fail('Should have thrown an error for incomplete section data');
    } catch (error) {
        assert.equal(error.message, 'section data is incomplete');
    }   
});

test('sectionService - createsection with duplicate section', async (t) => {
    // Mock section data
    const sectionData = {
        id: 'section123',
        title: 'Test section',
        courseCode: 'TC101',       
        body: 'This is a test section'
    };
    t.mock.method(sectionRepository, 'findSectionByTitle', async (courseCode, title) => {
        return sectionData; // Simulate existing course with the same course code
    }); 
    try {
        await sectionService.createSection(sectionData);
        assert.fail('Should have thrown an error for duplicate course code');
    }
    catch (error) {
        assert.equal(error.message, 'Course with this course code already exists');
    }
});