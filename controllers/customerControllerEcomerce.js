const Address = require('../models/address');
const Car = require('../models/shopping');
const Variety = require('../models/variety');

// crear carrito de compras de un cliente
const create_product_car = async(req, res) => {
    if(req.user){
        console.log("verifi", req.user);
        let data = req.body;

        const variety = await Variety.findById({_id:data.variety}).populate('product');
        if(data.amount <= variety.stock){
            if(variety.product.price >=1 ){
                const car_product = await Car.create(data);
                res.status(200).send(car_product);
            }else{
                res.status(200).send({dat: undefined, message: 'El producto tiene precion en 0'});
            }

        }else{
            res.status(200).send({data:undefined, message: 'Se supero el stock del producto'})
        }
    }else{
        res.status(500).send({data: undefined, message: 'Error token'});
    }
};

// obtener el carrito de compras de un cliente
const get_product_car = async(req, res) => {
    if(req.user){
        let shopping = await Car.find({customer: req.user.sub})
        .populate('product').populate('variety').sort({createdAt: -1}).limit(5);
        let shopping_all = await Car.find({customer: req.user.sub})
        .populate('product').populate('variety').sort({createdAt: -1})

        res.status(200).send({shopping, shopping_all});
    }else{
        res.status(500).send({data: undefined, message: 'Error token'});
    }
};

const delete_product_car = async(req, res) => {
    if(req.user){
        const id = req.params['id'];
        const reg = await Car.findByIdAndRemove({_id:id});
        res.status(200).send(reg);
    }else{
        res.status(500).send({data: undefined, message: 'Error token'});
    }
};

const create_addres_customer = async(req, res) => {
    if(req.user){
        const data = req.body;
        data.customer = req.user.sub;
        const address = await Address.create(data);
        res.status(200).send(address);
    }else{
        res.status(500).send({data: undefined, message: 'Error token'});
    }
};

const get_addres_customer = async(req, res) => {
    if(req.user){
        const address = await Address.find({customer: req.user.sub});
        res.status(200).send(address);
    }else{
        res.status(500).send({data: undefined, message: 'Error token'});
    }
};

const delete_addres_customer = async(req, res) => {
    if(req.user){
        const id = req.params['id']
        const address = await Address.findByIdAndRemove({_id:id});
        res.status(200).send(address);
    }else{
        res.status(500).send({data: undefined, message: 'Error token'});
    }
};


module.exports = {
    create_product_car,
    get_product_car,
    delete_product_car,
    create_addres_customer,
    get_addres_customer,
    delete_addres_customer
}