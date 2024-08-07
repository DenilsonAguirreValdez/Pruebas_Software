// test/shoppingModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Shopping = require('../models/shopping');
const Product = require('../models/product');
const Variety = require('../models/variety');
const Customer = require('../models/customer');
 
describe('Shopping Model - State Transition Testing', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await Shopping.deleteMany({});
        await Product.deleteMany({});
        await Variety.deleteMany({});
        await Customer.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    let product, variety, customer;
 
    beforeEach(async () => {
        product = await Product.create({ title: 'Test Product', price: 100 });
        variety = await Variety.create({ product: product._id, stock: 50 });
        customer = await Customer.create({ name: 'Test Customer' });
    });
 
    afterEach(async () => {
        await Shopping.deleteMany({});
        await Product.deleteMany({});
        await Variety.deleteMany({});
        await Customer.deleteMany({});
    });
 
    it('should transition from non-existence to existence upon creation', async () => {
        const shopping = new Shopping({
            product: product._id,
            variety: variety._id,
            amount: 2,
            customer: customer._id
        });
 
        const savedShopping = await shopping.save();
        expect(savedShopping._id).to.exist;
        expect(savedShopping.product).to.equal(product._id);
        expect(savedShopping.variety).to.equal(variety._id);
        expect(savedShopping.amount).to.equal(2);
        expect(savedShopping.customer).to.equal(customer._id);
    });
 
    it('should transition from existence to non-existence upon deletion', async () => {
        const shopping = new Shopping({
            product: product._id,
            variety: variety._id,
            amount: 2,
            customer: customer._id
        });
 
        const savedShopping = await shopping.save();
        const deletedShopping = await Shopping.findByIdAndDelete(savedShopping._id);
        expect(deletedShopping).to.exist;
        const foundShopping = await Shopping.findById(savedShopping._id);
        expect(foundShopping).to.be.null;
    });
 
    it('should handle changes in referenced products and varieties', async () => {
        const newProduct = await Product.create({ title: 'New Product', price: 200 });
        const newVariety = await Variety.create({ product: newProduct._id, stock: 100 });
 
        const shopping = new Shopping({
            product: product._id,
            variety: variety._id,
            amount: 2,
            customer: customer._id
        });
 
        const savedShopping = await shopping.save();
        const updatedShopping = await Shopping.findByIdAndUpdate(savedShopping._id, {
            product: newProduct._id,
            variety: newVariety._id
        }, { new: true });
 
        expect(updatedShopping.product).to.equal(newProduct._id);
        expect(updatedShopping.variety).to.equal(newVariety._id);
    });
});
 
