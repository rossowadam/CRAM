const Course = require('../models/Course');

/**
 * Course Repository
 * Handles all direct interactions with the MongoDB Course collection.
 * This pattern abstracts the database logic away from the services.
 */
const courseRepository = {
    // Create a new course entry
    create: async (courseData) => {
        const course = new Course(courseData);
        return await course.save();
    },

    // Retrieve all courses from the database
    findAll: async () => {
        return await Course.find();
    },

    // Find a specific course by its MongoDB ID
    findById: async (id) => {
        return await Course.findById(id);
    },

    // Update an existing course's details
    update: async (id, courseData) => {
        return await Course.findByIdAndUpdate(id, courseData, { new: true });
    },

    // Remove a course from the database
    delete: async (id) => {
        return await Course.findByIdAndDelete(id);
    }
};

module.exports = courseRepository;