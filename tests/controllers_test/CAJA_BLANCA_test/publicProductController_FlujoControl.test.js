// test/publicProductController.test.js
const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const Product = require('../models/products');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Varieties = require('../models/variety');
const Gallery = require('../models/gallery');
const publicProductController = require('../controllers/publicProductController');
 
// Pruebas para "get_new_product"
 
describe('publicProductController', () => {
    describe('get_new_product', () => {
        it('should return the newest products', async () => {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
 
            const products = [
                { title: 'Product 1' },
                { title: 'Product 2' },
                { title: 'Product 3' },
                { title: 'Product 4' }
            ];
            sinon.stub(Product, 'find').returns({
                sort: sinon.stub().returnsThis(),
                limit: sinon.stub().resolves(products)
            });
 
            await publicProductController.get_new_product(req, res);
 
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(products)).to.be.true;
            Product.find.restore();
        });
    });
 
    // Pruebas para "get_product_recommended"
 
    describe('get_product_recommended', () => {
        it('should return recommended products', async () => {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
   
            const products = [
                { title: 'Product 1' },
                { title: 'Product 2' },
                { title: 'Product 3' },
                { title: 'Product 4' },
                { title: 'Product 5' },
                { title: 'Product 6' },
                { title: 'Product 7' },
                { title: 'Product 8' }
            ];
            sinon.stub(Product, 'find').returns({
                limit: sinon.stub().resolves(products)
            });
   
            await publicProductController.get_product_recommended(req, res);
   
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith(products)).to.be.true;
            Product.find.restore();
        });
    });
 
    // Pruebas para "get_product_shop"
 
    describe('get_product_shop', () => {
        it('should return products for the shop', async () => {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
   
            const products = [
                { _id: '1', title: 'Product 1', category: 'Category 1', subcategory: 'Subcategory 1', price: 100, variety: 'Variety 1', description: 'Description 1', state: true, frontPage: true, discount: 10, createdAt: new Date() },
                { _id: '2', title: 'Product 2', category: 'Category 2', subcategory: 'Subcategory 2', price: 200, variety: 'Variety 2', description: 'Description 2', state: true, frontPage: true, discount: 20, createdAt: new Date() }
            ];
            const varieties = [{ _id: '1', product: '1', name: 'Variety 1' }, { _id: '2', product: '2', name: 'Variety 2' }];
   
            sinon.stub(Product, 'find').returns({
                sort: sinon.stub().resolves(products)
            });
            sinon.stub(Varieties, 'find').resolves(varieties);
   
            await publicProductController.get_product_shop(req, res);
   
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.called).to.be.true;
            Product.find.restore();
            Varieties.find.restore();
        });
    });
 
    // Pruebas para "list_category_product"
 
    describe('list_category_product', () => {
        it('should list categories with their subcategories and number of products', async () => {
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
   
            const categories = [
                { _id: '1', title: 'Category 1' },
                { _id: '2', title: 'Category 2' }
            ];
            const subcategories = [
                { _id: '1', category: '1', title: 'Subcategory 1' },
                { _id: '2', category: '2', title: 'Subcategory 2' }
            ];
            const products = [
                { category: 'Category 1' },
                { category: 'Category 1' },
                { category: 'Category 2' }
            ];
   
            sinon.stub(Category, 'find').returns({
                sort: sinon.stub().resolves(categories)
            });
            sinon.stub(Subcategory, 'find').resolves(subcategories);
            sinon.stub(Product, 'find').resolves(products);
   
            await publicProductController.list_category_product(req, res);
   
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.called).to.be.true;
            Category.find.restore();
            Subcategory.find.restore();
            Product.find.restore();
        });
    });
 
    // Pruebas para "get_product_slug"
    describe('get_product_slug', () => {
        it('should return product details by slug', async () => {
            const req = { params: { slug: 'product-slug' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
   
            const product = { _id: '1', title: 'Product 1', slug: 'product-slug' };
            const varieties = [{ _id: '1', product: '1', name: 'Variety 1' }];
            const gallery = [{ _id: '1', product: '1', image: 'image1.jpg' }];
   
            sinon.stub(Product, 'findOne').resolves(product);
            sinon.stub(Varieties, 'find').resolves(varieties);
            sinon.stub(Gallery, 'find').resolves(gallery);
   
            await publicProductController.get_product_slug(req, res);
   
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ product, varieties, gallery })).to.be.true;
            Product.findOne.restore();
            Varieties.find.restore();
            Gallery.find.restore();
        });
    });
 
    // Pruebas para "get_product_category"
    describe('get_product_category', () => {
        it('should return products by category', async () => {
            const req = { params: { category: 'Category 1' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
   
            const products = [
                { _id: '1', category: 'Category 1', title: 'Product 1' },
                { _id: '2', category: 'Category 1', title: 'Product 2' }
            ];
   
            sinon.stub(Product, 'find').returns({
                limit: sinon.stub().resolves(products)
            });
   
            await publicProductController.get_product_category(req, res);
   
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({ product: products })).to.be.true;
            Product.find.restore();
        });
    });
 
 
});
tiene menú contextual