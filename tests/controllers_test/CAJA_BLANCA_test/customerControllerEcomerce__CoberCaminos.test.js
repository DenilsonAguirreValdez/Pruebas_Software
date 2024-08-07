const Car = require('../models/shopping');
const Variety = require('../models/variety');
const Address = require('../models/address');
const { create_product_car, get_product_car, delete_product_car, create_addres_customer, get_addres_customer, delete_addres_customer } = require('../controllers/shoppingController');

describe('ShoppingController', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks antes de cada prueba
  });

  describe('create_product_car', () => {
    it('should return an error if user is not authenticated', async () => {
      const req = { user: null, body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await create_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Error token' });
    });

    it('should return an error if amount exceeds stock', async () => {
      const req = { user: { sub: 'userId' }, body: { variety: 'varietyId', amount: 10 } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Variety, 'findById').mockResolvedValue({ stock: 5, product: { price: 100 } });

      await create_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Se supero el stock del producto' });

      Variety.findById.mockRestore();
    });

    it('should return an error if product price is less than 1', async () => {
      const req = { user: { sub: 'userId' }, body: { variety: 'varietyId', amount: 1 } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Variety, 'findById').mockResolvedValue({ stock: 10, product: { price: 0 } });

      await create_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'El producto tiene precio en 0' });

      Variety.findById.mockRestore();
    });

    it('should create a product car if valid conditions are met', async () => {
      const req = { user: { sub: 'userId' }, body: { variety: 'varietyId', amount: 1 } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Variety, 'findById').mockResolvedValue({ stock: 10, product: { price: 100 } });
      jest.spyOn(Car, 'create').mockResolvedValue({ variety: 'varietyId', amount: 1 });

      await create_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ variety: 'varietyId', amount: 1 });

      Variety.findById.mockRestore();
      Car.create.mockRestore();
    });
  });

  describe('get_product_car', () => {
    it('should return an error if user is not authenticated', async () => {
      const req = { user: null };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await get_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Error token' });
    });

    it('should return shopping cart data if user is authenticated', async () => {
      const req = { user: { sub: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const mockShopping = [{ product: 'productId', variety: 'varietyId' }];
      jest.spyOn(Car, 'find').mockResolvedValue(mockShopping);

      await get_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ shopping: mockShopping, shopping_all: mockShopping });

      Car.find.mockRestore();
    });
  });

  describe('delete_product_car', () => {
    it('should return an error if user is not authenticated', async () => {
      const req = { user: null, params: { id: 'productId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await delete_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Error token' });
    });

    it('should delete product from cart if user is authenticated', async () => {
      const req = { user: { sub: 'userId' }, params: { id: 'productId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Car, 'findByIdAndRemove').mockResolvedValue({ _id: 'productId' });

      await delete_product_car(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ _id: 'productId' });

      Car.findByIdAndRemove.mockRestore();
    });
  });

  describe('create_addres_customer', () => {
    it('should return an error if user is not authenticated', async () => {
      const req = { user: null, body: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await create_addres_customer(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Error token' });
    });

    it('should create an address if user is authenticated', async () => {
      const req = { user: { sub: 'userId' }, body: { address: '123 Main St' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Address, 'create').mockResolvedValue({ address: '123 Main St' });

      await create_addres_customer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ address: '123 Main St' });

      Address.create.mockRestore();
    });
  });

  describe('get_addres_customer', () => {
    it('should return an error if user is not authenticated', async () => {
      const req = { user: null };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await get_addres_customer(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Error token' });
    });

    it('should return address data if user is authenticated', async () => {
      const req = { user: { sub: 'userId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      const mockAddress = [{ address: '123 Main St' }];
      jest.spyOn(Address, 'find').mockResolvedValue(mockAddress);

      await get_addres_customer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockAddress);

      Address.find.mockRestore();
    });
  });

  describe('delete_addres_customer', () => {
    it('should return an error if user is not authenticated', async () => {
      const req = { user: null, params: { id: 'addressId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      await delete_addres_customer(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'Error token' });
    });

    it('should delete address if user is authenticated', async () => {
      const req = { user: { sub: 'userId' }, params: { id: 'addressId' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      jest.spyOn(Address, 'findByIdAndRemove').mockResolvedValue({ _id: 'addressId' });

      await delete_addres_customer(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ _id: 'addressId' });

      Address.findByIdAndRemove.mockRestore();
    });
  });

});
