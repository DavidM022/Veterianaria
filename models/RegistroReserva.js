const mongoose = require('mongoose');
//definir el esquema
const RegistroreservaSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    
    ci: Number,
    nombre: String,
    paciente: String,
    tipo: String,
    fecha: String,
    hora: String,

});

const RegistroreservaModel = mongoose.model('Registroreserva',RegistroreservaSchema  , 'reserva');
module.exports = RegistroreservaModel;