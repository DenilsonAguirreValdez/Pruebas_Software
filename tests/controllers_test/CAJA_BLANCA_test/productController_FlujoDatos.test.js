const { register_product } = require('../controllers/productController');
const Producto = require('../models/producto'); // Ajusta la ruta según la ubicación real

const mockProduct = {
    title: "Producto de Prueba",
    category: "Categoría de Prueba",
    subcategory: "Subcategoría de Prueba",
    variety: "Variedad de Prueba",
    description: "Descripción de Prueba",
    state: "Estado de Prueba",
    discount: 10,
    frontPage: "imagen.jpg",
    slug: "producto-de-prueba"
};

beforeEach(() => {
    jest.restoreAllMocks();
});

test('should register a product if title does not exist', async () => {
    // Mock Producto.find to return an empty array
    jest.spyOn(Producto, 'find').mockResolvedValue([]);

    // Mock Producto.create to return the mock product
    jest.spyOn(Producto, 'create').mockResolvedValue(mockProduct);

    const req = {
        user: true,
        body: mockProduct,
        files: { frontPage: { path: "uploads/products/imagen.jpg" } }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    await register_product(req, res);

    expect(Producto.find).toHaveBeenCalledWith({ title: mockProduct.title });
    expect(Producto.create).toHaveBeenCalledWith(mockProduct);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ data: mockProduct });
});

test('should return error if product title exists', async () => {
    // Mock Producto.find to return an array with one product
    jest.spyOn(Producto, 'find').mockResolvedValue([mockProduct]);

    const req = {
        user: true,
        body: mockProduct
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };

    await register_product(req, res);

    expect(Producto.find).toHaveBeenCalledWith({ title: mockProduct.title });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ data: undefined, message: 'El titulo del producto ya existe' });
});
