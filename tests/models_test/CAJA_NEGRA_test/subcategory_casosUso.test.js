// test/subcategoryModel.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
 
describe('Subcategory Model - Use Case Testing', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await Subcategory.deleteMany({});
        await Category.deleteMany({});
    });
 
    after(async () => {
        await mongoose.disconnect();
    });
 
    let category;
 
    beforeEach(async () => {
        category = await Category.create({ title: 'Test Category' });
    });
 
    afterEach(async () => {
        await Subcategory.deleteMany({});
        await Category.deleteMany({});
    });
 
    it('should create a subcategory successfully', async () => {
        const subcategory = new Subcategory({
            title: 'Test Subcategory',
            category: category._id
        });
 
        const savedSubcategory = await subcategory.save();
        expect(savedSubcategory._id).to.exist;
        expect(savedSubcategory.title).to.equal('Test Subcategory');
        expect(savedSubcategory.category.toString()).to.equal(category._id.toString());
    });
 
    it('should not create a subcategory without a title', async () => {
        try {
            const subcategory = new Subcategory({
                category: category._id
            });
 
            await subcategory.save();
        } catch (err) {
            expect(err.errors).to.have.property('title');
        }
    });
 
    it('should not create a subcategory without a category', async () => {
        try {
            const subcategory = new Subcategory({
                title: 'Test Subcategory'
            });
 
            await subcategory.save();
        } catch (err) {
            expect(err.errors).to.have.property('category');
        }
    });
 
    it('should retrieve a subcategory by ID', async () => {
        const subcategory = new Subcategory({
            title: 'Test Subcategory',
            category: category._id
        });
 
        const savedSubcategory = await subcategory.save();
        const foundSubcategory = await Subcategory.findById(savedSubcategory._id);
        expect(foundSubcategory).to.exist;
        expect(foundSubcategory.title).to.equal('Test Subcategory');
    });
 
    it('should list all subcategories', async () => {
        const subcategory1 = new Subcategory({
            title: 'Test Subcategory 1',
            category: category._id
        });
        const subcategory2 = new Subcategory({
            title: 'Test Subcategory 2',
            category: category._id
        });
 
        await subcategory1.save();
        await subcategory2.save();
 
        const subcategories = await Subcategory.find({});
        expect(subcategories.length).to.equal(2);
    });
 
    it('should update a subcategory title', async () => {
        const subcategory = new Subcategory({
            title: 'Old Title',
            category: category._id
        });
 
        const savedSubcategory = await subcategory.save();
        const updatedSubcategory = await Subcategory.findByIdAndUpdate(savedSubcategory._id, {
            title: 'New Title'
        }, { new: true });
 
        expect(updatedSubcategory.title).to.equal('New Title');
    });
 
    it('should delete a subcategory by ID', async () => {
        const subcategory = new Subcategory({
            title: 'Test Subcategory',
            category: category._id
        });
 
        const savedSubcategory = await subcategory.save();
        const deletedSubcategory = await Subcategory.findByIdAndDelete(savedSubcategory._id);
        expect(deletedSubcategory).to.exist;
        const foundSubcategory = await Subcategory.findById(savedSubcategory._id);
        expect(foundSubcategory).to.be.null;
    });
});
 