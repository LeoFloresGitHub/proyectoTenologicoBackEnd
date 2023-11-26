const { pool } = require('../conexion.js');
const bcrypt = require('bcrypt');



module.exports.getFuncionalidades = async (req,res)=>{ 
    try {
        const [rows] = await pool.query('Select * from funcionalidad')
        res.json(rows);
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}

module.exports.getFuncionalidadById = async (req,res)=>{

    const {id} = req.params
    try {
      const [user] = await pool.query('Select * from funcionalidad where id = ?',[id])
      if (user.length === 0) {
        throw new Error('User not found');
      }
      res.json(user[0]);
      console.log(user[0]);
    } catch (error) {
      return res.status(500).json({
        message: 'Something goes wrong'
    }) }
  


  }

  module.exports.getPermisosByUser = async (req,res)=>{

    const {id} = req.params
    try {
      const [user] = await pool.query('Select * from permiso where idUsuario = ? and estado = 1',[id])

      res.json(user);
    } catch (error) {
      return res.status(500).json({
        message: 'Something goes wrong'
    }) }
  

  }

  module.exports.cambiarPermisosByUser = async (req, res) => {
    const { id } = req.params;
    const { valoresDes, valoresSelec } = req.body;

  
    // Obtener los idFuncionalidad asociados al usuario
    try {
      const [user] = await pool.query('SELECT distinct idFuncionalidad FROM permiso WHERE idUsuario = ? ', [id]);
  
      const idFuncionalidadUsuario = user.map(row => row.idFuncionalidad);
     
      const idFuncionalidadUsuarioComoString = idFuncionalidadUsuario.map(valor => valor.toString());

      
      // Para cada valor en valoresSelec
      for (const valor of valoresSelec) {
        console.log(idFuncionalidadUsuarioComoString.includes(valor)) 
        // Si el valor no está en idFuncionalidadUsuario, realizar un INSERT
        if (idFuncionalidadUsuarioComoString.includes(valor) == false) {
          console.log("WTF")
          await pool.query('INSERT INTO permiso (idFuncionalidad, idUsuario, estado) VALUES (?, ?, 1)', [valor, id]);
        } else {
          // Si el valor ya está en idFuncionalidadUsuario, realizar un UPDATE
          await pool.query('UPDATE permiso SET estado = 1 WHERE idUsuario = ? AND idFuncionalidad = ?', [id, valor]);
        }
      }
      console.log(valoresDes)
      // Para cada valor en valoresDes
      for (const valor of valoresDes) {
        // Realizar un UPDATE para establecer el estado en 2
        await pool.query('UPDATE permiso SET estado = 2 WHERE idUsuario = ? AND idFuncionalidad = ?', [id, valor]);
      }
  
      res.json({ message: 'Permisos actualizados' });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }

