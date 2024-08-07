const mongoose = require('mongoose');
const Product = require('../models/product'); // Ajusta la ruta según sea necesario

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

describe('ProductSchema State Transition Tests', () => {

    it('should transition from "active" to "inactive"', async () => {
        const product = new Product({
            title: 'Producto de Ejemplo',
            slug: 'producto-de-ejemplo',
            category: 'Categoría de Ejemplo',
            subcategory: 'Subcategoría de Ejemplo',
            stock: 10,
            price: 100,
            variety: 'Variedad de Ejemplo',
            description: 'Descripción de Ejemplo',
            state: 'active',
            frontPage: 'imagen.jpg',
            discount: true
        });

        const savedProduct = await product.save();

        // Transition state
        savedProduct.state = 'inactive';
        const updatedProduct = await savedProduct.save();

        expect(updatedProduct.state).toBe('inactive');
    });

    it('should transition from "inactive" to "discontinued"', async () => {
        const product = new Product({
            title: 'Producto de Prueba',
            slug: 'producto-de-prueba',
            category: 'Categoría de Prueba',
            subcategory: 'Subcategoría de Prueba',
            stock: 5,
            price: 50,
            variety: 'Variedad de Prueba',
            description: 'Descripción de Prueba',
            state: 'inactive',
            frontPage: 'imagen_prueba.jpg',
            discount: false
        });

        const savedProduct = await product.save();

        // Transition state
        savedProduct.state = 'discontinued';
        const updatedProduct = await savedProduct.save();

        expect(updatedProduct.state).toBe('discontinued');
    });

    it('should handle invalid state transitions', async () => {
        const product = new Product({
            title: 'Producto Inválido',
            slug: 'producto-invalido',
            category: 'Categoría Inválida',
            subcategory: 'Subcategoría Inválida',
            stock: 0,
            price: 0,
            variety: 'Variedad Inválida',
            description: 'Descripción Inválida',
            state: 'unknown', // Invalid state
            frontPage: 'imagen_invalida.jpg',
            discount: true
        });

        try {
            await product.save();
        } catch (error) {
            expect(error.errors.state).toBeDefined();
        }
    });
});
