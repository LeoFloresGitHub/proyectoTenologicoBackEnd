const { Router } = require('express');
const {getReservaPiscina,getReservasPiscinasxID,postReservaPiscina} = require('../controllers/reservapiscinaController.js');

const router = Router()
router.get('/reservaspiscina',getReservaPiscina)
router.post('/reservaspiscina',postReservaPiscina)
router.get('/reservaspiscinaxid',getReservasPiscinasxID)
module.exports = router;
