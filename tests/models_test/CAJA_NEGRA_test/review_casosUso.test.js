// test/reviewModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Review = require('../models/review');
const Product = require('../models/product');
const Customer = require('../models/customer');
 
describe('Review Model', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await Review.deleteMany({});
        await Product.deleteMany({});
        await Customer.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    let product, customer;
 
    beforeEach(async () => {
        product = await Product.create({ name: 'Test Product' });
        customer = await Customer.create({ name: 'Test Customer' });
    });
 
    afterEach(async () => {
        await Review.deleteMany({});
        await Product.deleteMany({});
        await Customer.deleteMany({});
    });
 
    it('should create a review with valid fields', async () => {
        const review = new Review({
            start: 5,
            comment: 'Great product!',
            product: product._id,
            customer: customer._id
        });
 
        const savedReview = await review.save();
        expect(savedReview._id).to.exist;
        expect(savedReview.start).to.equal(5);
        expect(savedReview.comment).to.equal('Great product!');
    });
 
    it('should fail to create a review without required fields', async () => {
        try {
            const review = new Review({
                start: 5
            });
            await review.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('comment');
            expect(err.errors).to.have.property('product');
            expect(err.errors).to.have.property('customer');
        }
    });
 
    it('should fail to create a review with incorrect data types', async () => {
        try {
            const review = new Review({
                start: 'five',
                comment: 12345,
                product: 'invalidproductid',
                customer: 'invalidcustomerid'
            });
            await review.save();
        } catch (err) {
            expect(err).to.exist;
            expect(err.errors).to.have.property('start');
            expect(err.errors).to.have.property('comment');
            expect(err.errors).to.have.property('product');
            expect(err.errors).to.have.property('customer');
        }
    });
 
    it('should retrieve reviews from the database', async () => {
        const review = new Review({
            start: 5,
            comment: 'Great product!',
            product: product._id,
            customer: customer._id
        });
        await review.save();
 
        const reviews = await Review.find({});
        expect(reviews).to.have.lengthOf(1);
        expect(reviews[0].comment).to.equal('Great product!');
    });
 
    it('should update an existing review', async () => {
        const review = new Review({
            start: 5,
            comment: 'Great product!',
            product: product._id,
            customer: customer._id
        });
        const savedReview = await review.save();
 
        const updatedReview = await Review.findByIdAndUpdate(
            savedReview._id,
            { comment: 'Updated comment' },
            { new: true }
        );
 
        expect(updatedReview.comment).to.equal('Updated comment');
    });
 
    it('should delete a review', async () => {
        const review = new Review({
            start: 5,
            comment: 'Great product!',
            product: product._id,
            customer: customer._id
        });
        const savedReview = await review.save();
 
        await Review.findByIdAndDelete(savedReview._id);
        const deletedReview = await Review.findById(savedReview._id);
        expect(deletedReview).to.be.null;
    });
});