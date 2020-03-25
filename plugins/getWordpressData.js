const https = require('https');
const url = "https://wordpress.endpoint/api";
const cwd = process.cwd();

let siteData = require(`${cwd}/config/data.js`);
let tmpData = {...siteData};
let httpData = '';

customData = new Promise((resolve, reject) => {
  https.get(url, resp => {

    resp.on('data', chunk => httpData += chunk );

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      tmpData.data = JSON.parse(httpData).events;
      resolve(tmpData);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    reject(err);
  });

});

module.exports = {customData};