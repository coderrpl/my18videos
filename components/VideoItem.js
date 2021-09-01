import React from "react";
import Link from "next/link";
import { urlConverter } from "../components/urlConverter";
import style from "../styles/component/VideoItem.module.css";

function VideoItem({ data }) {
  return (
    <Link href={`/video/${data.id}/${urlConverter(data.name)}`}>
      <a className={style.item}>
        <div
          className={style.item_photo}
          style={{ backgroundImage: `url("${data.image}")` }}
        ></div>
        <div className={style.item_title}>{data.name}</div>
      </a>
    </Link>
  );
}

export default VideoItem;
