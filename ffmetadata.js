const ffmetadata = require("ffmetadata");

function writeMeta(song, data) {
  return new Promise((resolve, reject) => {
    ffmetadata.write(song, data, (err, dataOut) => {
      if( err ) return reject(err);
      resolve(dataOut);
    });
  });
}
exports.writeMeta = writeMeta;
