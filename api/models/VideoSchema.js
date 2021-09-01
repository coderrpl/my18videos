const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema({
  id: Number,
  name: String,
  url: String,
  image: String,
  tag: [],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.videos || mongoose.model("videos", VideoSchema);
