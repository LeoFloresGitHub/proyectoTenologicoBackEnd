const { Router } = require('express');
const {getReservasCanchas,postReservaCancha,getReservasCanchasxID,updateCanchas,getCanchas} = require('../controllers/reservacanchaController.js');

const router = Router()
router.get('/reservascanchas',getReservasCanchas)
router.post('/reservarcancha',postReservaCancha)
router.get('/reservacanchaxid',getReservasCanchasxID)
router.get('/canchas',getCanchas)
router.post('/updatecancha',updateCanchas)
module.exports = router;
