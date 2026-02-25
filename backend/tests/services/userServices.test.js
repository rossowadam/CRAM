const test = require('node:test');
const assert = require('node:assert/strict');
const userRepository = require('../../repositories/userRepository');
const userService = require('../../services/userServices');

test('UserService - createUser', async (t) => {
    // Mock user data
    const userData = {
        id: 'testuser456',
        userName: 'testuser2',
        passwordHash: 'hashedpassword2',
        email: 'test@myumanitoba.ca',
        firstName: 'Test',
        lastName: 'User',
        role: null,

    };
    t.mock.method(userRepository, 'findUserByEmail', async (email) => {
        return null; // Simulate no existing user with the same email
    });
    t.mock.method(userRepository, 'createUser', async (data) => {
        return data; // Simulate successful user creation
    });
    const createdUser = await userService.createUser(userData);
    assert.deepStrictEqual(createdUser, { ...userData, role: 'student' });
});

test('UserService - createUser with invalid email domain', async (t) => {   
    // Mock user data with invalid email domain
    const userData = {
        id: 'testuser456',
        userName: 'testuser2',
        passwordHash: 'hashedpassword2',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: null,

    };
    try {
        await userService.createUser(userData);
        assert.fail('Should have thrown an error for invalid email domain');
    } catch (error) {
        assert.equal(error.message.includes('not allowed'), true  );
    }
}); 

test('UserService - createUser with incomplete data', async (t) => {
    // Mock user data with missing fields
    const userData = {
        id: 'testuser456', 
        userName: 'testuser2',
        passwordHash: 'hashedpassword2',
        email: '  ooofo@example.com',
        // Missing firstName and lastName
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
        id: 'testuser456',
        userName: 'testuser2',
        passwordHash: 'hashedpassword2',
        email: 'test@myumanitoba.ca',
        firstName: 'Test',
        lastName: 'User',
        role: null,
    };
    t.mock.method(userRepository, 'findUserByEmail', async (email) => {
        return { ...userData, role: 'student' }; // Simulate existing user with the same email
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
        id: 'testuser789',
        userName: 'testuser3',
        passwordHash: 'hashedpassword3',
        email: 'proftest@umanitoba.ca',
        firstName: 'ProfTest',
        lastName: 'User',
        role: null,
    };
    t.mock.method(userRepository, 'findUserByEmail', async (email) => {
        return null; // Simulate no existing user with the same email
    });
    t.mock.method(userRepository, 'createUser', async (data) => {
        return data; // Simulate successful user creation
    });
    const createdUser = await userService.createUser(userData);
    assert.deepStrictEqual(createdUser, { ...userData, role: 'professor' });
});