const mongoose = require('mongoose');

/**
 * Course Schema
 * Defines the structure for courses stored in MongoDB.
 */
const courseSchema = new mongoose.Schema({
    // Full name of the course
    title: {
        type: String, required: true
    },
    // Subject (e.g., "COMP", "MATH")
    subject: {
        type: String, required: true
    },
    // Course number (e.g., "1010", "2140")
    number: {
        type: String, required: true
    },
    // Combined code (e.g., "COMP 1010")
    course_code: {
        type: String, required: true
    },
    // Detailed text description of the course content
    description: {
        type: String, required: true
    },
    // Number of credit hours
    credits: {
        type: Number, required: true
    },
    // prerequisites exist or not
    prerequisites: {
        type: String, required: true
    },
    // Comma-separated list of course attributes (e.g., "Lab required")
    attributes: {
        type: String, required: true
    }
});

module.exports = mongoose.model('Course', courseSchema);