const search = require('youtube-search');

const env = require("./.env.json");

function youtubeSearch(query, opts) {
  opts = Object.assign({
    maxResults: 10,
    key: env.youtubeApi.key
  }, opts);

  return new Promise((resolve, reject) => {
    search(query, opts, function(err, results) {
      if(err) return reject(err);
     
      resolve(results);
    });
  });
}

module.exports = youtubeSearch;
