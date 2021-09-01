const router = require("express").Router();
const fs = require("fs");
const categoryModel = require("../models/CategorySchema");
const videoModel = require("../models/VideoSchema");

const urlConverter = (url) => {
  let words = url;
  words = words.replace(/&/g, "and");
  words = words.replace(/ /g, "-");
  return words;
};

router.get("/", async (req, res) => {
  var currentdate = new Date();
  let mm = (currentdate.getMonth() + 1).toString();
  let dd = currentdate.getDate().toString();
  let yyyy = currentdate.getFullYear();
  let hours = currentdate.getHours().toString();
  let minutes = currentdate.getMinutes().toString();
  let seconds = currentdate.getSeconds().toString();

  if (dd.length === 1) {
    dd = 0 + dd;
  }

  if (mm.length === 1) {
    mm = 0 + mm;
  }

  if (hours.length === 1) {
    hours = 0 + hours;
  }

  if (minutes.length === 1) {
    minutes = 0 + minutes;
  }

  if (seconds.length === 1) {
    seconds = 0 + seconds;
  }

  let file = "";
  file +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
  file += "\n\t<url>";
  file += "\n\t\t<loc>https://my18videos.com/</loc>";
  file += `\n\t\t<lastmod>${yyyy}-${mm}-${dd}T${hours}:${minutes}:${seconds}+02:00</lastmod>`;
  file += "\n\t\t<priority>1.00</priority>";
  file += "\n\t</url>";

  //category generator
  const getCategory = await categoryModel.find();
  getCategory.forEach((c) => {
    file += "\n\t<url>";
    file += `\n\t\t<loc>https://my18videos.com/category/${c.url}/</loc>`;
    file += `\n\t\t<lastmod>${yyyy}-${mm}-${dd}T${hours}:${minutes}:${seconds}+02:00</lastmod>`;
    file += "\n\t\t<priority>0.50</priority>";
    file += "\n\t</url>";
  });

  //video generator
  const getVideo = await videoModel.find();
  getVideo.forEach((v) => {
    const nameConvert = urlConverter(v.name);

    const date = v.date;
    let mm = (date.getMonth() + 1).toString();
    let dd = date.getDate().toString();
    const yyyy = date.getFullYear();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();

    if (dd.length === 1) {
      dd = 0 + dd;
    }

    if (mm.length === 1) {
      mm = 0 + mm;
    }

    if (hours.length === 1) {
      hours = 0 + hours;
    }

    if (minutes.length === 1) {
      minutes = 0 + minutes;
    }

    if (seconds.length === 1) {
      seconds = 0 + seconds;
    }

    file += "\n\t<url>";
    file += `\n\t\t<loc>https://my18videos.com/video/${v.id}/${nameConvert}/</loc>`;
    file += `\n\t\t<lastmod>${yyyy}-${mm}-${dd}T${hours}:${minutes}:${seconds}+02:00</lastmod>`;
    file += "\n\t\t<priority>0.50</priority>";
    file += "\n\t</url>";
  });

  file += "\n</urlset>";

  //end
  fs.writeFile("../public/sitemap.xml", file, function (err, data) {
    if (err) {
      return console.log(err);
    }
  });
  res.status(200).json({ status: "ok" });
});

module.exports = router;
