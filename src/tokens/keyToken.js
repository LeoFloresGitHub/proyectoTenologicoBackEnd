
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js';

/*
const generarToken = () => {
    const payload = {
      
    };
  
    const claveSecreta = process.env.SECRET_KEY; 
  
    const token = jwt.sign(payload, claveSecreta, { expiresIn: '36500d' });
  
    return token;
  };
*/


function verificarToken(req,res,next){

const authHeader = req.headers.authorization
console.log(authHeader)
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access not authorized'
    });
  }

const token = authHeader.slice(7); // Eliminar el prefijo 'Bearer ' para obtener solo el token

    try {
        const decoded = jwt.verify(token,SECRET_KEY)
        //req.usuario = decoded
        next(); 
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return res.status(500).json({
            message: 'Token invalido'
    }) 
    }
}


export default verificarToken