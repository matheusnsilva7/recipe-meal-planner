const Recipe = require("../models/Recipe");

const getAllRecipes = async (req, res) => {
  //#swagger.tags=["Recipes"]
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipeById = async (req, res) => {
  //#swagger.tags=["Recipes"]
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate({
        path: "userId",
        select: "firstName lastName email username locale -_id",
      })
      .populate({ path: "tagsId", select: "name description -_id" });

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRecipe = async (req, res) => {
  //#swagger.tags=["Recipes"]
  try {
    const { title, description, ingredients, steps, tagsId } = req.body;

    const recipe = new Recipe({
      userId: req.session.user._id,
      title,
      description,
      ingredients,
      steps,
      tagsId,
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRecipe = async (req, res) => {
  //#swagger.tags=["Recipes"]
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const { title, description, ingredients, steps, tagsId } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (ingredients) updateData.ingredients = ingredients;
    if (steps) updateData.steps = steps;
    if (tagsId) updateData.tagsId = tagsId;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRecipe = async (req, res) => {
  //#swagger.tags=["Recipes"]
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
