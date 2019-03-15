const Prismic = require('prismic-javascript');
const url = "https://pint-crush-test.prismic.io/api/v2";
const cwd = process.cwd();

let {siteData} = require(`../node_modules/static-build/scripts/plugins/site-data.js`);

async function getPrismicData() {
  Prismic.getApi(url).then(api => {
    return api.query('');
  }).then(response => {
    return siteData['prismic'] = response.results;
  }, err => {
    console.log(`Something went wrong: ${err}`);
    return;
  });
}

module.exports = getPrismicData;