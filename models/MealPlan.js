const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MealPlan", mealPlanSchema);
