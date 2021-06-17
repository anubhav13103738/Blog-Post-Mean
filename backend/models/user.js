const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

mongoose.plugin(mongooseValidator);

module.exports = mongoose.model("User", userSchema);
