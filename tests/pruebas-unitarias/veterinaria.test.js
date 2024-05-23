const express = require('express');
const request = require('supertest');
const reservasRutas = require('../../rutas/reservasRutas');
const RecetaModel = require('../../models/RegistroReserva');
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());
app.use('/reservas', reservasRutas);


describe('Pruebas Unitarias para Veterina', () => {

    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/veterinaria',{
            useNewUrlParser : true,            
        });
        await RecetaModel.deleteMany({});
    });

    // al finalziar las pruebasx|
    afterAll(() => {
        return mongoose.connection.close();
      });


    test('Deberia Dberia mostar el historial de reservas de mascota : ', async() =>{
        
        const res =  await request(app).get('/reservaPorPaciente/664ef4fecd0574534d2682ae');
        //verificar la respuesta
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveLength(2);
    });

});