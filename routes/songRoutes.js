
const express = require("express");
const router = express.Router();
const fs = require("fs");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const ytdl = require("ytdl-core");
const {googleapis} = require('googleapis');
const apiKeys = require('../apikeys.json');
const path = require('path');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const {getAudio, convertTomp3} = require('../methods/songDownload');
const {driveUploader} = require('../methods/driveUpload');
const { drive } = require("googleapis/build/src/apis/drive");

router.post('/post', async (req, res) => {
    try {
        console.log('\nPost request received for song');
        console.log(req.body.url);
        if (!req.body.url || !req.body.name) return res.status(400).send('Missing required fields');
        
        await getAudio(req.body.url, req.body.name)
        .then((message) => {
            console.log(message);
        }).catch(err => {
            console.log(err, '\n');
            return res.status(500).send('Internal Server Error while using ytdl');
        });

        await convertTomp3(__dirname, req.body.name)
        .then((ffmpegMessage) => {
            console.log(ffmpegMessage);
        }).catch(err =>  {
            console.log(err, '\n');
            return res.status(500).send('Internal Server Error while using ffmpeg')
        });

        const driveResponse = await driveUploader(req.body.name);
        console.log(driveResponse);
        if (driveResponse === false) {
            console.log('driveResponse: ', driveResponse);
            return res.status(500).send('Internal Server Error while uploading to drive');
        }
        console.log('Uploaded to Drive\n')
        return res.status(200).send('Song Uploaded to Drive');

    } catch (e) {
        console.log('A problem occurred:', e, '\n');
        // return res.status(500).send('An error occurred');
    }
})
module.exports = router;

