// test/salesDetailModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const SalesDetail = require('../models/salesDetail');
const Sale = require('../models/sale');
const Customer = require('../models/customer');
const Product = require('../models/product');
const Variety = require('../models/variety');
 
describe('SalesDetail Model - Boundary Value Analysis', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await SalesDetail.deleteMany({});
        await Sale.deleteMany({});
        await Customer.deleteMany({});
        await Product.deleteMany({});
        await Variety.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    let sale, customer, product, variety;
 
    beforeEach(async () => {
        sale = await Sale.create({ /* campos necesarios para crear una venta */ });
        customer = await Customer.create({ name: 'Test Customer' });
        product = await Product.create({ name: 'Test Product' });
        variety = await Variety.create({ name: 'Test Variety' });
    });
 
    afterEach(async () => {
        await SalesDetail.deleteMany({});
        await Sale.deleteMany({});
        await Customer.deleteMany({});
        await Product.deleteMany({});
        await Variety.deleteMany({});
    });
 
    it('should create a sales detail with valid fields at boundary limits', async () => {
        const salesDetail = new SalesDetail({
            year: 2023,
            month: 12,
            day: 31,
            subtotal: '99999.99',
            price_unit: 1000,
            amount: 100,
            sales: sale._id,
            customer: customer._id,
            product: product._id,
            variety: variety._id
        });
 
        const savedSalesDetail = await salesDetail.save();
        expect(savedSalesDetail._id).to.exist;
        expect(savedSalesDetail.year).to.equal(2023);
        expect(savedSalesDetail.month).to.equal(12);
        expect(savedSalesDetail.day).to.equal(31);
        expect(savedSalesDetail.subtotal).to.equal('99999.99');
        expect(savedSalesDetail.price_unit).to.equal(1000);
        expect(savedSalesDetail.amount).to.equal(100);
    });
 
    it('should fail to create a sales detail with invalid year', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 10000,  // Invalid year
                month: 12,
                day: 31,
                subtotal: '100.00',
                price_unit: 50,
                amount: 2,
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('year');
        }
    });
 
    it('should fail to create a sales detail with invalid month', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 2023,
                month: 13,  // Invalid month
                day: 31,
                subtotal: '100.00',
                price_unit: 50,
                amount: 2,
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('month');
        }
    });
 
    it('should fail to create a sales detail with invalid day', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 2023,
                month: 12,
                day: 32,  // Invalid day
                subtotal: '100.00',
                price_unit: 50,
                amount: 2,
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('day');
        }
    });
 
    it('should fail to create a sales detail with empty subtotal', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 2023,
                month: 12,
                day: 31,
                subtotal: '',  // Empty subtotal
                price_unit: 50,
                amount: 2,
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('subtotal');
        }
    });
 
    it('should fail to create a sales detail with overly long subtotal', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 2023,
                month: 12,
                day: 31,
                subtotal: '1'.repeat(256),  // Overly long subtotal
                price_unit: 50,
                amount: 2,
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('subtotal');
        }
    });
 
    it('should fail to create a sales detail with invalid price_unit', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 2023,
                month: 12,
                day: 31,
                subtotal: '100.00',
                price_unit: -1,  // Invalid price_unit
                amount: 2,
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('price_unit');
        }
    });
 
    it('should fail to create a sales detail with invalid amount', async () => {
        try {
            const salesDetail = new SalesDetail({
                year: 2023,
                month: 12,
                day: 31,
                subtotal: '100.00',
                price_unit: 50,
                amount: -1,  // Invalid amount
                sales: sale._id,
                customer: customer._id,
                product: product._id,
                variety: variety._id
            });
            await salesDetail.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('amount');
        }
    });
});