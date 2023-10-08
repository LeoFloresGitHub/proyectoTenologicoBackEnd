const { Router } = require('express');
const { postLogin } = require('../controllers/loginController.js');
const { validarCorreo } = require('../controllers/loginController.js');
const {recuperarContra} = require('../controllers/loginController.js');
const {cambiarContra}= require('../controllers/loginController.js');



const router = Router()

router.post('/login',postLogin)
router.get('/confirmar/:token',validarCorreo)
router.get('/recuperar/:correo',recuperarContra)
router.post('/actualizar/contra',cambiarContra)

module.exports = router