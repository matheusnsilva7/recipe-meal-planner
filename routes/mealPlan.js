const express = require("express");
const router = express.Router();
const mealPlanController = require("../controllers/mealPlanController");
const ensureAuthenticated = require("../middleware/auth");

router.get("/", ensureAuthenticated, mealPlanController.getAllMealPlans);
router.get("/:id", ensureAuthenticated, mealPlanController.getMealPlanById);
router.post("/", ensureAuthenticated, mealPlanController.createMealPlan);
router.put("/:id", ensureAuthenticated, mealPlanController.updateMealPlan);
router.delete("/:id", ensureAuthenticated, mealPlanController.deleteMealPlan);

module.exports = router;
