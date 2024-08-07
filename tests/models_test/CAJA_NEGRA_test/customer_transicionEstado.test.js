const mongoose = require('mongoose');
const Customer = require('../models/customer'); // Ajusta la ruta según sea necesario

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

describe('CustomerSchema State Transitions', () => {
    it('should create a customer with the default state as true', async () => {
        const customerData = {
            name: 'John',
            email: 'john.doe@example.com',
            password: 'securepassword'
        };

        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();

        expect(savedCustomer.state).toBe(true); // Default state should be true
    });

    it('should update the customer state to false', async () => {
        const customerData = {
            name: 'Jane',
            email: 'jane.doe@example.com',
            password: 'anothersecurepassword'
        };

        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();

        // Update the state
        savedCustomer.state = false;
        const updatedCustomer = await savedCustomer.save();

        expect(updatedCustomer.state).toBe(false);
    });

    it('should handle state transitions correctly', async () => {
        const customerData = {
            name: 'Alice',
            email: 'alice.doe@example.com',
            password: 'yetanotherpassword'
        };

        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();

        // Transition state from true to false
        savedCustomer.state = false;
        const updatedCustomer = await savedCustomer.save();
        expect(updatedCustomer.state).toBe(false);

        // Transition state back to true
        updatedCustomer.state = true;
        const reUpdatedCustomer = await updatedCustomer.save();
        expect(reUpdatedCustomer.state).toBe(true);
    });
});
