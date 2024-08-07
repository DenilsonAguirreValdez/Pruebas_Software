const mongoose = require('mongoose');
const Income = require('../models/income'); // Ajusta la ruta según sea necesario

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

describe('IncomeSchema Decision Table Tests', () => {

    it('should create an income document with all required fields present', async () => {
        const income = new Income({
            supplier: 'Proveedor de Ejemplo',
            nvoucher: '12345',
            document: 'Documento de Ejemplo',
            total_amount: '1000',
            series: 1,
            resulting_amount: '900',
            user: mongoose.Types.ObjectId() 
        });

        const savedIncome = await income.save();

        expect(savedIncome.supplier).toBe('Proveedor de Ejemplo');
        expect(savedIncome.nvoucher).toBe('12345');
        expect(savedIncome.document).toBe('Documento de Ejemplo');
        expect(savedIncome.total_amount).toBe('1000');
        expect(savedIncome.series).toBe(1);
        expect(savedIncome.resulting_amount).toBe('900');
        expect(savedIncome.user).toBeDefined();
    });

    it('should return validation error if required fields are missing', async () => {
        const testCases = [
            { supplier: 'Proveedor', nvoucher: '12345', document: 'Documento', total_amount: '1000', resulting_amount: '900', user: mongoose.Types.ObjectId() }, // Missing series
            { nvoucher: '12345', document: 'Documento', total_amount: '1000', series: 1, resulting_amount: '900', user: mongoose.Types.ObjectId() }, // Missing supplier
            { supplier: 'Proveedor', document: 'Documento', total_amount: '1000', series: 1, resulting_amount: '900', user: mongoose.Types.ObjectId() }, // Missing nvoucher
            { supplier: 'Proveedor', nvoucher: '12345', document: 'Documento', total_amount: '1000', series: 1, resulting_amount: '900' } // Missing user
        ];

        for (const testCase of testCases) {
            const income = new Income(testCase);

            try {
                await income.save();
            } catch (error) {
               
                if (testCase.supplier === undefined) {
                    expect(error.errors.supplier).toBeDefined();
                }
                if (testCase.nvoucher === undefined) {
                    expect(error.errors.nvoucher).toBeDefined();
                }
                if (testCase.document === undefined) {
                    expect(error.errors.document).toBeDefined();
                }
                if (testCase.total_amount === undefined) {
                    expect(error.errors.total_amount).toBeDefined();
                }
                if (testCase.user === undefined) {
                    expect(error.errors.user).toBeDefined();
                }
            }
        }
    });
});
