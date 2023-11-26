const { pool } = require('../conexion.js');
const bcrypt = require('bcrypt');
const { enviarCorreo } = require('../config/email.js');


module.exports.getReservasSalones = async (req,res)=>{ 
    const {fecha} = req.query
    try {
        const [rows] = await pool.query('Select fechaEvento,idSalon from reservasaloneventos where fechaEvento = ? and estado = "ocupado"',[fecha])
        const resultadosRecortados = rows.map(row => {
            const fechaRecortada = row.fechaEvento instanceof Date ? row.fechaEvento.toISOString().substring(0, 10) : row.fechaEvento.substring(0, 10);
            return {
                fecha: fechaRecortada, // Obtener los primeros 10 caracteres de la fecha
                idSalon: row.idSalon
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


module.exports.getReservasSalonesxID = async (req,res)=>{ 
  
    const {id} = req.query
    try {
        const [rows] = await pool.query('Select fechaEvento,nombreSalon from reservasaloneventos r inner join salon s on r.idSalon = s.id where  r.estado = "ocupado" and idUsuario = ? order by r.id desc',[id])
        
        const resultadosRecortados = rows.map(row => {
            const fechaRecortada = row.fechaEvento instanceof Date ? row.fechaEvento.toISOString().substring(0, 10) : row.fechaEvento.substring(0, 10);
            return {
                fecha: fechaRecortada, // Obtener los primeros 10 caracteres de la fecha
                nombreSalon: row.nombreSalon
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



module.exports.postReservaSalon = async (req, res) => {
    try {

      const ip = req.ip;

      const {nroReservaSalon,fechaReserva,fechaEvento, idUsuario,idSalon} = req.body;
      const [usuario ] = await pool.query("Select * from usuario where id = ?",[idUsuario]);
        

    var correo = usuario[0].correoElectronico;

      const [result] = await pool.query('INSERT INTO reservasaloneventos(nroReservaSalon,fechaReserva,fechaEvento, idUsuario,idSalon, estado) VALUES (?, ?, ?, ?, ?,"ocupado")', [nroReservaSalon,fechaReserva,fechaEvento, idUsuario,idSalon]);
      
      console.log("HOLA")    // Envía el correo electrónico antes de enviar la respuesta al cliente
      await enviarCorreo(correo, "Reserva de Salon confirmada","reservasalon");
      console.log("HOLA2")    // Envía el correo electrónico antes de enviar la respuesta al cliente


      res.send({
        id: result.insertId,
        nroReservaSalon,
      });
      
      
    } catch (error) {
      //console.log(error);
      return res.status(400).json({
        message: error.message ,
      });
    }
  };
  

   //Canchas

   module.exports.getSalones = async (req,res)=>{ 
    
    try {
        const [rows] = await pool.query('Select id,nombreSalon,estado from salon ')
        

        res.json(rows);
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}

module.exports.updateSalones = async (req,res)=>{ 
    
  const {nombreSalon,estado,id} = req.body;
  
  try {
      const [rows] = await pool.query('Update salon SET nombreSalon = COALESCE(NULLIF(?, ""), nombreSalon),estado = COALESCE(?, "") where id = ?',[nombreSalon,estado,id])

      res.json(rows);
        
  } catch (error) {
    console.log(error)
      return res.status(500).json({
        
          message: 'Something goes wrong'
  })
  }   
}
