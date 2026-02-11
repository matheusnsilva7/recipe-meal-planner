const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }],
    tagsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recipe", recipeSchema);
