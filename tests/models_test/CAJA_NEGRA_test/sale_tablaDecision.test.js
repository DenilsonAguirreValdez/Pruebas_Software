// test/salesModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Sales = require('../models/sales');
const Customer = require('../models/customer');
const Address = require('../models/address');
 
describe('Sales Model - Decision Table Testing', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await Sales.deleteMany({});
        await Customer.deleteMany({});
        await Address.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    let customer, address;
 
    beforeEach(async () => {
        customer = await Customer.create({ name: 'Test Customer' });
        address = await Address.create({ street: '123 Test St' });
    });
 
    afterEach(async () => {
        await Sales.deleteMany({});
        await Customer.deleteMany({});
        await Address.deleteMany({});
    });
 
    it('should create a sale with valid fields', async () => {
        const sale = new Sales({
            transaction: 'TX123',
            year: 2023,
            month: 5,
            day: 15,
            serie: 1,
            total: 100.50,
            sending: 10.00,
            state: 'completed',
            customer: customer._id,
            addres: address._id
        });
 
        const savedSale = await sale.save();
        expect(savedSale._id).to.exist;
        expect(savedSale.transaction).to.equal('TX123');
        expect(savedSale.year).to.equal(2023);
        expect(savedSale.month).to.equal(5);
        expect(savedSale.day).to.equal(15);
        expect(savedSale.serie).to.equal(1);
        expect(savedSale.total).to.equal(100.50);
        expect(savedSale.sending).to.equal(10.00);
        expect(savedSale.state).to.equal('completed');
    });
 
    it('should fail to create a sale with an empty transaction', async () => {
        try {
            const sale = new Sales({
                transaction: '',  // Invalid
                year: 2023,
                month: 5,
                day: 15,
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('transaction');
        }
    });
 
    it('should fail to create a sale with an invalid year', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX124',
                year: 9999,  // Invalid
                month: 5,
                day: 15,
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('year');
        }
    });
 
    it('should fail to create a sale with an invalid month', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX125',
                year: 2023,
                month: 13,  // Invalid
                day: 15,
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('month');
        }
    });
 
    it('should fail to create a sale with an invalid day', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX126',
                year: 2023,
                month: 5,
                day: 32,  // Invalid
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('day');
        }
    });
 
    it('should fail to create a sale with an invalid serie', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX127',
                year: 2023,
                month: 5,
                day: 15,
                serie: 0,  // Invalid
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('serie');
        }
    });
 
    it('should fail to create a sale with an invalid total', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX128',
                year: 2023,
                month: 5,
                day: 15,
                serie: 1,
                total: -50.00,  // Invalid
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('total');
        }
    });
 
    it('should fail to create a sale with an invalid sending', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX129',
                year: 2023,
                month: 5,
                day: 15,
                serie: 1,
                total: 100.50,
                sending: -10.00,  // Invalid
                state: 'completed',
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('sending');
        }
    });
 
    it('should fail to create a sale with an invalid state', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX130',
                year: 2023,
                month: 5,
                day: 15,
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'invalid_state',  // Invalid
                customer: customer._id,
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('state');
        }
    });
 
    it('should fail to create a sale with an invalid customer reference', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX131',
                year: 2023,
                month: 5,
                day: 15,
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: mongoose.Types.ObjectId(),  // Invalid reference
                addres: address._id
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('customer');
        }
    });
 
    it('should fail to create a sale with an invalid address reference', async () => {
        try {
            const sale = new Sales({
                transaction: 'TX132',
                year: 2023,
                month: 5,
                day: 15,
                serie: 1,
                total: 100.50,
                sending: 10.00,
                state: 'completed',
                customer: customer._id,
                addres: mongoose.Types.ObjectId()  // Invalid reference
            });
            await sale.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('addres');
        }
    });
});