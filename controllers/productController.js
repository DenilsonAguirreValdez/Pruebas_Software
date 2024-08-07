const Producto =  require('../models/products');
const Variety = require('../models/variety');
const Category =  require('../models/category');
const Subcategory = require('../models/subcategory');
const Income = require('../models/income');
const IncomeDetails = require('../models/income_details');
const Gallery = require('../models/gallery');
var slugify = require('slugify');
var fs = require('fs');
var path = require('path');

const register_product = async(req, res) => {
    if(req.user){
        let data= req.body;
        //console.log(data);

        let products = await Producto.find({
            title: data.title
        });
        console.log(products.length);

        if(products.length >= 1){
            res.status(200).send({data: undefined, message: 'El titulo del producto ya existe'});
        }else{
            //Registrar producto
            let img_path = req.files.frontPage.path;
            let str_img = img_path.split("\\");
            let str_frontPage = str_img[2];
            console.log(str_frontPage);

            data.frontPage = str_frontPage;
            data.slug = slugify(data.title);
            try {
                const product = await Producto.create(data);
                res.status(200).send({data: product})
                console.log(product)
            } catch (error) {
                console.log(error);
                res.status(500).send({data:undefined, message: 'No se pudo crear el producto'})
            }
        }
    }else{
        res.status(500).send({data:undefined, message: 'Error token'})
    }
};

const get_products = async(req, res) => {
    if(req.user){
        let filter = req.params['filter'];
         let produts = await Producto.find({
            $or:[
                {title: new RegExp(filter, 'i')},
                {category: new RegExp(filter, 'i')}
            ]
         }).sort({createdAt: -1});
         res.status(200).send(produts);
    }else{
        res.status(500).send({data:undefined, message: 'Error token'});
    }
};

//obtener portada
const get_frontPage_product = async(req, res) => {
    let img = req.params['img']
    fs.stat('./uploads/products/'+img, (error) => {
        if(error){
            let img_path = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(img_path));
        }else{
            let img_path = './uploads/products/'+img;
            res.status(200).sendFile(path.resolve(img_path));
        }
    })
        
}

//obtenemos el producto para editarlo
const get_product_id = async(req, res) =>{
    if(req.user){
        let id = req.params['id'];
        try {
            let product = await Producto.findById({_id: id})
            res.status(200).send(product);
        } catch (error) {
            res.status(200).send(undefined);
        }
    }else{
        res.status(500).send({data:undefined, message: 'Error Token'});
    }
};

// Actualizar un producto
const update_product = async(req, res) => {
    console.log("--", req.files);
    if(req.user){
        let data= req.body;
        let id = req.params['id']

        let products = await Producto.find({
            title: data.title
        });
        console.log(products.length);

        if(products.length >= 1){
            if(products[0]._id == id){
                //Actualizar producto
                if(req.files){
                    let img_path = req.files.frontPage.path;
                    let str_img = img_path.split("\\");
                    let str_frontPage = str_img[2];
                    console.log(str_frontPage);
    
                    data.frontPage = str_frontPage;
                    data.slug = slugify(data.title);
                    try {
                        const product = await Producto.findByIdAndUpdate({_id:id}, {
                            title: data.title,
                            category: data.category,
                            subcategory: data.subcategory,
                            variety: data.variety,
                            description: data.description,
                            state: data.stat,
                            discount: data.discount,
                            str_frontPage: data.str_frontPage
                        });
                        res.status(200).send({data: product})
                    } catch (error) {
                     res.status(500).send({data:undefined, message: 'No se pudo crear el producto'})
                    }
                }else{
                
                data.slug = slugify(data.title);
                try {
                    const product = await Producto.findByIdAndUpdate({_id:id}, {
                        title: data.title,
                        category: data.category,
                        subcategory: data.subcategory,
                        variety: data.variety,
                        description: data.description,
                        state: data.stat,
                        discount: data.discount
                    });
                    res.status(200).send({data: product});
                } catch (error) {
                    res.status(500).send({data:undefined, message: 'No se pudo crear el producto'})
                }
            }
            }else{
                res.status(200).send({data: undefined, message: 'El titulo del producto ya existe'});
            }
        }else{
            //Actualizar producto
            if(req.files){
                let img_path = req.files.frontPage.path;
                let str_img = img_path.split("\\");
                let str_frontPage = str_img[2];
                console.log(str_frontPage);
    
                data.frontPage = str_frontPage;
                data.slug = slugify(data.title);
                try {
                    const product = await Producto.findByIdAndUpdate({_id:id}, {
                        title: data.title,
                        category: data.category,
                        subcategory: data.subcategory,
                        variety: data.variety,
                        description: data.description,
                        state: data.stat,
                        discount: data.discount,
                        str_frontPage: data.str_frontPage
                    });
                    res.status(200).send({data: product})
                } catch (error) {
                    res.status(500).send({data:undefined, message: 'No se pudo crear el producto'})
                }
            }else{
                
                data.slug = slugify(data.title);
                try {
                    const product = await Producto.findByIdAndUpdate({_id:id}, {
                        title: data.title,
                        category: data.category,
                        subcategory: data.subcategory,
                        variety: data.variety,
                        description: data.description,
                        state: data.stat,
                        discount: data.discount
                    });
                    res.status(200).send({data: product})
                } catch (error) {
                    res.status(500).send({data:undefined, message: 'No se pudo crear el producto'})
                }
            }
        }
    }else{
        res.status(500).send({data:undefined, message: 'Error token'})
    }
};

const register_variety_product = async(req, res) => {
    if(req.user){
        let data = req.body;
        const variety = await Variety.create(data);
        res.status(200).send({data: variety});
    }else{
        res.status(500).send({data:undefined, message: 'Error token'});
    }
};

const get_variety_product = async(req, res)=>{
    if(req.user){
        let id = req.params['id'];
        const variety = await Variety.find({product: id}).sort({stock: -1});
        res.status(200).send(variety);
    }else{
        res.status(500).send({data:undefined, message: 'Error token'});
    }
};

const delete_variety_product = async(req, res)=>{
    if(req.user){
        let id = req.params['id'];

        let reg = await Variety.findById({_id:id});
        if(reg.stock == 0){
            const variety = await Variety.findByIdAndRemove({_id: id});
            res.status(200).send(variety);
        }else{
            res.status(200).send({data:undefined, message: 'No se puede eliminar esta variedad'});
        }
        
    }else{
        res.status(500).send({data:undefined, message: 'Error token'});
    }
};

const get_all_products = async(req, res) => {
    if(req.user){
         let produts = await Producto.find({state: true}).sort({createdAt: -1});
         res.status(200).send(produts);
    }else{
        res.status(500).send({data:undefined, message: 'Error token'});
    }
};

const register_income = async(req, res) => {
    if(req.user){
        const data = req.body; //Ingreso
        try {
            const reg_serie = await Income.find().sort({createdAt: -1});

            if(reg_serie.length == 0){
                data.series = 1;
            }else{
                data.series = reg_serie[0].series + 1;
            }
            const details = JSON.parse(data.details); //Detalles de ingreso

            const img_path = req.files.document.path;
            const str_img = img_path.split("\\");
            const str_document = str_img[2];

            data.document = str_document;
            data.user = req.user.sub
            const income = await Income.create(data);

            for(var item of details){
                item.income = income._id;
                await IncomeDetails.create(item);

                //Actualizar stock de variedad
                const variety = await Variety.findById({_id: item.variety});
                await Variety.findByIdAndUpdate({_id: item.variety}, {
                    stock: parseInt(variety.stock) + parseInt(item.amount)
                });

                // Actualizar stock de producto
                const product = await Producto.findById({_id: item.product});
                await Producto.findByIdAndUpdate({_id: item.product}, {
                    stock: parseInt(product.stock) + parseInt(item.amount)
                });

                // Margen de ganancia
                if(product.stock >= 1){

                }else{
                    const revenue = Math.ceil((item.unit_price * data.revenue) / 100);
                    await Producto.findByIdAndUpdate({_id: item.product}, {
                        price: parseFloat(item.unit_price) + parseFloat(revenue)
                    });
                }
                
            }
            res.status(200).send(income);
    
        } catch (error) {
           res.status(200).send({message: 'No se puedo registrar el ingreso'}); 
        }
    }else{
        res.status(500).send({data:undefined, message: 'Error token'});
    }
};

// Registrar imagne del producto
const register_imagen = async(req, res) => {
    if(req.user){
        let data= req.body;

        let img_path = req.files.imagen.path;
        let str_img = img_path.split("\\");
        let str_imagen = str_img[2];

        data.imagen = str_imagen;

        try {
            const imagen = await Gallery.create(data);
            res.status(200).send(imagen);
        } catch (error) {
            res.status(500).send({data:undefined, message: 'No se pudo subir la imagen'})
        }
    }else{
        res.status(500).send({data:undefined, message: 'Error token'})
    }
};

const get_gallery_product = async (req, res) => {
  let img = req.params["img"];
  fs.stat("./uploads/gallery/" + img, (error) => {
    if (error) {
      let img_path = "./uploads/default.jpg";
      res.status(200).sendFile(path.resolve(img_path));
    } else {
      let img_path = "./uploads/gallery/" + img;
      res.status(200).sendFile(path.resolve(img_path));
    }
  });
};

const list_image_gallery = async (req, res) => {
  if (req.user) {
    const id = req.params['id'];

    const gallery = await Gallery.find({product: id});
    res.status(200).send(gallery);

  } else {
    res.status(500).send({ data: undefined, message: "Error token" });
  }
};

const delete_image_gallery = async (req, res) => {
    if (req.user) {
      const id = req.params['id'];
  
      try {
        let reg = await Gallery.findById({_id:id})
        let img_path = "./uploads/gallery/" + reg.imagen;
        fs.unlinkSync(img_path);
        const gallery = await Gallery.findByIdAndRemove({_id: id});
        res.status(200).send(gallery);
  
      } catch (error) {
        res.status(200).send({data: undefined, message: 'No se puedo eliminar la imagen'});
      }
    } else {
      res.status(500).send({ data: undefined, message: "Error token" });
    }
};

// Crear nueva categoria
const create_category = async (req, res) => {
    if (req.user) {
      const data = req.body;

      try {
        const reg = await Category.find({title: data.title});
        if(reg.length == 0){
            data.slug = slugify(data.title).toLowerCase();
            const category = await Category.create(data);
            res.status(200).send(category);
        }else{
        res.status(200).send({ data: undefined, message: "La categoria ya existe" });
      }
      } catch (error) {
        res.status(200).send({ data: undefined, message: "Ocurrio un error" });
      }

     
    } else {
      res.status(500).send({ data: undefined, message: "Error token" });
    }
};

// Listar categorias
const list_category = async (req, res) => {
    if (req.user) {

        var regs = await Category.find().sort({title: 1});
        var categories = [];

        for(var item of regs){
            var subcategory = await Subcategory.find({category:item._id})
            var products = await Producto.find({category:item.title});

            categories.push({
                category: item,
                subcategory,
                nproducts: products.length,
            })
        }
        res.status(200).send(categories);
     
    } else {
      res.status(500).send({ data: undefined, message: "Error token" });
    }
};

// eliminar subcategoria
const delete_subcategory = async(req, res) => {
    if(req.user){
        const id = req.params['id'];

        const subcategory = await Subcategory.findByIdAndRemove({_id:id});
        res.status(200).send(subcategory);
    }else{
        res.status(500).send({ data: undefined, message: "Error token" }); 
    }
}

// Crear nueva subcategoria
const create_subcategory = async (req, res) => {
    if (req.user) {
      const data = req.body;

      const reg = await Subcategory.find({title: data.title});
      if(reg.length == 0){
        const subcategory = await Subcategory.create(data);
        res.status(200).send(subcategory);
      }else{
        res.status(200).send({ data: undefined, message: "La subcategoria ya existe" });
      }

     
    } else {
      res.status(500).send({ data: undefined, message: "Error token" });
    }
};

// cambiar estado de producto
const change_status_to_product = async(req, res)=> {
    if(req.user){
      let id = req.params['id'];
      let data = req.body;
      let new_state = false;
  
      if(data.state){
        new_state = false;
      }else{
        new_state = true
      }
      const category = await Category.findByIdAndUpdate({ _id: id}, {
        state: new_state
      });
      res.status(200).send(category);
    }else{
      res.status(500).send({data:undefined, message: 'Error token'})
    }
  
};

const get_income_admin = async(req, res)=> {
    if(req.user){
        const start = req.params['start'];
        const end = req.params['end'];

        const incomes = await Income.find({
            createdAt:{
                $gte: new Date(start+'T00:00:00'),
                $lt: new Date(end+'T00:00:00'),
            }
        })
        console.log(incomes);
      res.status(200).send(incomes);
    }else{
      res.status(500).send({data:undefined, message: 'Error token'})
    }
  
};

const get_frontPage_income = async(req, res) => {
    let name = req.params['name']
    fs.stat('./uploads/facturas/'+name, (error) => {
        if(error){
            let img_path = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(img_path));
        }else{
            let img_path = './uploads/facturas/'+name;
            res.status(200).sendFile(path.resolve(img_path));
        }
    })
        
};
const get_income_details = async(req, res)=> {
    if(req.user){
        const id = req.params['id'];

        const income = await Income.findById({_id:id});
        const income_details = await IncomeDetails.find({income:id}).populate('product').populate('variety')
        res.status(200).send({income, income_details});
    }else{
      res.status(500).send({data:undefined, message: 'Error token'})
    }
  
};


module.exports = {
    register_product,
    get_products,
    get_frontPage_product,
    get_product_id,
    update_product,
    register_variety_product,
    get_variety_product,
    delete_variety_product,
    get_all_products,
    register_income,
    register_imagen,
    get_gallery_product,
    list_image_gallery,
    delete_image_gallery,
    create_category,
    list_category,
    create_subcategory,
    delete_subcategory,
    change_status_to_product,
    get_income_admin,
    get_frontPage_income,
    get_income_details
}