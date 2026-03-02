const argon2 = require('argon2');

exports.hashPassword = async (password) => {
    try {
        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, // 64 MB
            timeCost: 3,
            parallelism: 1,
        });
        return hash;

    }catch (err){
        err.message = 'Error hashing password';
        throw new Error(err);        
    }
}

// take in a password and a hash, verify it is the same as hash
exports.verifyPassword = async (password, hashedPassword) => {
    const hashed = await this.hashPassword(password);
    return hashed === hashedPassword;
}