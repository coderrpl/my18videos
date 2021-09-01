const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

const app = express();
const port = 10000;

const corsOptions = {
  origin: ["http://localhost:3000", "https://my18videos.com"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const videosRoute = require("./routes/videos");
const categoriesRoute = require("./routes/categories");
const adminRoute = require("./routes/admin");
const sitemapRoute = require("./routes/sitemap");
app.use("/videos", videosRoute);
app.use("/categories", categoriesRoute);
app.use("/admin", adminRoute);
app.use("/sitemap", sitemapRoute);

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

app.listen(port, function () {
  console.log("listen on port " + port);
});
