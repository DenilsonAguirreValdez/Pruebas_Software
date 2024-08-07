const jwt = require('jwt-simple');
//const moment = require('moment');

const secret = '123456';

exports.decodeToken = (req, res, next) => {
    //validacion si no se envia la cabecera authorization
    if(!req.headers.authorization){
        return res.status(403).send({message: 'NoHeadersError'});
    }
    const token = req.headers.authorization;
    const segment = token.split('.');
    console.log("ctoken", token);
    //validamos que el token tenga las tres partes
    if(segment.length != 3){
        return res.status(403).send({message: 'InvalidToken'});
    }else{
        //Validamos que el token sea correcto
        try{
            var payload = jwt.decode(token, secret);
            console.log("cauthenticate",payload);
        }catch (error){
            console.log(error);
            return res.status(403).send({message: 'ErrorToken'});
        }
    }

    req.user = payload;
    next();
    
}