const router = require("express").Router();
const videoModel = require("../models/VideoSchema");
const categoryModel = require("../models/CategorySchema");

router.get("/", async (req, res) => {
  const limit = 24;
  let page = parseInt(req.query.page) - 1;
  page = page * limit;

  try {
    const findVideo = await videoModel
      .find()
      .skip(page)
      .limit(limit)
      .sort({ date: -1 });
    const getLength = await (await videoModel.find()).length;
    res.status(200).json({ findVideo, videoLength: getLength, limit: limit });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  let videoData = [];
  try {
    const getVideo = await videoModel.findOne({ id: parseInt(req.params.id) });
    videoData.push({
      id: getVideo.id,
      name: getVideo.name,
      url: getVideo.url,
      tag: getVideo.tag,
    });
    res.status(200).json({
      id: getVideo.id,
      name: getVideo.name,
      url: getVideo.url,
      tag: getVideo.tag,
    });
  } catch (err) {
    console.log(err);
  }
});

const fisherYates = (array) => {
  var count = array.length,
    randomnumber,
    temp;
  while (count) {
    randomnumber = (Math.random() * count--) | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp;
  }
};

router.get("/similar/:id", async (req, res) => {
  const videoID = req.params.id;
  try {
    const getTag = await videoModel.findOne({ id: parseInt(videoID) });
    let getVideos = await videoModel.find({ "tag.0": getTag.tag[0] });
    fisherYates(getVideos);
    while (getVideos.length > 12) {
      getVideos.pop();
    }
    res.status(200).json(getVideos);
  } catch (err) {
    console.log(err);
  }
});

router.get("/category/:cat", async (req, res) => {
  const limit = 24;
  let page = parseInt(req.query.page) - 1;
  page = page * limit;

  const category = req.params.cat;
  try {
    const getCategory = await categoryModel.findOne({ url: category });
    const findVideo = await videoModel
      .find({ tag: { $in: [category, category.replace(/-/g, "")] } })
      .skip(page)
      .limit(limit)
      .sort({ date: -1 });
    const getLength = await (
      await videoModel.find({ tag: { $in: [category] } })
    ).length;

    res.status(200).json({
      findVideo,
      header: getCategory?.name || category,
      videoLength: getLength,
      limit: limit,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
