import React from "react";
import style from "../../styles/admin/VideoItem.module.css";

function VideoItem({ data, videoChooseHandler }) {
  return (
    <div onClick={() => videoChooseHandler(data)} className={style.content}>
      <div
        className={style.photo}
        style={{ backgroundImage: `url("${data.image}")` }}
      ></div>
      <div className={style.title}>{data.title}</div>
    </div>
  );
}

export default VideoItem;
