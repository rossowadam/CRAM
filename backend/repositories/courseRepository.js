const Course = require('../models/Course');

const courseRepository = {
    create: async (courseData) => {
        const course = new Course(courseData);
        return await course.save();
    },
    findAll: async () => {
        return await Course.find();
    },
    findById: async (id) => {
        return await Course.findById(id);
    },
    update: async (id, courseData) => {
        return await Course.findByIdAndUpdate(id, courseData, { new: true });
    },
    delete: async (id) => {
        return await Course.findByIdAndDelete(id);
    }
};

module.exports = courseRepository;