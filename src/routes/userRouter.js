const { Router } = require('express');
const {
  getUsers,
  getUserByEmail,
  postUser,
  patchUser,
  deleteUser,
  getUserById
} = require('../controllers/userController.js');



const router = Router()

router.get('/users',getUsers)
router.get('/user/:email',getUserByEmail)
router.post('/user',postUser)
router.patch('/user/:id',patchUser)
router.delete('/user/:id',deleteUser)
router.get('/users/:id',getUserById)

module.exports = router;