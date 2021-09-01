const router = require("express").Router();
const request = require("request");
const HTMLParse = require("node-html-parser");
const videoModel = require("../models/VideoSchema");
const categoryModel = require("../models/CategorySchema");

router.post("/addVideo", async (req, res) => {
  const data = req.body;
  let tags = data.tag;

  const videoID = (await videoModel.countDocuments()) + 1;
  console.log(tags);

  tags.map((m, index) => {
    tags[index] = tags[index].replace(/-/g, "");
    tags[index] = tags[index].replace(/ /g, "");
    tags[index] = tags[index].toLowerCase();
  });

  for await (const m of data.tag) {
    const findCategory = await categoryModel.updateOne(
      { url: m },
      { $inc: { count: 1 } }
    );
  }

  const addVideo = new videoModel({
    id: videoID,
    name: data.name,
    url: data.url,
    image: data.image,
    tag: data.tag,
  });
  await addVideo.save();
  res.status(200).json({ status: "ok" });
});

router.get("/videoFinder", async (req, res) => {
  //from pornsite
  // /video?/c=29&page=4/
  let result;
  const websiteName = req.query.website;
  const category = req.query.category;

  if (websiteName === "pornhub") {
    result = await pornhubFinder(websiteName, category);
  }

  if (websiteName === "xvideos") {
    result = await xvideosFinder(websiteName, category);
  }

  await Promise.all(
    result.map(async (f, index) => {
      const isVideo = await videoModel.findOne({ url: f.url });
      if (isVideo || typeof f.image === "undefined" || f.image === null) {
        result.splice(index, 1);
      }
    })
  );

  res.json(result);
});

router.post("/getChoose", async (req, res) => {
  const allVideos = req.body.data;
  const websiteName = req.body.website;
  const findedTags = [];
  await Promise.all(
    allVideos.map(async (i, index) => {
      let r;
      if (websiteName === "xvideos") {
        r = await chooseXvideos(websiteName, i.id);
        findedTags.push(r);
      } else {
        r = await choosePornhub(websiteName, i.id);
        findedTags.push(r);
      }
    })
  );
  res.status(200).json(findedTags);
});

function choosePornhub(websiteName, videoID) {
  const buildUrl = `https://www.${websiteName}.com/view_video.php?viewkey=${videoID}/`;
  const myPromise = new Promise((resolve, reject) => {
    request(
      {
        uri: buildUrl,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/41.0.2228.0 Safari/537.36",
        },
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          return false;
        }
        const parser = HTMLParse.parse(body);
        const get = parser.querySelector(".categoriesWrapper");
        const getTag = get.querySelectorAll(".item");
        let videoTabel = [];
        getTag.map((m) => {
          const findedTag = m.innerHTML;
          videoTabel.push(findedTag);
        });
        resolve(videoTabel);
      }
    );
  });
  return myPromise;
}

function chooseXvideos(websiteName, videoID) {
  const buildUrl = `https://www.${websiteName}.com/video${videoID}/`;
  const myPromise = new Promise((resolve, reject) => {
    request(
      {
        uri: buildUrl,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/41.0.2228.0 Safari/537.36",
        },
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          return false;
        }
        const parser = HTMLParse.parse(body);
        const get = parser.querySelector(".video-metadata ul");
        const getTag = get.querySelectorAll("li");
        let videoTabel = [];
        getTag.map((m) => {
          const findedTag = m.querySelector(".btn.btn-default").text;
          videoTabel.push(findedTag);
        });
        resolve(videoTabel);
      }
    );
  });
  return myPromise;
}

function xvideosFinder(websiteName, category) {
  //https://www.xvideos.com/video2564033/juliareaves-dirtymovie_-_jessei_winter_-_scene_3_young_pornstar_naked_bigtits_pussy
  //https://www.xvideos.com/embedframe/2564033

  const randomPage = Math.floor(Math.random() * 100) + 1;

  const buildUrl = `https://www.${websiteName}.com${category}/${randomPage}`;

  const myPromise = new Promise((resolve, reject) => {
    request(
      {
        uri: buildUrl,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/41.0.2228.0 Safari/537.36",
        },
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          return false;
        }
        const parser = HTMLParse.parse(body);
        const get = parser.querySelectorAll(".thumb-block");
        let videoTabel = [];
        get.map((m) => {
          const getWrapper = m.querySelector(".thumb-inside .thumb a img");
          const getVideoId = getWrapper.getAttribute("data-videoid");
          const createUrl = `https://www.xvideos.com/embedframe/${getVideoId}`;
          const getImageUrl = getWrapper.getAttribute("data-src");
          let getTitle = m.querySelector(".title a");
          getTitle = getTitle.getAttribute("title");

          videoTabel.push({
            id: getVideoId,
            image: getImageUrl,
            title: getTitle,
            url: createUrl,
          });
        });
        resolve(videoTabel);
      }
    );
  });
  return myPromise;
}

function pornhubFinder(websiteName, category) {
  const randomPage = Math.floor(Math.random() * 100) + 1;

  const buildUrl = `https://www.${websiteName}.com/video?${category}&page=${randomPage}`;

  const myPromise = new Promise((resolve, reject) => {
    request(
      {
        uri: buildUrl,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko)  Chrome/41.0.2228.0 Safari/537.36",
        },
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
          return false;
        }
        const parser = HTMLParse.parse(body);
        const get = parser.querySelectorAll(".pcVideoListItem");
        let videoTabel = [];
        get.map((m) => {
          const getVideoId = m.getAttribute("data-video-vkey");
          let getImageUrl = m.querySelector(".wrap .phimage a img");
          getImageUrl = getImageUrl.getAttribute("data-src");
          let getTitle = m.querySelector(
            ".wrap .thumbnail-info-wrapper .title a"
          );
          getTitle = getTitle.getAttribute("title");
          const createUrl = `https://www.pornhub.com/embed/${getVideoId}`;
          videoTabel.push({
            id: getVideoId,
            image: getImageUrl,
            title: getTitle,
            url: createUrl,
          });
        });
        resolve(videoTabel);
      }
    );
  });
  return myPromise;
}

module.exports = router;
