const express = require('express');
const rutas = express.Router();
const RegistroreservaModel = require('../models/RegistroReserva');
const UsuarioModel = require('../models/Usuario');
const PacienteModel= require('../models/Paciente')

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
        tipo: req.body.tipo,
        fecha: req.body.fecha,
        hora: req.body.hora,
        usuario: req.body.usuario, // asignar el id del usuario
        paciente: req.body.paciente // asignar el id de la raza
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


        //REPORTES 1 
    rutas.get('/reservaPorUsuario/:usuarioId', async (peticion, respuesta) =>{
        const {usuarioId} = peticion.params;
        console.log(usuarioId);
        try{
            const usuario = await UsuarioModel.findById(usuarioId);

            if (!usuario)
                return respuesta.status(404).json({mensaje: 'usuario no encontrado'});
            const recetas = await RegistroreservaModel.find({ usuario: usuarioId}).populate('usuario');
            respuesta.json(recetas);

        } catch(error){
            respuesta.status(500).json({ mensaje :  error.message})
        }
    })


            //REPORTES 1 HISTORIAL DE RESERVAS
            rutas.get('/reservaPorPaciente/:pacienteId', async (peticion, respuesta) =>{
                const {pacienteId} = peticion.params;
                console.log(pacienteId);
                try{
                    const paciente = await PacienteModel.findById(pacienteId);
                    
                    if (!paciente)
                        return respuesta.status(404).json({mensaje: 'paciente no encontrado'});
                    const recetas = await RegistroreservaModel.find({ paciente: pacienteId}).populate('paciente');
                    respuesta.json(recetas);
        
                } catch(error){
                    respuesta.status(500).json({ mensaje :  error.message})
                }
            })

            // REPORTE 2 contar todas cirugias que tubo el paciente 
            rutas.get('/contarPaciente/:pacienteId', async (peticion, respuesta) => {
                const {pacienteId} = peticion.params;
                console.log(pacienteId);
                try{
                    const paciente = await PacienteModel.findById(pacienteId);
                    
                    if (!paciente)
                        return respuesta.status(404).json({mensaje: 'paciente no encontrado'});

                    const cantidad = await RegistroreservaModel.countDocuments({ tipo: 'cirugia'}).populate('paciente');
                    respuesta.json(cantidad);
        
                } catch(error){
                    respuesta.status(500).json({ mensaje :  error.message})
                }

            });
    
module.exports= rutas;