import style from "../styles/Home.module.css";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import VideoItem from "../components/VideoItem";

Home.getInitialProps = async (ctx) => {
  let videosData = [];
  let page = 1;

  const videos = await axios.get(
    `${process.env.HOST}/videos?page=${ctx.query.page}`
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
    videoLength: videos.data.videoLength,
    limit: videos.data.limit,
    page: page,
  };
};

function Home({ videos, videoLength, limit, page }) {
  const changePage = (val) => {
    Router.push(`?page=${val}`);
    window.scrollTo(0, 0);
  };
  return (
    <div className={style.content}>
      <Head>
        <title>Best free porn videos - cumshutter.com</title>
        <meta
          name="description"
          content="Best free porn videos. Erotic videos at the highest level. Big tits, hot milf"
        />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href="https://cumshutter.com/" />
        <link rel="next" href={`https://cumshutter.com?page=${page + 1}`} />
        <meta property="og:locale" content="en" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Best free porn videos - cumshutter.com"
        />
        <meta
          property="og:description"
          content="Best free porn videos. Erotic videos at the highest level. Big tits, hot milf"
        />
        <meta property="og:url" content="https://cumshutter.com/" />
        <meta
          property="og:site_name"
          content="Best free porn videos - cumshutter.com"
        />
        {/* <script type="text/javascript" src="/popads.js" data-cfasync="false"></script>
        <script type='text/javascript' src='https://pl15960589.toprevenuecpmnetwork.com/16/ac/73/16ac73380e78a79f34bd49029e44d083.js'></script> */}
      </Head>
      <div className={style.items}>
        {videos.map((m, index) => (
          <VideoItem key={index} data={m} />
        ))}
      </div>
      <Pagination
        page={page}
        className="pagination"
        onChange={(e, val) => changePage(val)}
        count={Math.ceil(videoLength / limit)}
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
}

export default Home;
