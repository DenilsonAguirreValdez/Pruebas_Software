const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/custJwt');
const Customer = require('../models/customer');
const { register_user_ecomerce, login_users_ecomerce } = require('../controllers/customerControllerEcomerce');

describe('CustomerController', () => {
  describe('register_user_ecomerce', () => {
    it('should return an error if email already exists', async () => {
      const req = { body: { email: 'existing@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([{ email: 'existing@example.com' }]);

      await register_user_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'El correo electronico ya existe!' });

      Customer.find.mockRestore();
    });

    it('should return an error if bcrypt hash fails', async () => {
      const req = { body: { email: 'new@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([]);
      jest.spyOn(bcrypt, 'hash').callsFake((password, salt, callback) => callback(new Error('Error')));

      await register_user_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Erro en la encriptacion' });

      Customer.find.mockRestore();
      bcrypt.hash.mockRestore();
    });

    it('should create a new customer if email does not exist and bcrypt hash succeeds', async () => {
      const req = { body: { email: 'new@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([]);
      jest.spyOn(bcrypt, 'hash').callsFake((password, salt, callback) => callback(null, 'hashed_password'));
      jest.spyOn(Customer, 'create').mockResolvedValue({ email: 'new@example.com', password: 'hashed_password' });

      await register_user_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ email: 'new@example.com', password: 'hashed_password' });

      Customer.find.mockRestore();
      bcrypt.hash.mockRestore();
      Customer.create.mockRestore();
    });
  });

  describe('login_users_ecomerce', () => {
    it('should return an error if email is not found', async () => {
      const req = { body: { email: 'notfound@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([]);

      await login_users_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'No se encontro el correo' });

      Customer.find.mockRestore();
    });

    it('should return an error if account is deactivated', async () => {
      const req = { body: { email: 'inactive@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([{ state: false }]);

      await login_users_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Su cuenta esta desactivada' });

      Customer.find.mockRestore();
    });

    it('should return an error if password is incorrect', async () => {
      const req = { body: { email: 'user@example.com', password: 'wrongpassword' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([{ state: true, password: 'hashed_password' }]);
      jest.spyOn(bcrypt, 'compare').callsFake((password, hash, callback) => callback(null, false));

      await login_users_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'El password es incorrecto' });

      Customer.find.mockRestore();
      bcrypt.compare.mockRestore();
    });

    it('should return a token if email and password are correct', async () => {
      const req = { body: { email: 'user@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Customer, 'find').mockResolvedValue([{ state: true, password: 'hashed_password' }]);
      jest.spyOn(bcrypt, 'compare').callsFake((password, hash, callback) => callback(null, true));
      jest.spyOn(jwt, 'createToken').mockReturnValue('token');

      await login_users_ecomerce(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ token: 'token', userLog: { state: true, password: 'hashed_password' } });

      Customer.find.mockRestore();
      bcrypt.compare.mockRestore();
      jwt.createToken.mockRestore();
    });
  });
});
