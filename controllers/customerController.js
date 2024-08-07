const Customer = require("../models/customer");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../helpers/custJwt");

// Metodo para registrar usuarios
const register_user_ecomerce = async (req, res) => {
  const data = req.body;

  const reg_customer = await Customer.find({ email: data.email });
  if (reg_customer.length >= 1) {
    res.status(200).send({ message: "El correo electronico ya existe!" });
  } else {
    bcrypt.hash(data.password, null, null, async (err, hash) => {
      if (err) {
        res.status(200).send({ message: "Erro en la encriptacion" });
      } else {
        data.password = hash;
        const customer = await Customer.create(data);
        res.status(200).send(customer);
      }
    });
  }
};

// Metodo para iniciar sesion
const login_users_ecomerce = async (req, res) => {
  const data = req.body;

  const users = await Customer.find({ email: data.email });
  if (users.length >= 1) {
    //Validando rol de usuario y acceso
    if (users[0].state) {
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
    } else {
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

module.exports = {
  register_user_ecomerce,
  login_users_ecomerce,
};
