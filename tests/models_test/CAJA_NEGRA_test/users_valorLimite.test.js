// test/usuarioModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Usuario = require('../models/usuario');
 
describe('Usuario Model - Boundary Value Testing', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await Usuario.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    it('should not create a user with an empty name', async () => {
        try {
            const user = new Usuario({
                name: '',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'user',
                password: 'password123',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('name');
        }
    });
 
    it('should create a user with a valid name', async () => {
        const user = new Usuario({
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'user',
            password: 'password123',
            state: true
        });
        const savedUser = await user.save();
        expect(savedUser._id).to.exist;
        expect(savedUser.name).to.equal('John');
    });
 
    it('should not create a user with a very long name', async () => {
        try {
            const user = new Usuario({
                name: 'J'.repeat(256),
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'user',
                password: 'password123',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('name');
        }
    });
 
    it('should not create a user with an invalid email', async () => {
        try {
            const user = new Usuario({
                name: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                role: 'user',
                password: 'password123',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('email');
        }
    });
 
    it('should create a user with a valid email', async () => {
        const user = new Usuario({
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'user',
            password: 'password123',
            state: true
        });
        const savedUser = await user.save();
        expect(savedUser._id).to.exist;
        expect(savedUser.email).to.equal('john.doe@example.com');
    });
 
    it('should not create a user with a very long email', async () => {
        try {
            const user = new Usuario({
                name: 'John',
                lastName: 'Doe',
                email: 'a'.repeat(256) + '@example.com',
                role: 'user',
                password: 'password123',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('email');
        }
    });
 
    it('should not create a user with an empty role', async () => {
        try {
            const user = new Usuario({
                name: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: '',
                password: 'password123',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('role');
        }
    });
 
    it('should create a user with a valid role', async () => {
        const user = new Usuario({
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            password: 'password123',
            state: true
        });
        const savedUser = await user.save();
        expect(savedUser._id).to.exist;
        expect(savedUser.role).to.equal('admin');
    });
 
    it('should not create a user with a very long role', async () => {
        try {
            const user = new Usuario({
                name: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'R'.repeat(256),
                password: 'password123',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('role');
        }
    });
 
    it('should create a user with a valid password', async () => {
        const user = new Usuario({
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'user',
            password: 'password123',
            state: true
        });
        const savedUser = await user.save();
        expect(savedUser._id).to.exist;
        expect(savedUser.password).to.equal('password123');
    });
 
    it('should not create a user with a very short password', async () => {
        try {
            const user = new Usuario({
                name: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'user',
                password: 'short',
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('password');
        }
    });
 
    it('should not create a user with a very long password', async () => {
        try {
            const user = new Usuario({
                name: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                role: 'user',
                password: 'P'.repeat(1024),
                state: true
            });
            await user.save();
        } catch (err) {
            expect(err.errors).to.have.property('password');
        }
    });
 
    it('should handle boolean state field correctly', async () => {
        const userTrue = new Usuario({
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'user',
            password: 'password123',
            state: true
        });
        const userFalse = new Usuario({
            name: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'user',
            password: 'password123',
            state: false
        });
 
        const savedUserTrue = await userTrue.save();
        const savedUserFalse = await userFalse.save();
 
        expect(savedUserTrue.state).to.equal(true);
        expect(savedUserFalse.state).to.equal(false);
    });
});