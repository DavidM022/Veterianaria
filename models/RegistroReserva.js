const mongoose = require('mongoose');
//definir el esquema
const RegistroreservaSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    
    ci: Number,
    nombre: String,
    tipo: String,
    fecha: String,
    hora: String,
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }

});

const RegistroreservaModel = mongoose.model('Registroreserva',RegistroreservaSchema  , 'reserva');
module.exports = RegistroreservaModel;