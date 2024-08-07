const mongoose = require('mongoose');
const Addres = require('../models/address'); // Ajusta la ruta según sea necesario

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

describe('AddresSchema', () => {
    it('should create an address with valid data', async () => {
        const validData = {
            name: 'John',
            lastName: 'Doe',
            idDocument: '123456789',
            phone: '123-456-7890',
            country: 'Country',
            city: 'City',
            code: '12345',
            address: '123 Main St',
            customer: mongoose.Types.ObjectId()  // Assuming you have a valid customer ID
        };

        const address = new Addres(validData);
        const savedAddress = await address.save();
        
        expect(savedAddress.name).toBe(validData.name);
        expect(savedAddress.lastName).toBe(validData.lastName);
        expect(savedAddress.idDocument).toBe(validData.idDocument);
        expect(savedAddress.phone).toBe(validData.phone);
        expect(savedAddress.country).toBe(validData.country);
        expect(savedAddress.city).toBe(validData.city);
        expect(savedAddress.code).toBe(validData.code);
        expect(savedAddress.address).toBe(validData.address);
    });

    it('should not create an address with missing required fields', async () => {
        const invalidData = {
            name: 'John',
            lastName: 'Doe',
            idDocument: '123456789',
            phone: '123-456-7890',
            // Missing country
            city: 'City',
            code: '12345',
            address: '123 Main St',
            customer: mongoose.Types.ObjectId()
        };

        try {
            const address = new Addres(invalidData);
            await address.save();
        } catch (error) {
            expect(error.errors.country).toBeDefined();
        }
    });

    it('should not create an address with invalid phone format', async () => {
        const invalidPhoneData = {
            name: 'John',
            lastName: 'Doe',
            idDocument: '123456789',
            phone: 'invalid-phone', // Invalid phone
            country: 'Country',
            city: 'City',
            code: '12345',
            address: '123 Main St',
            customer: mongoose.Types.ObjectId()
        };

        try {
            const address = new Addres(invalidPhoneData);
            await address.save();
        } catch (error) {
            expect(error.errors.phone).toBeDefined();
        }
    });
});