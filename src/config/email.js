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

    if(tipo == "reservapiscina"){
        const [reservaPiscina] = await pool.query('Select * from reservapiscina where idUsuario = ? order by id desc',[usuario[0].id]);

        // Obtén la fecha en formato Date
        const fechaReserva = new Date(reservaPiscina[0].fechaReserva);

        // Formatea la fecha en el formato "YYYY-MM-DD"
        const fechaFormateada = fechaReserva.toISOString().split('T')[0];

        contenidoHTML = `
        <html>
        <body>
            <h1>Reserva de piscina confirmada</h1>
            <p>Hola ${usuario[0].nombres} queremos agradecer su preferencia por la compra de tickets para una de nuestras piscina. 
            <p>Numero de ticket : ${reservaPiscina[0].nroTicketPiscina}</p>
            <p>Fecha a asistir : ${fechaFormateada}</p>
            <p>Cantidad de personas : ${reservaPiscina[0].cantidadTickets}</p>
            <p>¡Los esperamos!.</p>

        </body>
        </html>
    `;

    }
    console.log(tipo)    // Envía el correo electrónico antes de enviar la respuesta al cliente

    if(tipo == "reservasalon"){
        console.log("HOLA3.5")    // Envía el correo electrónico antes de enviar la respuesta al cliente

        const [reservaSalon] = await pool.query('Select * from reservasaloneventos r inner join salon s on r.idSalon = s.id  where idUsuario = ? order by r.id desc',[usuario[0].id]);
        console.log("HOLA4")    // Envía el correo electrónico antes de enviar la respuesta al cliente

        // Obtén la fecha en formato Date
        const fechaReserva = new Date(reservaSalon[0].fechaReserva);
        console.log("HOLA5")    // Envía el correo electrónico antes de enviar la respuesta al cliente

        // Formatea la fecha en el formato "YYYY-MM-DD"
        const fechaFormateada = fechaReserva.toISOString().split('T')[0];

        contenidoHTML = `
        <html>
        <body>
            <h1>Reserva de salón confirmada</h1>
            <p>Hola ${usuario[0].nombres} queremos agradecer su preferencia por reservas uno de nuestros salones. 
            <p>Fecha de evento : ${fechaFormateada}</p>
            <p>Salón : ${reservaSalon[0].nombreSalon}</p>
            
            <p>¡Los esperamos!.</p>

            <p>Cualquier duda o inquietud sobre la organización del evento comunicarse con <a href="tel:+51916528716">+51916528716</a>..</p>


        </body>
        </html>
    `;
    console.log("HOLA6")    // Envía el correo electrónico antes de enviar la respuesta al cliente

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