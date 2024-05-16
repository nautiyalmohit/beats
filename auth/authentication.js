const fs = require('fs');
const {google} = require('googleapis');

const apikeys = require('../apikeys');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
async function authorize() {
    try {
        const jwtClient = new google.auth.JWT(
            apikeys.client_email,
            null, 
            apikeys.private_key,
            SCOPE
        )
        await jwtClient.authorize();
        console.log("Connected to Google Drive")
        return jwtClient;
    } catch (error) {
        console.log("Error while connecting to Google Drive");
    }
}
module.exports = {authorize};