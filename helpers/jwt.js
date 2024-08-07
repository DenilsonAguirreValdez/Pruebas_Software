const jwt = require('jwt-simple');
const moment = require('moment');

const secret = '123456';

exports.createToken = (user) => {
    const payload = {
        sub: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        iat: moment().unix(), //fecha de incio de token
        exp: moment().add(1, 'day').unix() //fecha de expiracion de token sera un dia,
    }
    return jwt.encode(payload, secret);
}