require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=lUEtMPNHdOnVLFKnnpeeVWM3t7GiyQPKDao3Sj7m`
    ).then(res => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.get("/mars", async (req, res) => {
  try {
    if (!req.query.rover) {
      return res.send("Choose rover name");
    } else {
      let name = req.query.rover;
      let rover = await fetch(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/" +
          name +
          "/latest_photos?&api_key=lUEtMPNHdOnVLFKnnpeeVWM3t7GiyQPKDao3Sj7m"
      ).then(res => res.json());
      res.send({ rover });
    }
  } catch (err) {
    console.log("error", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?&api_key=DEMO_KEY
//latest pictures api change rovers name after 'rovers'
