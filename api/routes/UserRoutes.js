// routes/userRoutes.js
const express = require('express');
const { getUsers, getUserById, addUser, deleteUser } = require('../controllers/UserController');

const router = express.Router();

// Routes for user management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', addUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
