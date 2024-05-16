const fs = require("fs");
// const { format } = require("path");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const {driveUploader} = require('../methods/driveUpload');
const { drive } = require("googleapis/build/src/apis/drive");
const { resolve } = require("dns");
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegStatic);

function getAudio(songUrl, songName) {
  const getAudioPromise = new Promise((resolve, reject) => {

    console.log('Name: ', songName);
    ytdl(songUrl, {
      filter: (format) => {
        return format.hasAudio && format.audioQuality;
      },
    })
    .on('end', () => {
      resolve('Download Finished');
    })
    .on('error', (err) => {
      reject(err);
    })
    .pipe(fs.createWriteStream(`./output/testAudio`));
  })
  return getAudioPromise;
}
function convertTomp3(basePath, songName) {
  const converterPromise = new Promise((resolve, reject) => {
    let inputPath = path.join(__dirname, '..', 'output'), outputPath = inputPath;
    inputPath = inputPath + `\\testAudio`;
    outputPath += `\\testAudio.mp3`;

    ffmpeg()
      .input(inputPath)
      // .audioCodec("libopus") //initially it was convert to opus
      .saveToFile(outputPath)
      .on("start", () => {console.log("Converting to mp3...")})
      .on("end", () => {
        resolve("Finished Converting");        
      })
      .on('error', (err) => {
        reject(err);
      })
  })
  return converterPromise
}

module.exports = {getAudio, convertTomp3};
