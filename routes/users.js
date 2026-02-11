const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ensureAuthenticated = require('../middleware/auth');

router.get('/', ensureAuthenticated, usersController.getAllUsers);
router.get('/:id', ensureAuthenticated, usersController.getUserById);
router.post('/', ensureAuthenticated, usersController.createUser);
router.put('/:id', ensureAuthenticated, usersController.updateUser);
router.delete('/:id', ensureAuthenticated, usersController.deleteUser);

module.exports = router;
