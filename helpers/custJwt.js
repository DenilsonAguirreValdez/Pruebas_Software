const jwt = require('jwt-simple');
const moment = require('moment');

const secret = '123456';

exports.createToken = (customer) => {
    const payload = {
        sub: customer._id,
        name: customer.name,
        lastName: customer.lastName,
        email: customer.email,
        gender: customer.gender,
        iat: moment().unix(), //fecha de incio de token
        exp: moment().add(1, 'day').unix() //fecha de expiracion de token sera un dia,
    }
    return jwt.encode(payload, secret);
}