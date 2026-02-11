const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    username: { type: String },
    locale: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
