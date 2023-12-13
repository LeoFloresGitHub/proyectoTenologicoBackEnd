const { pool } = require('../conexion.js');
const bcrypt = require('bcrypt');
const { enviarCorreo } = require('../config/email.js');


module.exports.getTotales = async (req,res)=>{ 
    const {fechaInicial,fechaFinal} = req.query
    try {
      const [result] = await pool.query(`
      SELECT (SELECT SUM(total) FROM reservapiscina WHERE fechaReserva BETWEEN ? AND ?) AS total_reservasPiscina,(SELECT SUM(total) FROM reservasaloneventos WHERE fechaReserva BETWEEN ? AND ?) AS total_reservasSalon,(SELECT SUM(total) FROM reservacancha WHERE fecha BETWEEN ? AND ?) AS total_reservaCancha;`, [fechaInicial, fechaFinal, fechaInicial, fechaFinal, fechaInicial, fechaFinal]);

    res.json({
      areas: [
        { color: 'verde', nombre: 'Cancha Deportiva', cantidad: result[0].total_reservaCancha },
        { color: 'celeste', nombre: 'Piscina', cantidad: result[0].total_reservasPiscina },
        { color: 'gris', nombre: 'Salones', cantidad: result[0].total_reservasSalon }
      ]
    });
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}


module.exports.getTotalesXMes = async (req,res)=>{ 
  const {tabla,fecha,fechaInicial,fechaFinal} = req.query
  try {
    const [result] = await pool.query(`
    SELECT
      MONTH(${fecha}) AS mes,
      YEAR(${fecha}) AS año,
      SUM(total) AS suma_totales
    FROM ${tabla}
    WHERE ${fecha} BETWEEN ? AND ?
    GROUP BY YEAR(${fecha}), MONTH(${fecha});
  `, [fechaInicial, fechaFinal]);
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

const data = result.map(row => ({
  mes: nombresMeses[row.mes - 1], 
  cantidad: row.suma_totales
}));

res.json({
  data: data
});
        
  } catch (error) {
    console.log(error)
      return res.status(500).json({
        
          message: 'Something goes wrong'
  })
  }   
}


module.exports.getListaData = async (req, res) => {
  const {  fechaInicial, fechaFinal } = req.query;

  try {
    // Consulta 1: Reserva Cancha
    const [resultCancha] = await pool.query(`
    Select 'Cancha' as servicio, r.fecha, c.nombreCancha, CONCAT(u.nombres, ' ', u.apellidos) as usuario , r.total 
    from reservacancha r 
    inner join usuario u on r.idUsuario = u.id
    inner join cancha c on r.idCancha = c.id
    where r.fecha BETWEEN ? AND ?;
    `, [fechaInicial, fechaFinal]);

    // Consulta 2: Reserva Piscina
    const [resultPiscina] = await pool.query(`
    Select 'Piscina' as servicio , r.fechaReserva, p.nombrePiscina, CONCAT(u.nombres, ' ', u.apellidos) as usuario , r.total 
    from reservaPiscina r 
    inner join usuario u on r.idUsuario = u.id
    inner join piscina p on r.idPiscina = p.id
    where fechaReserva BETWEEN ? AND ?;
    `, [fechaInicial, fechaFinal]);

    // Consulta 3: Reserva Salón de Eventos
    const [resultSalon] = await pool.query(`
    Select 'Salón' as servicio, r.fechaReserva, s.nombreSalon, CONCAT(u.nombres, ' ', u.apellidos) as usuario , r.total 
    from reservaSalonEventos r 
    inner join usuario u on r.idUsuario = u.id
    inner join salon s on r.idSalon = s.id
    where fechaReserva BETWEEN ? AND ?;
    `, [fechaInicial, fechaFinal]);


    res.json({
      dataCancha: resultCancha,
      dataPiscina: resultPiscina,
      dataSalon: resultSalon
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};
