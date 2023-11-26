const { pool } = require('../conexion.js');
const bcrypt = require('bcrypt');
const { enviarCorreo } = require('../config/email.js');


module.exports.getReservaPiscina = async (req,res)=>{ 
    const {fecha,idPiscina} = req.query
    try {
        const [result]= await pool.query('Select sum(cantidadTickets) as cantidad from reservapiscina where fechaReserva = ? and idPiscina = ?',[fecha,idPiscina])
        res.json({ cantidad: result[0].cantidad });
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}




module.exports.getReservasPiscinasxID = async (req,res)=>{ 
    const {id} = req.query
    try {
        const [rows] = await pool.query('Select nroTicketPiscina,fechaReserva,cantidadTickets,nombrePiscina from reservapiscina r inner join piscina p on r.idPiscina = p.id  where  estadoTicket = "comprado" and idUsuario = ? order by r.id desc',[id])
        const resultadosRecortados = rows.map(row => {
            const fechaRecortada = row.fechaReserva instanceof Date ? row.fechaReserva.toISOString().substring(0, 10) : row.fechaReserva.substring(0, 10);
            return {
                fechaReserva: fechaRecortada, // Obtener los primeros 10 caracteres de la fecha
                nombrePiscina: row.nombrePiscina,
                nroTicketPiscina : row.nroTicketPiscina,
                cantidadTickets : row.cantidadTickets
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



module.exports.postReservaPiscina = async (req, res) => {
    try {
      const ip = req.ip;

      const {nroTicketPiscina,idUsuario,idPiscina,fechaReserva,cantidadTickets} = req.body;
        
        const [usuario ] = await pool.query("Select * from usuario where id = ?",[idUsuario]);
        

    var correo = usuario[0].correoElectronico;
      console.log(correo);


        const [result] = await pool.query('INSERT INTO reservapiscina(nroTicketPiscina, idUsuario, idPiscina, fechaReserva, cantidadTickets, estadoTicket) VALUES (?, ?, ?, ?, ?, "comprado")', [nroTicketPiscina,idUsuario,idPiscina,fechaReserva,cantidadTickets]);
      
          // Envía el correo electrónico antes de enviar la respuesta al cliente
      await enviarCorreo(correo, "Reserva de Piscina confirmada","reservapiscina");


      res.send({
        id: result.insertId,
        nroTicketPiscina,
      });
      
      
    } catch (error) {
      //console.log(error);
      return res.status(400).json({
        message: error.message ,
      });
    }
  };
  

//Piscinas

  //Canchas

  module.exports.getPiscinas = async (req,res)=>{ 
    
    try {
        const [rows] = await pool.query('Select id,nombrePiscina,capacidadTickets,estado from piscina ')
        

        res.json(rows);
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}



module.exports.updatePiscinas = async (req,res)=>{ 
    
  const {estado,id} = req.body;
  
  try {
      const [rows] = await pool.query('Update piscina SET estado = COALESCE(?, "") where id = ?',[estado,id])

      res.json(rows);
        
  } catch (error) {
    console.log(error)
      return res.status(500).json({
        
          message: 'Something goes wrong'
  })
  }   
}