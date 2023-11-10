const { pool } = require('../conexion.js');
const bcrypt = require('bcrypt');
const { enviarCorreo } = require('../config/email.js');


module.exports.getReservasCanchas = async (req,res)=>{ 
    const {fecha} = req.query
    try {
        const [rows] = await pool.query('Select fecha,horaInicio from reservacancha where fecha = ? and estado = "ocupado"',[fecha])
        const resultadosRecortados = rows.map(row => {
            const fechaRecortada = row.fecha instanceof Date ? row.fecha.toISOString().substring(0, 10) : row.fecha.substring(0, 10);
            return {
                fecha: fechaRecortada, // Obtener los primeros 10 caracteres de la fecha
                horaInicio: row.horaInicio
            };
        });

        res.json(resultadosRecortados);
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}


module.exports.getReservasCanchasxID = async (req,res)=>{ 
    const {id} = req.query
    try {
        const [rows] = await pool.query('Select fecha,horaInicio from reservacancha where  estado = "ocupado" and idUsuario = ? order by id desc',[id])
        const resultadosRecortados = rows.map(row => {
            const fechaRecortada = row.fecha instanceof Date ? row.fecha.toISOString().substring(0, 10) : row.fecha.substring(0, 10);
            return {
                fecha: fechaRecortada, // Obtener los primeros 10 caracteres de la fecha
                horaInicio: row.horaInicio
            };
        });

        res.json(resultadosRecortados);
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}



module.exports.postReservaCancha = async (req, res) => {
    try {
      const ip = req.ip;

      const {nroReservaCancha,idUsuario,idCancha,horaInicio,horaFin,fecha} = req.body;
        
        const [usuario ] = await pool.query("Select * from usuario where id = ?",[idUsuario]);
        

    var correo = usuario[0].correoElectronico;
      console.log(correo);


        const [result] = await pool.query('INSERT INTO reservacancha(nroReservaCancha, idUsuario, idCancha, horaInicio, horaFin, fecha,estado) VALUES (?, ?, ?, ?, ?, ?,"ocupado")', [nroReservaCancha,idUsuario,idCancha,horaInicio,horaFin,fecha]);
      
          // Envía el correo electrónico antes de enviar la respuesta al cliente
      await enviarCorreo(correo, "Reserva de Cancha confirmada","reservacancha");


      res.send({
        id: result.insertId,
        nroReservaCancha,
      });
      
      
    } catch (error) {
      //console.log(error);
      return res.status(400).json({
        message: error.message ,
      });
    }
  };
  