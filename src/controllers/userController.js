const { pool } = require('../conexion.js');
const bcrypt = require('bcrypt');
const { enviarCorreo } = require('../config/email.js');


module.exports.getUsers = async (req,res)=>{ 
    try {
        const [rows] = await pool.query('Select * from usuario')
        res.json(rows);
          
    } catch (error) {
      console.log(error)
        return res.status(500).json({
          
            message: 'Something goes wrong'
    })
    }   
}


module.exports.getUserByEmail = async (req,res)=>{

  const {email} = req.params
  try {
    const [user] = await pool.query('Select * from usuario where correoElectronico = ?',[email])
    if (user.length === 0) {
      throw new Error('User not found');
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'Something goes wrong'
  }) }

}


module.exports.postUser = async (req, res) => {
  try {
    const { nombres, apellidos, tipoDocumento, numDocumento, correoElectronico, contrasena, tipoUsuario, estado } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const [user] = await pool.query('Select * from usuario where correoElectronico = ? or numDocumento = ?',[correoElectronico,numDocumento])
    
    if(!user || (Array.isArray(user) && user.length === 0))
    {
      const [result] = await pool.query('INSERT INTO usuario(tipoDocumento, numDocumento, nombres, apellidos, correoElectronico, contrasena, tipoUsuario, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [tipoDocumento,  numDocumento,nombres, apellidos, correoElectronico, hashedPassword, tipoUsuario, estado]);
    // Envía el correo electrónico antes de enviar la respuesta al cliente
    await enviarCorreo(correoElectronico, "Verificar Correo","comprobacion");
    res.send({
      id: result.insertId,
      nombres,
    });
    }
    else{
      res.status(400).json({ message: "DNI y/o correoElectronico ya se encuentra registrado." });
    }
  } catch (error) {
    //console.log(error);
    return res.status(400).json({
      message: "DNI y/o correoElectronico ya se encuentra registrado." ,
    });
  }
};


module.exports.patchUser = async (req,res)=>{
  try {
      const {id} = req.params
      const {nombres, apellidos, tipoDocumento, numDocumento, correoElectronico, contrasena, tipoUsuario, estado} = req.body
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const [result] = await pool.query('Update usuario set nombres = IFNULL(?,nombres), apellidos = IFNULL(?,apellidos), tipoDocumento = IFNULL(?,tipoDocumento), numDocumento = IFNULL(?,numDocumento), correoElectronico = IFNULL(?,correoElectronico), contrasena = IFNULL(?,contrasena), tipoUsuario = IFNULL (?,tipoUsuario), estado = IFNULL (?,estado) where id = ?',[nombres, apellidos, tipoDocumento, numDocumento, correoElectronico, hashedPassword, tipoUsuario, estado,id])
      if(result.affectedRows === 0)
      return res.status(404).json({message: "No se edito correctamente"})

      const [rows] = await pool.query('Select * from usuario where id = ?',[id])

     // await enviarCorreo(correoElectronico, "Verifica Correo");
      
      res.json(rows[0])
  } catch (error) {
    console.log(error)
      return res.status(500).json({
          message: 'No se realizó edición'
  })
  }       
}
module.exports.deleteUser = async (req,res)=>{
  try {
      const {id} = req.params
      const [result] = await pool.query('Delete from usuario where id = ?',[id])
      

      if(result.affectedRows <= 0){
          return res.status(404).json({message: "No se encontro usuario a eliminar"})
      }else{res.json({message: "Usuario se elimino correctamente"})}
      
  } catch (error) {
      return res.status(500).json({
          message: "usuario no se eliminó correctamente"
  })
  }       
}



