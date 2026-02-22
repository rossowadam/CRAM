const User = require('../models/User');

exports.findUserById = async (id) => {
    userfound =  await User.findById(id).lean();
    return userfound;
}
exports.findUserByEmail = async (email) => {
    userfound =  await User.findOne({ email: email }).lean();
    return userfound;
}
exports.updateUserById = async (id, userData) => { 
    return await User.findByIdAndUpdate(id, userData, { new: true }).lean();
}
exports.deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id).lean();
}
exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
}