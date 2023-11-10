const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { pool } = require('../conexion.js');
const { SECRET_KEY } = require('../config/config.js');



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ztleozt2@gmail.com', // Reemplaza con tu dirección de Gmail
        pass: 'vrraaooqwspqilyz' // Reemplaza con tu contraseña
    }
});

async function enviarCorreo(destinatario, asunto,tipo) {
    
    const [usuario] = await pool.query('Select * from usuario where correoElectronico = ?',[destinatario]);

    


    // Crea un token que contiene el ID del usuario
    const token = jwt.sign({ userId: usuario[0].id, correo:usuario[0].correoElectronico }, SECRET_KEY, { expiresIn: '5m' }); // 10 minutos de expiración
    var contenidoHTML = ''

    if(tipo == "comprobacion"){
         contenidoHTML = `
        <html>
        <body>
            <h1>Verificar correo electrónico</h1>
            <p>Hola ${usuario[0].nombres} para validar tu correo debes hacer clic en el siguiente enlace: <br> http://localhost:4200/auth/confirmar/${token}</p>
        </body>
        </html>
    `;
    }

    if(tipo == "reservacancha"){
        const [reservacancha] = await pool.query('Select * from reservacancha where idUsuario = ? order by id desc',[usuario[0].id]);

    // Obtén la fecha en formato Date
const fechaReserva = new Date(reservacancha[0].fecha);

// Formatea la fecha en el formato "YYYY-MM-DD"
const fechaFormateada = fechaReserva.toISOString().split('T')[0];

        contenidoHTML = `
        <html>
        <body>
            <h1>Reserva de cancha confirmada</h1>
            <p>Hola ${usuario[0].nombres} queremos agradecer su preferencia por alquilar nuestra cancha sintética. 
            
            <p>Fecha de reserva : ${fechaFormateada}</p>
            
            <p>Hora Inicio (24hrs) : ${reservacancha[0].horaInicio}</p>

            <p>¡Lo esperamos!.</p>

        </body>
        </html>
    `;

    }

    if(tipo == "recuperar"){
        contenidoHTML = `
        <html>
        <body>
            <h1>Actualizar contraseña</h1>
            <p>Hola ${usuario[0].nombres} para cambiar la contraseña de tu correo debes hacer clic en el siguiente enlace: <br> http://localhost:4200/recuperarContra/${token} 
            <br> Pasado los 5 minutos el enlace ya no servirá y deberá crear otra recuperación</p>
        </body>
        </html>
    `;
    }
    

    const mailOptions = {
        from: 'ztleozt2@gmail.com',
        to: destinatario,
        subject: asunto,
        html: contenidoHTML
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
}

module.exports = {
    enviarCorreo: enviarCorreo
};