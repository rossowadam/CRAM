const courseRepository = require('../repositories/courseRepository');

exports.getAllCourses = async () => {
    return await courseRepository.findAll();
}