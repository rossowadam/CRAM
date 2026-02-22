const userRepository = require('../repositories/userRepository');

exports.findUserById = async (id) => {
    return await userRepository.findUserById(id);
}