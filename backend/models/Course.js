const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    subject: {
        type: String, required: true
    },
    number: {
        type: String, required: true
    },
    course_code: {
        type: String, required: true, index: true, unique: true
    },
    description: {
        type: String, required: true
    },
    credits:{
        type: Number, required: true
    },
    prerequisites: {
        type: String, required: true
    },
    attributes: {
        type: String, required: true
    }
})
