const express = require('express');
const router = express.Router();

// Import the user controller, currently only one exists, but more may be added as we implement more user-related features
//this one may likely only be used for fetching user data, but we will see as we implement more features like user registration, authentication, etc.
const userController = require('../controllers/userController');

// Gets all users, currently not used, but may be useful for admin features in the future, or for testing purposes
//likely will need to be protected in a release version, but for now it is open to anyone for testing purposes
router.get('/', userController.getAllUsers);

//searches for users by name, email, or other fields, returns an array of matching user documents, currently not used,
//  but may be useful for admin features in the future, or for testing purposes
router.get('/search', userController.searchUsers);

//gets a user by id, currently returns the user document if found, or null if no user with the given id was found.
//  may be useful for fetching user data to display on the frontend, for example profile page, or for admin features in the future.
router.get('/:id', userController.getUserById);

//update a user's data. Should only be accessible to the user themselves, or to admins.
router.put('/update/:id', userController.updateUserById);

//delete a user, should be accessible to the user themselves, should clear out all saved data related to the user.
router.delete('/delete/:id', userController.deleteUserById);

router.post('/create', userController.createUser);

module.exports = router;