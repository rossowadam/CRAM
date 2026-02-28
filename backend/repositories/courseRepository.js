const e = require('express');
const Course = require('../models/Course');

//most functions calling the DB will return a document, not an object. keep that in mind when using the returned data,
//as it will have mongoose methods like .save() and .update() available, but it will not be a plain JSON object.
//if you want a plain JSON object, you can call .toObject() on the returned document.

//creates a new course document in the database using the provided courseData object, returns the saved course document
//courseData should be an object with the following fields: title, subject, number, course_code, description, credits, prerequisites, attributes                                                                                                                                
exports.createCourse = async (courseData) => {
    const course = new Course(courseData);
        return await course.save();
}
//gets all courses, returns an array of course documents
exports.getAllCourses = async () => {
    return await Course.find({}).lean();
}

//gets a course by id, returns the course document if found, or null if no course with the given id was found
exports.getCourseById = async (id) => {
    return await Course.findById(id);
}

//update a course by id, returns the updated course document if successful, or null if no course with the given id was found
exports.updateCourse = async (id, courseData) => {
    return await Course.findByIdAndUpdate(id, courseData, { new: true });
}

//delete a course by id, returns the deleted course document if successful, or null if no course with the given id was found
exports.deleteCourse = async (id) => {
    return await Course.findByIdAndDelete(id);
}

//grabs 10 at random from the database, faster than grabbing all and slicing in memory, especially as the database grows
//returns array of JSON objects representing courses, can be used to populate the homepage with random courses each time it loads
//Does not return mongoose document objects, so they will not have mongoose methods like .save() or .update(), but they will have all the course data fields.
exports.getSampleCourses = async (count = 10) => {
    return await Course.aggregate([{ $sample: { size: count } }]) ;
}

exports.findCourseByCourseCode = async (course_code) => {
    return await Course.findOne({ course_code: course_code });
}