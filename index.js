//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas')
const Usuario = require('./models/Usuario');
require('dotenv').config();
const app = express();

//ruta
const reservasRutas = require('./rutas/reservasRutas');
const pacienteRutas = require('./rutas/pacienteRutas');

const tokensInvalidos= require('./rutas/token')


//configuraciones de environment
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB
mongoose.connect(MONGO_URI).then(
    () => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto : "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});

        // Verificar si el token ha sido invalidado
          if (tokensInvalidos.includes(token)) {
            return res.status(401).json({ mensaje: 'No existe el token de autenticacion !!!!' });
        }

        const decodificar = jwt.verify(token, 'clave_secreta');
        console.log("decodificar",decodificar);

        req.usuario = await  Usuario.findById(decodificar.usuarioId);
        console.log(req)
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};

module.exports = tokensInvalidos;

app.use('/auth', authRutas);
app.use('/pacientes',  autenticar, pacienteRutas);
app.use('/reservas', autenticar, reservasRutas);


//utilizar las rutas de recetas
//app.use('/reservas', reservasRutas);