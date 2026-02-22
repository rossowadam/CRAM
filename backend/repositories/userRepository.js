const User = require('../models/User');

exports.findAll = async () => {
    return await User.find();
}

exports.findUserById = async (id) => {
    return await User.findById(id);
}