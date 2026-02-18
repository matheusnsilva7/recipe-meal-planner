const MealPlan = require("../models/MealPlan");

const getAllMealPlans = async (req, res) => {
  //#swagger.tags=["Meal Plans"]
  try {
    const mealPlans = await MealPlan.find()
      .populate({
        path: "userId",
        select: "firstName lastName email username locale -_id",
      })
      .populate({
        path: "recipeId",
        select: "title description -_id",
      });

    res.status(200).json(mealPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMealPlanById = async (req, res) => {
  //#swagger.tags=["Meal Plans"]
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate({
        path: "userId",
        select: "firstName lastName email username locale _id",
      })
      .populate({
        path: "recipeId",
        select: "title description -_id",
      });

    if (!mealPlan) {
      return res.status(404).json({ message: "MealPlan not found" });
    }

    res.status(200).json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createMealPlan = async (req, res) => {
  //#swagger.tags=["Meal Plans"]
  try {
    const { recipeId, date, mealType, notes } = req.body;

    const mealPlan = new MealPlan({
      userId: req.session.user._id,
      recipeId,
      date,
      mealType,
      notes,
    });

    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateMealPlan = async (req, res) => {
  //#swagger.tags=["Meal Plans"]
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan)
      return res.status(404).json({ message: "MealPlan not found" });

    if (mealPlan.userId._id.toString() !== req.session.user._id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { recipeId, date, mealType, notes } = req.body;

    const updateData = {};
    if (recipeId) updateData.recipeId = recipeId;
    if (date) updateData.date = date;
    if (mealType) updateData.mealType = mealType;
    if (notes) updateData.notes = notes;

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    res.json(updatedMealPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMealPlan = async (req, res) => {
  //#swagger.tags=["Meal Plans"]
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan)
      return res.status(404).json({ message: "MealPlan not found" });

    if (mealPlan.userId._id.toString() !== req.session.user._id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await MealPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "MealPlan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
};
