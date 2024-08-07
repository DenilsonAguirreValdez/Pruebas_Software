// test/varietyModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Variety = require('../models/variety');
 
describe('Variety Model - Decision Table Testing', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await Variety.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    it('should not create a variety with empty fields and invalid stock', async () => {
        try {
            const variety = new Variety({
                supplier: '',
                variety: '',
                stock: -1,
                sku: '',
                product: null
            });
            await variety.save();
        } catch (err) {
            expect(err.errors).to.have.property('supplier');
            expect(err.errors).to.have.property('variety');
            expect(err.errors).to.have.property('stock');
            expect(err.errors).to.have.property('sku');
            expect(err.errors).to.have.property('product');
        }
    });
 
    it('should create a variety with valid data', async () => {
        const variety = new Variety({
            supplier: 'Supplier A',
            variety: 'Variety A',
            stock: 10,
            sku: 'SKU123',
            product: mongoose.Types.ObjectId() // Assuming this is a valid product ID
        });
        const savedVariety = await variety.save();
        expect(savedVariety._id).to.exist;
        expect(savedVariety.supplier).to.equal('Supplier A');
        expect(savedVariety.variety).to.equal('Variety A');
        expect(savedVariety.stock).to.equal(10);
        expect(savedVariety.sku).to.equal('SKU123');
        expect(savedVariety.product).to.be.an('object');
    });
 
    it('should not create a variety with an empty supplier', async () => {
        try {
            const variety = new Variety({
                supplier: '',
                variety: 'Variety B',
                stock: 5,
                sku: 'SKU124',
                product: mongoose.Types.ObjectId()
            });
            await variety.save();
        } catch (err) {
            expect(err.errors).to.have.property('supplier');
        }
    });
 
    it('should not create a variety with a negative stock', async () => {
        try {
            const variety = new Variety({
                supplier: 'Supplier B',
                variety: 'Variety C',
                stock: -5,
                sku: 'SKU125',
                product: mongoose.Types.ObjectId()
            });
            await variety.save();
        } catch (err) {
            expect(err.errors).to.have.property('stock');
        }
    });
 
    it('should create a variety with a zero stock', async () => {
        const variety = new Variety({
            supplier: 'Supplier C',
            variety: 'Variety D',
            stock: 0,
            sku: 'SKU126',
            product: mongoose.Types.ObjectId()
        });
        const savedVariety = await variety.save();
        expect(savedVariety._id).to.exist;
        expect(savedVariety.stock).to.equal(0);
    });
 
    it('should create a variety with a valid SKU and product ID', async () => {
        const variety = new Variety({
            supplier: 'Supplier D',
            variety: 'Variety E',
            stock: 15,
            sku: 'SKU127',
            product: mongoose.Types.ObjectId()
        });
        const savedVariety = await variety.save();
        expect(savedVariety._id).to.exist;
        expect(savedVariety.sku).to.equal('SKU127');
        expect(savedVariety.product).to.be.an('object');
    });
});