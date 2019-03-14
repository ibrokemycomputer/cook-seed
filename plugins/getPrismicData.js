const Prismic = require('prismic-javascript');
const url = "https://pint-crush-test.prismic.io/api/v2";
const cwd = process.cwd();

async function getPrismicData() {
  Prismic.getApi(url).then(function(api) {
    return api.query(""); // An empty query will return all the documents
  }).then(function(response) {
    return () => {
      response.results;
    }
  }, function(err) {
    console.log("Something went wrong: ", err);
    break;
  });
}

module.exports = getPrismicData;