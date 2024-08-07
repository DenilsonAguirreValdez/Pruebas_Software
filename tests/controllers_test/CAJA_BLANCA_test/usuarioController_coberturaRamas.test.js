// test/userController.test.js
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt');
const Users = require('../models/users');
const userController = require('../controllers/userController');
 
describe('userController', () => {
 
    // Test para la Funcion para registrar un usuario
 
    describe('register_user_admin', () => {
        it('should register a user if the user is authenticated and email is not already in use', async () => {
            const req = {
                user: { _id: 'admin123' },
                body: { email: 'test@example.com', password: '123456' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
 
            sinon.stub(Users, 'find').resolves([]);
            sinon.stub(Users, 'create').resolves({ email: 'test@example.com' });
            sinon.stub(bcrypt, 'hash').yields(null, 'hashed_password');
 
            await userController.register_user_admin(req, res);
 
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ data: { email: 'test@example.com' } })).to.be.true;
            Users.find.restore();
            Users.create.restore();
            bcrypt.hash.restore();
        });
 
        // Si un Usuario ya existe
 
        it('should not register a user if the email is already in use', async () => {
            const req = {
                user: { _id: 'admin123' },
                body: { email: 'test@example.com' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
 
            sinon.stub(Users, 'find').resolves([{ email: 'test@example.com' }]);
 
            await userController.register_user_admin(req, res);
 
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ data: undefined, message: 'El correo electronico ya existe' })).to.be.true;
            Users.find.restore();
        });
 
    });
 
    // Test para la Funcion para iniciar sesion
 
    describe('login_users', () => {
        it('should log in a user with valid credentials', async () => {
            const req = { body: { email: 'test@example.com', password: '123456' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
 
            const user = { _id: 'user123', email: 'test@example.com', password: 'hashed_password', state: true };
            sinon.stub(Users, 'find').resolves([user]);
            sinon.stub(bcrypt, 'compare').yields(null, true);
            sinon.stub(jwt, 'createToken').returns('token123');
 
            await userController.login_users(req, res);
 
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ token: 'token123', userLog: user })).to.be.true;
            Users.find.restore();
            bcrypt.compare.restore();
            jwt.createToken.restore();
        });
 
        it('should not log in a user with invalid credentials', async () => {
            const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
 
            const user = { _id: 'user123', email: 'test@example.com', password: 'hashed_password', state: true };
            sinon.stub(Users, 'find').resolves([user]);
            sinon.stub(bcrypt, 'compare').yields(null, false);
 
            await userController.login_users(req, res);
 
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ data: undefined, message: 'El password es incorrecto' })).to.be.true;
            Users.find.restore();
            bcrypt.compare.restore();
        });
 
        it('should return error if the user is not found', async () => {
            const req = { body: { email: 'test@example.com', password: '123456' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
 
            sinon.stub(Users, 'find').resolves([]);
 
            await userController.login_users(req, res);
 
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ data: undefined, message: 'No se encontro el correo' })).to.be.true;
            Users.find.restore();
        });
    });
 
});