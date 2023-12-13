const { Router } = require('express');
const {getTotales,getTotalesXMes,getListaData} = require('../controllers/estadisticasController.js');

const router = Router()

router.get('/estadisticastotales',getTotales)
router.get('/estadisticastotalesxmes',getTotalesXMes)
router.get('/estadisticastabla',getListaData)

module.exports = router;
