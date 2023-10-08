const { Router } = require('express');
const {
  getUsers,
  getUserByEmail,
  postUser,
  patchUser,
  deleteUser
} = require('../controllers/userController.js');



const router = Router()

router.get('/users',getUsers)
router.get('/user/:email',getUserByEmail)
router.post('/user',postUser)
router.patch('/user/:id',patchUser)
router.delete('/user/:id',deleteUser)

module.exports = router;