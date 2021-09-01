const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: String,
  count: Number,
  url: String,
});

module.exports =
  mongoose.models.category || mongoose.model("category", CategorySchema);
