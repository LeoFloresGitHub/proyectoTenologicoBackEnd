const { Router } = require('express');
const { getFuncionalidades, getFuncionalidadById,getPermisosByUser,cambiarPermisosByUser } = require('../controllers/funcionalidadController');


const router = Router();


router.get('/funcionalidades',getFuncionalidades);

router.get('/funcionalidades/:id',getFuncionalidadById);

router.get('/permisos/:id',getPermisosByUser);

router.post('/permisos/:id',cambiarPermisosByUser);

module.exports = router;