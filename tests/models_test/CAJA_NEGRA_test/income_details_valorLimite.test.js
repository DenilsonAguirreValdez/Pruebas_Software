const mongoose = require('mongoose');
const IncomeDetails = require('../models/income_details'); 
const Income = require('../models/income'); 
const Product = require('../models/product'); 
const Variety = require('../models/variety'); 

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('IncomeDetailsSchema Boundary Value Tests', () => {
    let income, product, variety;

    beforeEach(async () => {
        // Crear entradas necesarias para las pruebas
        income = new Income({  });
        product = new Product({  });
        variety = new Variety({ });
        await income.save();
        await product.save();
        await variety.save();
    });

    it('should handle maximum valid values for amount and unit_price', async () => {
        const maxAmount = Number.MAX_SAFE_INTEGER;
        const maxUnitPrice = Number.MAX_SAFE_INTEGER;

        const incomeDetails = new IncomeDetails({
            amount: maxAmount,
            unit_price: maxUnitPrice,
            income: income._id,
            product: product._id,
            variety: variety._id
        });

        const savedIncomeDetails = await incomeDetails.save();

        expect(savedIncomeDetails.amount).toBe(maxAmount);
        expect(savedIncomeDetails.unit_price).toBe(maxUnitPrice);
    });

    it('should handle minimum valid values for amount and unit_price', async () => {
        const minAmount = 0;
        const minUnitPrice = 0;

        const incomeDetails = new IncomeDetails({
            amount: minAmount,
            unit_price: minUnitPrice,
            income: income._id,
            product: product._id,
            variety: variety._id
        });

        const savedIncomeDetails = await incomeDetails.save();

        expect(savedIncomeDetails.amount).toBe(minAmount);
        expect(savedIncomeDetails.unit_price).toBe(minUnitPrice);
    });

    it('should return validation error if amount is missing', async () => {
        const incomeDetails = new IncomeDetails({
            unit_price: 100,
            income: income._id,
            product: product._id,
            variety: variety._id
        });

        try {
            await incomeDetails.save();
        } catch (error) {
            expect(error.errors.amount).toBeDefined();
        }
    });

    it('should return validation error if unit_price is missing', async () => {
        const incomeDetails = new IncomeDetails({
            amount: 100,
            income: income._id,
            product: product._id,
            variety: variety._id
        });

        try {
            await incomeDetails.save();
        } catch (error) {
            expect(error.errors.unit_price).toBeDefined();
        }
    });

    it('should return validation error if income is missing', async () => {
        const incomeDetails = new IncomeDetails({
            amount: 100,
            unit_price: 50,
            product: product._id,
            variety: variety._id
        });

        try {
            await incomeDetails.save();
        } catch (error) {
            expect(error.errors.income).toBeDefined();
        }
    });

    it('should return validation error if product is missing', async () => {
        const incomeDetails = new IncomeDetails({
            amount: 100,
            unit_price: 50,
            income: income._id,
            variety: variety._id
        });

        try {
            await incomeDetails.save();
        } catch (error) {
            expect(error.errors.product).toBeDefined();
        }
    });

    it('should return validation error if variety is missing', async () => {
        const incomeDetails = new IncomeDetails({
            amount: 100,
            unit_price: 50,
            income: income._id,
            product: product._id
        });

        try {
            await incomeDetails.save();
        } catch (error) {
            expect(error.errors.variety).toBeDefined();
        }
    });
});
