const User = require('../models/User');


//calls the database to find a user document with the provided id, returns the user document converted to a plain JSON object if found, 
// or null if no user with the given id was found
exports.findUserById = async (id) => {
    userfound =  await User.findById(id).lean();
    return userfound;
}
//calls the database to find a user document with the provided email, returns the user document converted to a plain JSON object if found,
// or null if no user with the given email was found
exports.findUserByEmail = async (email) => {
    userfound =  await User.findOne({ email: email }).lean();
    return userfound;
}
//calls the database to update a user document with the provided id using the provided userData object, 
// returns the updated user document converted to a plain JSON object if successful, 
// or null if no user with the given id was found
exports.updateUserById = async (id, userData) => { 
    return await User.findByIdAndUpdate(id, userData, { new: true }).lean();
}
//calls the database to delete a user document with the provided id, returns the deleted user document converted to a plain JSON object if successful,
// or null if no user with the given id was found
exports.deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id).lean();
}
//calls the database to create a new user document using the provided userData object, returns the created user document converted to a plain JSON object
exports.createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user.toJSON();
}