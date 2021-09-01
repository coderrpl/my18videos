import Link from "next/link";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import Head from "next/head";
import { urlConverter } from "../../../components/urlConverter";
import style from "../../../styles/Video.module.css";
import VideoItem from "../../../components/VideoItem";

Video.getInitialProps = async (ctx) => {
  const getVideo = await axios.get(
    `${process.env.HOST}/videos/${ctx.query.id}`
  );

  let videosData = [];
  const videos = await axios.get(
    `${process.env.HOST}/videos/similar/${ctx.query.id}`
  );
  videos.data.forEach((v) => {
    videosData.push({
      id: v.id,
      name: v.name,
      image: v.image,
      url: v.url,
    });
  });
  return {
    id: getVideo.data.id,
    name: getVideo.data.name,
    src: getVideo.data.url,
    tags: getVideo.data.tag,
    videos: videosData,
  };
};

function Video({ id, name, src, tags, videos }) {
  return (
    <div className={style.content}>
      <div className={style.frame}>
        <iframe
          src={src}
          id="video"
          frameBorder="0"
          width="510"
          height="400"
          scrolling="no"
          allowFullScreen="allowfullscreen"
        />
      </div>
      <h1>{name}</h1>
      <div>
        {tags.map((t, index) => (
          <Chip
            key={index}
            label={t}
            className={style.chip}
            component="a"
            href={`/tags/${encodeURIComponent(t.replace(/ /g, "-"))}`}
            clickable
            variant="outlined"
          />
        ))}
      </div>
      <h2>Similar videos</h2>
      <div className={style.video_items}>
        {videos.map((m, index) => (
          <VideoItem key={index} data={m} />
        ))}
      </div>
    </div>
  );
}

export default Video;
