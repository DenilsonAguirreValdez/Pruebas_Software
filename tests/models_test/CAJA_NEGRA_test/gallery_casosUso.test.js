const mongoose = require('mongoose');
const Gallery = require('../models/gallery'); // Ajusta la ruta según sea necesario
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

describe('GallerySchema Use Cases', () => {
    let product;

    beforeEach(async () => {
        // Crear un producto para asociar con la galería
        product = new Product({
            name: 'Sample Product',
            price: 100
        });
        await product.save();
    });

    it('should create a gallery entry', async () => {
        const galleryData = {
            imagen: 'image1.jpg',
            product: product._id
        };

        const gallery = new Gallery(galleryData);
        const savedGallery = await gallery.save();

        expect(savedGallery).toHaveProperty('_id');
        expect(savedGallery.imagen).toBe(galleryData.imagen);
        expect(savedGallery.product.toString()).toBe(galleryData.product.toString());
        expect(savedGallery.createdAt).toBeDefined();
    });

    it('should retrieve a gallery entry', async () => {
        const galleryData = {
            imagen: 'image2.jpg',
            product: product._id
        };

        const gallery = new Gallery(galleryData);
        await gallery.save();

        const retrievedGallery = await Gallery.findById(gallery._id).exec();

        expect(retrievedGallery).toBeDefined();
        expect(retrievedGallery.imagen).toBe(galleryData.imagen);
        expect(retrievedGallery.product.toString()).toBe(galleryData.product.toString());
    });

    it('should update a gallery entry', async () => {
        const galleryData = {
            imagen: 'image3.jpg',
            product: product._id
        };

        const gallery = new Gallery(galleryData);
        const savedGallery = await gallery.save();

        // Update the gallery entry
        savedGallery.imagen = 'updated_image.jpg';
        const updatedGallery = await savedGallery.save();

        expect(updatedGallery.imagen).toBe('updated_image.jpg');
    });

    it('should delete a gallery entry', async () => {
        const galleryData = {
            imagen: 'image4.jpg',
            product: product._id
        };

        const gallery = new Gallery(galleryData);
        const savedGallery = await gallery.save();

        await Gallery.findByIdAndRemove(savedGallery._id);

        const deletedGallery = await Gallery.findById(savedGallery._id).exec();
        expect(deletedGallery).toBeNull();
    });
});
