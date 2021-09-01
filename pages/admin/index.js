import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import SearchSettings from "../../components/admin/SearchSettings";
import VideoItem from "../../components/admin/VideoItem";
import VideoForm from "../../components/admin/VideoForm";
import style from "../../styles/admin/Admin.module.css";
import Button from "@material-ui/core/Button";
import webCategory from "../../components/admin/webCategory";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  formControl: {
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 45,
  },
  icon: {
    fill: "white",
  },
}));

function Admin() {
  const [videos, videosChange] = useState([]);
  const [embedSrc, embedSrcChange] = useState();
  const [source, sourceChange] = useState(null);
  const [category, categoryChange] = useState("");
  const [videoChoose, videoChooseChange] = useState([]);
  const [isReady, isReadyChange] = useState(false);
  const classes = useStyles();

  const videoChooseHandler = (v) => {
    videoChooseChange((videoChoose) => [...videoChoose, v]);
  };

  const submitChoose = async () => {
    const getChoose = await axios.post(`${process.env.HOST}/admin/getChoose`, {
      data: videoChoose,
      website: source,
    });
    if (getChoose) {
      let videoData = [];
      getChoose.data.forEach((m, index) => {
        videoData.push({
          url: videoChoose[index].url,
          title: videoChoose[index].title,
          image: videoChoose[index].image,
          tags: m,
        });
      });
      videoChooseChange(videoData);
      isReadyChange(true);
    }
  };

  return (
    <div className={style.content}>
      <SearchSettings
        videosChange={videosChange}
        videoChooseChange={videoChooseChange}
        category={category}
        categoryChange={categoryChange}
        source={source}
        sourceChange={sourceChange}
      />
      {!isReady && videos.length > 0 && (
        <>
          <div className={style.videos}>
            {videos.map((m, index) => (
              <VideoItem
                key={index}
                data={m}
                videoChooseHandler={videoChooseHandler}
              />
            ))}
          </div>
          <Button
            onClick={submitChoose}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Gotowe
          </Button>
        </>
      )}
      {isReady &&
        videoChoose.map((m) => (
          <VideoForm
            key={m.url}
            data={m}
            category={webCategory[source][category].category}
          />
        ))}
    </div>
  );
}

export default Admin;
