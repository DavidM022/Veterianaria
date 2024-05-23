const mongoose = require('mongoose');
//definir el esquema
const PacienteSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    
    Tanimal: String,
    raza: String,
    nombre: String,
    color: String,
    peso: Number

});

const PacienteModel = mongoose.model('Paciente',PacienteSchema  , 'paciente');
module.exports = PacienteModel;