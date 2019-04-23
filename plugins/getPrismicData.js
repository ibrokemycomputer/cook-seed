const Prismic = require('prismic-javascript');
const url = "https://pint-crush-test.prismic.io/api/v2";
const cwd = process.cwd();

customData = new Promise((resolve, reject) => {
  let tmpData = require(`${cwd}/config/data.js`);
  Prismic.getApi(url).then(api => {
    return api.query('');
  }).then(response => {
    tmpData.data = response.results;
    resolve(tmpData);
  }, err => {
    console.log(`Something went wrong: ${err}`);
    reject(err);
  });
});

module.exports = {customData};
