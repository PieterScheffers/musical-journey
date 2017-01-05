const Promise = require("bluebird");
const request = require("request-promise");
const fs = require("fs");
Promise.promisifyAll(fs);
const path = require("path");
const sanitizeFilename = require("sanitize-filename");
const config = require("./config");

exports.request = request;

let cacheDir = config.cachePath;
const oneWeek = 604800000;

function cacheAvailable(file, time) {
  return fs.statAsync(file)
  .then(stats => {
    return (stats.ctime.getTime() + time) > (new Date).getTime();
  })
  .catch(error => {
    if( error.code === 'ENOENT' ) {
      return false;
    }
    throw error;
  });
}

/**
 * @param  {string} url           [description]
 * @param  {int} options.time: Time in milliseconds (default: 1 week)
 * @return {contents}               [description]
 */
function requestWithCache(url, time = 604800000) {
  const file = path.join(cacheDir, sanitizeFilename(url) + ".html");

  return cacheAvailable(file, time)
  .then(hasCache => {
    if( hasCache ) return fs.readFileAsync(file, 'utf8');

    return request(url)
    .then(body => {
      return fs.writeFileAsync(file, body)
      .then(() => {
        return body;
      })
    });

  });
}

exports.requestWithCache = requestWithCache;
