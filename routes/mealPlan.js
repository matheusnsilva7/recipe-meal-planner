const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController");

router.get("/", mealPlanController.getAllMealPlans);
router.get("/:id", mealPlanController.getMealPlanById);
router.post("/", mealPlanController.createMealPlan);
router.put("/:id", mealPlanController.updateMealPlan);
router.delete("/:id", mealPlanController.deleteMealPlan);

module.exports = router;
