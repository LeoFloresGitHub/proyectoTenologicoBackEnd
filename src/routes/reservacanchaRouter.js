const { Router } = require('express');
const {getReservasCanchas,postReservaCancha,getReservasCanchasxID} = require('../controllers/reservacanchaController.js');

const router = Router()
router.get('/reservascanchas',getReservasCanchas)
router.post('/reservarcancha',postReservaCancha)
router.get('/reservacanchaxid',getReservasCanchasxID)
module.exports = router;
