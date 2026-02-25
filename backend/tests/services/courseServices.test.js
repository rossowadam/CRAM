const test = require('node:test');
const assert = require('node:assert/strict');
const courseRepository = require('../../repositories/courseRepository');
const courseServices = require('../../services/courseServices');

test('CourseService - createCourse', async (t) => {
    // Mock course data
    const courseData = {    
        id: 'course123',
        title: 'Test Course',
        course_code: 'TC101',
        description: 'This is a test course',
        credits: 3,
        prerequisites: 'None',
        attributes: 'None',
        subject: 'TEST',
        number: '101'
    };
    t.mock.method(courseRepository, 'findCourseByCourseCode', async (course_code) => {
        return null; // Simulate no existing course with the same course code
    });
    t.mock.method(courseRepository, 'createCourse', async (data) => {
        return data; // Simulate successful course creation
    }); 
    const createdCourse = await courseServices.createCourse(courseData);
    assert.deepStrictEqual(createdCourse, courseData);
});
test('CourseService - createCourse with incomplete data', async (t) => {
    // Mock incomplete course data
    const courseData = {    
        id: 'course123',
        title: 'Test Course',
        course_code: 'TC101',
        description: 'This is a test course',
        credits: 3,
        prerequisites: 'None',
        attributes: 'None',
        subject: 'TEST',
        // Missing number field
    };  
    try {
        await courseServices.createCourse(courseData);
        assert.fail('Should have thrown an error for incomplete course data');
    } catch (error) {
        assert.equal(error.message, 'Course data is incomplete');
    }   
});

test('CourseService - createCourse with duplicate course code', async (t) => {
    // Mock course data
    const courseData = {
        id: 'course123',
        title: 'Test Course',
        course_code: 'TC101',       
        description: 'This is a test course',
        credits: 3,
        prerequisites: 'None',
        attributes: 'None',
        subject: 'TEST',
        number: '101'
    };
    t.mock.method(courseRepository, 'findCourseByCourseCode', async (course_code) => {
        return courseData; // Simulate existing course with the same course code
    }); 
    try {
        await courseServices.createCourse(courseData);
        assert.fail('Should have thrown an error for duplicate course code');
    }
    catch (error) {
        assert.equal(error.message, 'Course with this course code already exists');
    }
});