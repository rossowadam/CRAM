const User = require('../models/User');

exports.findUserById = async (id) => {
    return await User.findById(id);
}