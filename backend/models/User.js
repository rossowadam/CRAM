const mongoose = require('mongoose');

/**
 * User Schema
 * Defines the structure for user accounts stored in MongoDB.
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    // Student ID or internal system ID
    id: {
        type: String, required: true
    },
    userName: {
        type: String, required: true
    },
    // Securely hashed password
    passwordHash: {
        type: String, required: true
    },
    // User role (e.g., "student", "admin")
    role: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    }
}
);

module.exports = mongoose.model('User', userSchema);