const test = require('node:test');
const assert = require('node:assert/strict');
const userController = require('../../controllers/userController');
const userService = require('../../services/userServices');

test('UserController - createUser', async (t) => {
    // Mock user data
    const userData1 = {
        id: 'testuser123', 
        userName: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'onion@example.com',
        role: null,
        setRole: function(role) {
            this.role = role;
        }
    };
    const userData2 = {
        id: 'testuser456', 
        userName: 'testuser2',
        passwordHash: 'hashedpassword2',
        email: 'onion@myumanitoba.ca',
        role: null,
        setRole: function(role) {
            this.role = role;
        }
    };
    const userData3 = {
        id: 'testuser789', 
        userName: 'testuser3',
        passwordHash: 'hashedpassword3',
        email: 'onion@umanitoba.ca',
        role: null,
        setRole: function(role) {
            this.role = role;
        }
    };
    t.mock.method(userService, 'createUser', async (data) => {
        const {email} = data;
        if (email.endsWith('@umanitoba.ca')) {
            data.setRole('professor');
            return data;
        }else if (email.endsWith('@myumanitoba.ca')) {
            data.setRole('student');
            return data;
        }
        else{
            throw new Error('Email domain is not allowed');
        }
        });
        const req1 = { body: userData1 };
        const req2 = { body: userData2 };
        const req3 = { body: userData3 };
        res = {
            statusCode: 0,
            body: null,
            status: function(statusCode) {
                this.statusCode = statusCode;
                return this;
            },
            json: function(data) {
                this.body = data;
                return this;
            }
        };
        await userController.createUser(req1, res);
        assert.strictEqual(res.statusCode, 403);
        assert.deepStrictEqual(res.body, { error: 'Email domain is not allowed' });
        await userController.createUser(req2, res);
        assert.strictEqual(res.statusCode, 201);
        assert.deepStrictEqual(res.body, { ...userData2, role: 'student' });
        await userController.createUser(req3, res);
        assert.strictEqual(res.statusCode, 201);
        assert.deepStrictEqual(res.body, { ...userData3, role: 'professor' });


});
test('UserController - createUser - duplicate email', async (t) => {
    
    t.mock.method(userService, 'createUser', async (data) => {
        throw new Error('User with this email already exists');
    });
    const req = {
        body: {
            id: '123', 
            name: 'Onion', 
            email: 'onion@example.com'
        }
    };  
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
        this.statusCode = code;
        return this; 
        }
        ,
        json(data) {
        this.body = data;
        return this;
        }   
    };
    await userController.createUser(req, res);
    assert.strictEqual(res.statusCode, 409);
    assert.deepStrictEqual(res.body, { error: 'User with this email already exists' });
});
test('UserController - findUserById', async (t) => {
    
    t.mock.method(userService, 'findUserById', async () => {
        return { id: '123', name: 'Misha', email: 'onion@example.com' };
    });

    const req = {
        params: { id: '123' }
    };

 
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
        this.statusCode = code;
        return this; 
        },
        json(data) {
        this.body = data;
        return this;
        }
    };
    await userController.findUserById(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, { id: '123', name: 'Misha', email: 'onion@example.com' });
});

test('UserController - findUserById - user not found', async (t) => {
    
    t.mock.method(userService, 'findUserById', async () => {
        return null; 
    });
    const req = {
        params: { id: '123' }
    };
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
        this.statusCode = code;
        return this; 
        },
        json(data) {
        this.body = data;
        return this;
        }
    };
    await userController.findUserById(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.deepStrictEqual(res.body, { error: 'User not found' });
}); 
test('UserController - findUserById - server error', async (t) => {
    
    t.mock.method(userService, 'findUserById', async () => {
        throw new Error('Database error');
    });
    const req = {
        params: { id: '123' }
    };
    const res = {
        statusCode: 0,
        body: null,
        status(code) { 
        this.statusCode = code;
        return this; 
        }
        ,
        json(data) {
        this.body = data;
        return this;
        }  
    };
    await userController.findUserById(req, res);
    assert.strictEqual(res.statusCode, 500);
    assert.deepStrictEqual(res.body, { error: 'Database error' });
});

test('UserController - updateUserById', async (t) => {
    t.mock.method(userService, 'updateUserById', async (id, data) => {
        if (id === '123') {
            return { id: '123', ...data }; 
        } else {
            return null;
        }
    });
    const req = {
        params: { id: '123' },
        body: { name: 'Updated Name', email: 'updated@example.com' }
    };
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
    await userController.updateUserById(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, { id: '123', name: 'Updated Name', email: 'updated@example.com' });
});

test('UserController - updateUserById - user not found', async (t) => {
    t.mock.method(userService, 'updateUserById', async (id, data) => {
        return null; 
    });
    const req = {
        params: { id: '123' },
        body: { name: 'Updated Name', email: 'updated@example.com' }
    };
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
    await userController.updateUserById(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.deepStrictEqual(res.body, { error: 'User not found' });
});
test('UserController - updateUserById - server error', async (t) => {
    t.mock.method(userService, 'updateUserById', async (id, data) => {
        throw new Error('Database error');
    }   );
    const req = {
        params: { id: '123' },
        body: { name: 'Updated Name', email: 'onion@example.com' }
    }; 
    const res = {
        statusCode: 0,
        body: null, 
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
    await userController.updateUserById(req, res);
    assert.strictEqual(res.statusCode, 500);
    assert.deepStrictEqual(res.body, { error: 'Database error' });
});
test('UserController - deleteUserById', async (t) => {
    t.mock.method(userService, 'deleteUserById', async (id) => {
        if (id === '123') {
            return { id: '123', name: 'Onion', email: 'onion@example.com' };
        } else {
            return null;
        }
    });
    const req = {
        params: { id: '123' }
    };  
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
    await userController.deleteUserById(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, { message: 'User deleted successfully' });
});
test('UserController - deleteUserById - user not found', async (t) => {
    t.mock.method(userService, 'deleteUserById', async (id) => {
        return null; 
    });
    const req = {
        params: { id: '123' }
    };  
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
    await userController.deleteUserById(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.deepStrictEqual(res.body, { error: 'User not found' });
});
test('UserController - deleteUserById - server error', async (t) => {
    t.mock.method(userService, 'deleteUserById', async (id) => {   
        throw new Error('Database error');
    });
    const req = {
        params: { id: '123' }
    };
    const res = {
        statusCode: 0,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.body = data;
            return this;
        }
    };
    await userController.deleteUserById(req, res);
    assert.strictEqual(res.statusCode, 500);
    assert.deepStrictEqual(res.body, { error: 'Database error' });
});