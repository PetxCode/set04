const mongoose = require("mongoose");

const Model = mongoose.Schema(
  {
    course: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("changeStreams", Model);
