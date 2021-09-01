import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import Router from "next/router";
import Head from "next/head";
import { urlConverter } from "../../components/urlConverter";
import VideoItem from "../../components/VideoItem";
import style from "../../styles/Home.module.css";

Category.getInitialProps = async (ctx) => {
  let videosData = [];
  let page = 1;

  const videos = await axios.get(
    `${process.env.HOST}/videos/category/${ctx.query.name}?page=${ctx.query.page}`
  );
  videos.data.findVideo.forEach((v) => {
    videosData.push({
      id: v.id,
      name: v.name,
      image: v.image,
      url: v.forUrl,
    });
  });

  if (parseInt(ctx.query.page) > 1) {
    page = parseInt(ctx.query.page);
  }

  return {
    videos: videosData,
    header: videos.data.header,
    videoLength: videos.data.videoLength,
    limit: videos.data.limit,
    page: page,
    url: ctx.query.name,
  };
};

const changePage = (val, cat) => {
  Router.push(`/category/${cat}?page=${val}`);
  window.scrollTo(0, 0);
};

function Category({ videos, header, videoLength, limit, page, url }) {
  return (
    <div className={style.content}>
      <h1>{header}</h1>
      <div className="video_grid">
        {videos.map((m, index) => (
          <VideoItem key={index} data={m} />
        ))}
      </div>
      <div className="pagination">
        <Pagination
          page={page}
          className="pagination"
          onChange={(e, val) => changePage(val, url)}
          count={Math.ceil(videoLength / limit)}
          variant="outlined"
          shape="rounded"
        />
      </div>
      <iframe
        id="header_baner"
        src="https://go.eroadvertising.com/banner.go?spaceid=5149196"
        frameBorder="0"
        width="728"
        height="180"
        scrolling="no"
      ></iframe>
    </div>
  );
}

export default Category;
