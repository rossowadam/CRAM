const mongoose = require('mongoose');

const definitionSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    term: { type: String, required: true },
    definition: { type: String, required: true },
    example: { type: String, required: true }
});

module.exports = mongoose.model('Definition',definitionSchema);