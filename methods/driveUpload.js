const fs =  require('fs');
const {google} = require('googleapis');
const apikeys = require('../apikeys.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const { rejects } = require('assert');
const { drive } = require('googleapis/build/src/apis/drive');
let driveSongName = 'testAudio';
async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}
async function uploadFile(authClient){
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 
        var fileMetaData = {
            name: `${driveSongName}.mp3`,    
            parents:['1ZtJ1KzyMLfWpU68cdlfut3QN5rBFGRVu'] // A folder ID to which file will get uploaded
        }
        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream(`./output/testAudio.mp3`), // files that will get uploaded
                mimeType:'audio/mpeg'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            resolve(file);
        })
    });
}
async function driveUploader(songName) {
    try {
        driveSongName = songName
        await authorize().then(uploadFile).catch("error",(err) => {
            console.log(err);
        });
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
}
module.exports = {driveUploader};