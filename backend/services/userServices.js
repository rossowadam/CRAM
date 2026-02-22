const userRepository = require('../repositories/userRepository');

exports.getAllUsers = async () => {
    return await userRepository.findAll();
}

exports.findUserById = async (id) => {
    return await userRepository.findUserById(id);
}