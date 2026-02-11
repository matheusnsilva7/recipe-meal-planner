const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController'); // updated
const ensureAuthenticated = require('../middleware/auth');

router.get('/', ensureAuthenticated, recipesController.getAllRecipes);
router.get('/:id', ensureAuthenticated, recipesController.getRecipeById);
router.post('/', ensureAuthenticated, recipesController.createRecipe);
router.put('/:id', ensureAuthenticated, recipesController.updateRecipe);
router.delete('/:id', ensureAuthenticated, recipesController.deleteRecipe);

module.exports = router;
