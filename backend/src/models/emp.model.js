const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  number: {
    type: String,
    require: true,
  },
  post: {
    type: String,
    require: true,
  },
  profile: {
    type: String,
  },
});

const Emp = mongoose.model("Emp", empSchema);

module.exports = Emp;
