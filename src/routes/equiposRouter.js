const { Router } = require('express');
const { getEquipos, postEquipos, patchEquipos, deleteEquipos, getEquiposId } = require('../controllers/equiposController.js');
const verificarToken = require('../tokens/keyToken.js');
const router = Router()

router.get('/equipos',getEquipos)
router.get('/equipos/:id',getEquiposId)
router.post('/equipos',verificarToken,postEquipos)
router.patch('/equipos/:id',verificarToken,patchEquipos)
router.delete('/equipos/:id',verificarToken,deleteEquipos)


module.exports =  router

