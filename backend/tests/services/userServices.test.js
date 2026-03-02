const test = require('node:test');
const assert = require('node:assert/strict');

const userRepository = require('../../repositories/userRepository');
const userService = require('../../services/userServices');
const passwordServices = require('../../services/passwordServices');

test('UserService - createUser', async (t) => {
    // Mock user data
    const userData = {
        name: 'testuser2',
        email: 'test@myumanitoba.ca',
        password: 'plaintext123',
    };

    // Mock password hashing
    t.mock.method(passwordServices, 'hashPassword', async () => {
        return 'mocked_hash';
    });

    // Simulate no existing user with the same email
    t.mock.method(userRepository, 'findUserByEmail', async () => {
        return null;
    });

    // Simulate successful user creation
    t.mock.method(userRepository, 'createUser', async (data) => {
        return data;
    });

    const createdUser = await userService.createUser(userData);

    assert.deepStrictEqual(createdUser, {
        user_name: 'testuser2',
        email: 'test@myumanitoba.ca',
        password_hash: 'mocked_hash',
        role: 'student',
    });
});

test('UserService - createUser with invalid email domain', async (t) => {   
    // Mock user data with invalid email domain
    const userData = {
        name: 'testuser2',
        email: 'test@example.com',
        password: 'plaintext123',
    };

    try {
        await userService.createUser(userData);
        assert.fail('Should have thrown an error for invalid email domain');
    } catch (error) {
        assert.equal(error.message.includes('not allowed'), true);
    }
});

test('UserService - createUser with incomplete data', async (t) => {
    // Mock user data with missing fields
    const userData = {
        name: 'testuser2',
        email: 'test@myumanitoba.ca',
        // Missing password
    };

    try {
        await userService.createUser(userData);
        assert.fail('Should have thrown an error for incomplete user data');
    } catch (error) {
        assert.equal(error.message.includes('incomplete'), true);
    }
});

test('UserService - createUser with existing email', async (t) => {
    // Mock user data
    const userData = {  
        name: 'testuser2',
        email: 'test@myumanitoba.ca',
        password: 'plaintext123',
    };

    // Simulate existing user with the same email
    t.mock.method(userRepository, 'findUserByEmail', async () => {
        return { existing: true };
    });

    try {
        await userService.createUser(userData);
        assert.fail('Should have thrown an error for existing email');
    } catch (error) {
        assert.equal(error.message.includes('already exists'), true);
    } 
});

test('UserService - createUser with professor email domain', async (t) => {
    // Mock user data with professor email domain
    const userData = {      
        name: 'testuser3',
        email: 'proftest@umanitoba.ca',
        password: 'plaintext123',
    };

    // Mock password hashing
    t.mock.method(passwordServices, 'hashPassword', async () => {
        return 'mocked_hash';
    });

    // Simulate no existing user with the same email
    t.mock.method(userRepository, 'findUserByEmail', async () => {
        return null;
    });

    // Simulate successful user creation
    t.mock.method(userRepository, 'createUser', async (data) => {
        return data;
    });

    const createdUser = await userService.createUser(userData);

    assert.deepStrictEqual(createdUser, {
        user_name: 'testuser3',
        email: 'proftest@umanitoba.ca',
        password_hash: 'mocked_hash',
        role: 'professor',
    });
});