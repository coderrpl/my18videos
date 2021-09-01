import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: 20,
  },
  chip: {
    color: "#fff",
    borderColor: "#fff",
    marginBottom: 5,
    marginRight: 5,
  },
  paper: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(1.5),
    margin: 0,
    marginBottom: 20,
    backgroundColor: "transparent",
    border: "none",
  },
  button: {
    marginTop: 20,
    width: "100%",
    height: 45,
  },
}));

function VideoForm({ data, fn, category }) {
  const classes = useStyles();
  const [added, addedChange] = useState(false);
  const [chipData, setChipData] = useState([]);

  useEffect(async () => {
    if (data.tags) {
      setChipData(data.tags);
    }
  }, [data.tags]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const addVideo = async () => {
    if (added) return false;

    try {
      const videoUpload = await axios.post(
        "http://localhost:4000/admin/addVideo",
        {
          category,
          name: data.title,
          url: data.url,
          image: data.image,
          tag: chipData,
        }
      );
      if (videoUpload.data.status === "ok") {
        addedChange(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="videoForm">
      <div className="iframeContainer">
        <img onClick={() => fn(data.url)} src={data.image} alt="" />
      </div>
      <h5 style={{ color: "#ad89fc" }}>{data.title}</h5>
      <form autocomplete="off">
        <Paper component="ul" className={classes.paper}>
          {chipData.map((data, index) => (
            <Chip
              label={data}
              onDelete={handleDelete(data)}
              className={classes.chip}
              color="secondary"
            />
          ))}
        </Paper>
        <Button
          onClick={addVideo}
          className={classes.button}
          variant="contained"
          color={`${added ? "secondary" : "primary"}`}
        >
          {added ? "Dodano pomyślnie!!" : "Dodaj"}
        </Button>
      </form>
    </div>
  );
}

export default VideoForm;
