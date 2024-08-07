const Users = require("../models/users");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../helpers/jwt");

//Funcion para registrar un usuario
const register_user_admin = async (req, res) => {
  console.log(req.user);

  if (req.user) {
    const data = req.body;

    const users = await Users.find({ email: data.email });

    console.log(users);
    if (users.length >= 1) {
      res
        .status(200)
        .send({ data: undefined, message: "El correo electronico ya existe" });
    } else {
      bcrypt.hash("123456", null, null, async (err, hash) => {
        if (err) {
          res.status(200).send({
            data: undefined,
            message: "No se pudo encriptar la contrasena",
          });
        } else {
          data.password = hash;
          const user = await Users.create(data);
          res.status(200).send({ data: user });
        }
      });
    }
  } else {
    res.status(500).send({ message: "Error token" });
  }
};

//Funcion para iniciar sesion
const login_users = async (req, res) => {
  const data = req.body;

  const users = await Users.find({ email: data.email });
  if (users.length >= 1) {
    //Validando rol de usuario y acceso
    if(users[0].state){
      //El correo existe
      bcrypt.compare(data.password, users[0].password, async (err, check) => {
        console.log(check);
        if (check) {
          //generamos token de acceso jwt
          res
            .status(200)
            .send({ token: jwt.createToken(users[0]), userLog: users[0] });
        } else {
          res
            .status(200)
            .send({ data: undefined, message: "El password es incorrecto" });
        }
      });
    }else{
      res
      .status(200)
      .send({ data: undefined, message: "Su cuenta esta desactivada" });
    }
  } else {
    res
      .status(200)
      .send({ data: undefined, message: "No se encontro el correo" });
  }
};

//Metodo para listar usuarios
const list_users = async(req, res) =>{
  if(req.user){
    let filtro = req.params['filter'];

    let users = await Users.find({
            $or:[
                {name: new RegExp(filtro, 'i')},
                {lastName: new RegExp(filtro, 'i')},
                {email: new RegExp(filtro, 'i')}
            ]
        });
    res.status(200).send(users);
  }else{
    res.status(500).send({data:undefined, message: 'Error token'})
  }
};

//Metodo para obtener el id de un usuario
const get_user_admin = async(req, res) => {
  if(req.user){
    let id = req.params['id'];

    try {
      let user = await Users.findById({_id: id});
      res.status(200).send(user);
      console.log("esto", user);
    } catch (error) {
      res.status(200).send(undefined);
    }
    
  }else{
    res.status(500).send({data:undefined, message: 'Error token'})
  }
};

//Metodo para actualizar un usuario
const update_user_admin = async( req, res)=> {
  if(req.user){
    let id = req.params['id'];
    let data = req.body;

    let user =  await Users.findByIdAndUpdate({_id:id}, {
      name: data.name,
      lastName: data.lastName,
      role: data.role,
      email: data.email
  });
  res.status(200).send({user: user, message: 'Solicitud exitosa'});
  }else{
    res.status(500).send({data:undefined, message: 'Error token'})
  }
};

const change_status_to_user = async(req, res)=> {
  if(req.user){
    let id = req.params['id'];
    let data = req.body;
    let new_state = false;

    if(data.state){
      new_state = false;
    }else{
      new_state = true
    }
    const user = await Users.findByIdAndUpdate({ _id: id}, {
      state: new_state
    });
    res.status(200).send(user);
  }else{
    res.status(500).send({data:undefined, message: 'Error token'})
  }

}

module.exports = {
  register_user_admin,
  login_users,
  list_users,
  get_user_admin,
  update_user_admin,
  change_status_to_user
};
