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


      
    //1er test : GET
    test('Deberia Traer todas las reservas metodo: GET: ReservasTotal', async() =>{
        await RecetaModel.create({ ci: 12345678, nombre: 'Wilson Chura', tipo: 'Cosnulta', fecha: '21-05-2024', hora: '13:00' });
        await RecetaModel.create({ ci: 13180493, nombre: 'Wilmer Tito', tipo: 'Cosnulta', fecha: '22-05-2024', hora: '17:00' });
        // solicitud - request
        const res =  await request(app).get('/reservas/ReservasTotal');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test('Deberia agregar una nueva Reserva: POST: /crear', async() => {
        const nuevaReserva = {
            ci: 13180493, 
            nombre: 'David Mamani',
            tipo: 'Consulta', 
            fecha: '13-05-2024', 
            hora: '15:00'
        };
        const res =  await request(app)
                            .post('/reservas/crearRegistro')
                            .send(nuevaReserva);
        expect(res.statusCode).toEqual(201);
        expect(res.body.ci).toEqual(nuevaReserva.ci);
    });

    test('Deberia actualizar una tarea que ya existe: PUT /editar/:id', async()=>{
        const reservaCreada = await RecetaModel.create({ 
            ci: 12345678, 
            nombre: 'Wilson Chura',  
            tipo: 'Consulta', 
            fecha: '21-05-2024', 
            hora: '13:00' });

            const reservaActualizar = {
                ci: 12345678, 
                nombre: 'Wilson Chura (editado)',  
                tipo: 'Consulta', 
                fecha: '21-05-2024', 
                hora: '13:00'
            };

        const res =  await request(app)
                            .put('/reservas/editarRegistro/'+reservaCreada._id)
                            .send(reservaActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.ci).toEqual(reservaActualizar.ci);                   

    });

    test('Deberia eliminar una tarea existente : DELETE /eliminar/:id', async() =>{
        
        const reservaCreada = await RecetaModel.create({ 
            ci: 12345678, 
            nombre: 'Wilson Chura', 
            tipo: 'Consulta', 
            fecha: '21-05-2024', 
            hora: '13:00' });

        const res =  await request(app)
                                .delete('/reservas/eliminarRegistro/'+reservaCreada._id);
        
        expect(res.statusCode).toEqual(200);
    });


    test('Deberia Dberia mostar el historial de reservas de mascota : ', async() =>{

        const reservaCreada = await RecetaModel.create({ 
            ci: 12345678, 
            nombre: 'Wilson Chura',  
            tipo: 'Consulta', 
            fecha: '21-05-2024', 
            hora: '13:00',
            usuario: '664d1b49fde268b735342bdf',
            paciente: '664ef4fecd0574534d2682ae'
        });

        const res =  await request(app).get('/reservas/reservaPorPaciente/'+reservaCreada._id);
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

});