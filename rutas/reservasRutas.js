const express = require('express');
const rutas = express.Router();
const RegistroreservaModel = require('../models/RegistroReserva');

//endpoint 1 traer todas los registro
rutas.get('/ReservasTotal', async (req, res) => {
    try  {
       const registro = await  RegistroreservaModel.find();
       res.json(registro);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});

//endpoint 2 crear registro
rutas.post('/crearRegistro',async (req, res)=> {
    const registro =new RegistroreservaModel({
        ci: req.body.ci,
        nombre: req.body.nombre,
        paciente: req.body.paciente,
        tipo: req.body.tipo,
        fecha: req.body.fecha,
        hora: req.body.hora
    })
    
    try {
        const nuevaRegistro = await registro.save();
        res.status(201).json(nuevaRegistro);
    }catch (error) {
        res.status(400).json({mensaje: error.message})
    }
    
    });

    //endpoint 3 editar registro
    rutas.put('/editarRegistro/:id', async (req, res) => {

        try {
            const registroEditado = await RegistroreservaModel.findByIdAndUpdate(req.params.id, req.body, {new : true});
            if (!registroEditado)
                return res.status(404).json({ mesaje : 'Reserva no encontrado!'});
            else
                return res.status(201).json(registroEditado);
        } catch (error){
            res.status(400).json({ mensaje : error.mensaje})
        }

    });
    
    //endpoint 4 eliminar registro
    rutas.delete('/eliminarRegistro/:id', async (req, res) =>{
        try {
            const registroEliminada = await RegistroreservaModel.findByIdAndDelete(req.params.id);
            if (!registroEliminada)
                return res.status(404).json({ mesaje : 'Reserva no encontrado!'});
            else
                return res.json({mesaje : 'Reserva eliminado'});
        } 
        catch (error){
            res.status(500).json({ mensaje : error.mensaje})
        }
    
    });

module.exports= rutas;