const express = require('express');
const rutas = express.Router();
const PacienteModel = require('../models/Paciente');
const UsuarioModel = require('../models/Usuario');

//endpoint 1 traer todas los registro
rutas.get('/getPaciente', async (req, res) => {
    try  {
       const registro = await  PacienteModel.find();
       res.json(registro);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint 2 crear registro
rutas.post('/crear',async (req, res)=> {
    const registro =new PacienteModel({
        Tanimal: req.body.Tanimal,
        raza: req.body.raza,
        nombre: req.body.nombre,
        color: req.body.color,
        peso: req.body.peso
    })
    
    try {
        const nuevaRegistro = await registro.save();
        res.status(201).json(nuevaRegistro);
    }catch (error) {
        res.status(400).json({mensaje: error.message})
    }
    
    });


    //endpoint 3 editar registro
    rutas.put('/editar/:id', async (req, res) => {

        try {
            const registroEditado = await PacienteModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
            if (!registroEditado)
                return res.status(404).json({ mesaje : 'Paciente no encontrado!'});
            else
                return res.status(201).json(registroEditado);
        } catch (error){
            res.status(400).json({ mensaje : error.mensaje})
        }

    });
    
    //endpoint 4 eliminar registro
    rutas.delete('/eliminar/:id', async (req, res) =>{
        try {
            const registroEliminada = await PacienteModel.findByIdAndDelete(req.params.id);
            if (!registroEliminada)
                return res.status(404).json({ mesaje : 'Paciente no encontrado!'});
            else
                return res.json({mesaje : 'Paciente eliminado'});
        } 
        catch (error){
            res.status(500).json({ mensaje : error.mensaje})
        }
    
    });


        
module.exports= rutas;