const Prismic = require('prismic-javascript');
const url = "https://pint-crush-test.prismic.io/api/v2";
const cwd = process.cwd();

let siteData = require(`${cwd}/config/data.js`);
let tmpData = {...siteData};

customData = new Promise((resolve, reject) => {
  Prismic.getApi(url).then(api => {
    return api.query('');
  }).then(response => {
    tmpData.prismic = response.results;
    resolve(tmpData);
    console.log('prismic ran');
  }, err => {
    console.log(`Something went wrong: ${err}`);
    reject(err);
  });
});

module.exports = {customData};