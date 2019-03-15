const Prismic = require('prismic-javascript');
const url = "https://pint-crush-test.prismic.io/api/v2";
const cwd = process.cwd();

let {siteData} = require(`${cwd}/node_modules/static-build/scripts/plugins/site-data.js`);

async function getPrismicData() {
  console.dir('Printing siteData from getPrismicData.js');
  console.dir(siteData);
  Prismic.getApi(url).then(function(api) {
    return api.query(""); // An empty query will return all the documents
  }).then(function(response) {
    console.log('Printing prismic data:');
    console.dir(response.results);
    return siteData.prismic = response.results;
  }, function(err) {
    console.log("Something went wrong: ", err);
    break;
  });
}

module.exports = getPrismicData;