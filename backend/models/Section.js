const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
    course_code: {
        type: String, required: true
    },
    title:{
        type: String, required: true
    },
    description: {
        type: String, required: true    
    },
    body: {
        type: String, required: true
    },
    contributors: {
        type: [{
            name: {type: String, required: true},
            date: {type: Date, required: true},
            role: {type: String, required: true}
        }], required: true
    }

})

module.exports = mongoose.model('Section', sectionSchema); 