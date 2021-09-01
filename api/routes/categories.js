const router = require("express").Router();
const categoryModel = require("../models/CategorySchema");

router.get("/", async (req, res) => {
  try {
    const findCategory = await categoryModel.find();
    res.status(200).json(findCategory);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
