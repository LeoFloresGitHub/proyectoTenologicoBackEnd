const { Router } = require('express');
const {getReservaPiscina,getReservasPiscinasxID,postReservaPiscina, getPiscinas, updatePiscinas} = require('../controllers/reservapiscinaController.js');

const router = Router()
router.get('/reservaspiscina',getReservaPiscina)
router.post('/reservaspiscina',postReservaPiscina)
router.get('/reservaspiscinaxid',getReservasPiscinasxID)
router.get('/piscinas',getPiscinas)
router.post('/updatepiscina',updatePiscinas)
module.exports = router;
