const { pool } = require('../conexion.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { SECRET_KEY } = require('../config/config.js');
const { enviarCorreo } = require('../config/email.js');

module.exports.postLogin = async (req, res) => {
    try {
        const correo = req.body.correoElectronico;
        const pass = req.body.contrasena;
        
        // Consulta el usuario por correo
        const [rows] = await pool.query('SELECT * FROM usuario WHERE correoElectronico = ?', [correo]);
       
        if (rows.length === 0) {
            return res.json({ message: 'Correo no encontrado' });
        }

        const user = rows[0];
        
        // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(pass, user.contrasena);
        
        if (!passwordMatch) {
            return res.json({ message: 'Contraseña incorrecta' });
        }

        if(rows[0].estado == 2){
          return res.json({ message: 'No ha validado su correo, porfavor validar' });
        }



        // Crea un token JWT
        const token = jwt.sign({ userId: user.id , tipoUsuario: user.tipoUsuario}, SECRET_KEY, { expiresIn: '1h' });

        // Envía el token en la respuesta
        res.json({ token });
    } catch (er) {
        return res.status(500).json({
            message: er.message
        });
    }
}

module.exports.validarCorreo = async (req, res) => {
    const { token } = req.params;
    var id = 0;
  
    try {
      // Verificar el token JWT primero
      jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
          // El token no es válido o ha expirado
          console.log("Enlace expirado o incorrecto.");
          return res.json({
            message: "Enlace expirado o incorrecto."
          });
        } else {
          // El token es válido, y la información se encuentra en el objeto 'decoded'
          idToken = decoded.userId;
          id = idToken;
          console.log('ID de usuario:', idToken);
  
          // Luego, recuperar la información del usuario de la base de datos
          const [user] = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
          
          if (user[0].estado !== 1) {
            // Actualizar el estado del usuario
            const [result] = await pool.query('UPDATE usuario SET estado = 1 WHERE id = ?', [id]);
          } else {
            return res.send({
              message: "Correo ya confirmado."
            });
          }
  
          // Enviar la respuesta después de verificar y actualizar el estado
          return res.send({
            message: "Correo confirmado con éxito"
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Error al confirmar correo',
      });
    }
  }


  module.exports.recuperarContra = async (req, res) => {
    const {correo}= req.params
    try {
      
      var token = ''
      const [rows] = await pool.query('SELECT * FROM usuario WHERE correoElectronico = ?', [correo]);
      if(rows[0]){
        // Crea un token JWT
        
        //token = jwt.sign({ userId: rows[0].id }, SECRET_KEY, { expiresIn: '1h' });


      }else{
        return res.json({message:"Correo electrónico no se encuentra registrado"});

      }

      await enviarCorreo(correo, "Cambiar Contraseña","recuperar");
      res.json({message:"Revise su bandeja del correo electronico para poder cambiar contraseña." });
          
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Error averiguar xd',
      });
    }
  }


  module.exports.cambiarContra = async (req, res) => {
    const { correoElectronico,contrasena } = req.body;
    
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    try { 
    const [result] = await pool.query('Update usuario set  contrasena = IFNULL(?,contrasena) where correoElectronico = ?',[  hashedPassword, correoElectronico])
    if(result.affectedRows === 0)
      return res.status(404).json({message: "No se edito correctamente"})
    else{
      res.json({message:"Se edito la contraseña correctamente."})
    }
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Error al actualizar contraseña ',
      });
    }
  }
