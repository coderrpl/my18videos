import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
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

function SearchSettings({
  videosChange,
  videoChooseChange,
  category,
  categoryChange,
  source,
  sourceChange,
}) {
  const classes = useStyles();

  const searchHandler = () => {
    axios
      .get(
        `http://localhost:4000/admin/videoFinder?website=${source}&category=${webCategory[source][category].url}`
      )
      .then((response) => {
        videosChange(response.data);
        videoChooseChange([]);
      });
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Źródło</InputLabel>
        <Select
          label="Źródło"
          value={source}
          onChange={(e) => sourceChange(e.target.value)}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
        >
          <MenuItem value="pornhub">Pornhub</MenuItem>
          <MenuItem value="xvideos">Xvideos</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">
          Kategoria
        </InputLabel>
        <Select
          label="Kategoria"
          value={category.name}
          onChange={(e) => categoryChange(e.target.value)}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
        >
          {source &&
            webCategory[source].map((m, index) => (
              <MenuItem key={index} value={index}>
                {m.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button
        onClick={searchHandler}
        className={classes.button}
        variant="contained"
        color="primary"
      >
        Szukaj
      </Button>
    </div>
  );
}

export default SearchSettings;
