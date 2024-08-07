const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    name:    {type: String, required: true},
    lastName:  {type: String, required: true},
    email:      {type: String, required: true, unique: true},
    role:        {type: String, required: true},
    password:   {type: String, required: true},
    state: {type: Boolean, default: true, require: true},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', UsuarioSchema);