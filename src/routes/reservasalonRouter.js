const { Router } = require('express');
const {getReservasSalones,getReservasSalonesxID,postReservaSalon, getSalones, updateSalones} = require('../controllers/reservasalonController.js');

const router = Router()

router.get('/reservassalon',getReservasSalones)
router.post('/reservarsalon',postReservaSalon)
router.get('/reservasalonxid',getReservasSalonesxID)
router.get('/salones',getSalones)
router.post('/updatesalon',updateSalones)
module.exports = router;
