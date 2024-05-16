const express = require("express");
const router = express.Router();
const fs = require("fs");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const {googleapis} = require('googleapis');
const apiKeys = require('./apiKeys.json');
const path = require('path');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

ffmpeg.setFfmpegPath(ffmpegStatic);
function getAudio(videoUrl, songName, checkList ) {
  console.log("Starting downloading...");
  ytdl(videoUrl, {
    filter: (format) => {
      return format.hasAudio && format.audioQuality;
    },
  })
    .pipe(fs.createWriteStream("testAudio"))
    .on("finish", () => {
      checkList.isDownloadSuccess = true;
      console.log("Download Finished");
      convertToOpus(songName, checkList);
    });
}
async function convertToOpus(songName, checkList) {
  ffmpeg()
    .input("testAudio")
    .audioCodec("libopus")
    .saveToFile(`output/${songName}.opus`)
    .on("start", () => console.log("Converting to Opus..."))
    .on("end", () => {
        checkList.isConverted = true;
        console.log("Finished converting to Opus")
        })
    .on("error", (err) => console.log(err));
}
async function uploadToDrive() {

}

router.use("/", (req, res) => {
  const checkList = {
    isDownloadSuccess: false,
    isConverted: false,
    isUploaded: false,
  };
  const videoUrl = req.body.url,
    songName = req.body.name;
  console.log(videoUrl, songName);

  res.status(200).send("Testing post songs");
  try {
    if (!videoUrl && !songName) {
      res.status(400).send("Missing required fields");
      return;
    }
    if (!ytdl.validateURL(videoUrl)) {
      res
        .status(400)
        .send("Not able to parse VideoID. Please enter a valid link.");
    }
    getAudio(videoUrl, songName, checkList);
  } catch (error) {
    res.send(500).send("Internal server error");
  }
});
module.exports = router;
