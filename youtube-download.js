const ytdl = require('ytdl-core');
const path = require("path");
const fs = require("fs");
const sanitizeFilename = require("sanitize-filename");

const videosDir = path.join(__dirname, 'videos');

function ytDownload(url, song) {
  return new Promise((resolve, reject) => {

    const video = path.join(videosDir, sanitizeFilename(`${song.artist} - ${song.title}.mp4`));
    const writeStream = fs.createWriteStream(video);

    writeStream.on('finish', () => {
      resolve(video);
    });

    ytdl(url, { filter: function(format) { return format.container === 'mp4'; } })
      .pipe(writeStream)
      .once("error", (error) => {
        reject(error);
      });

  });
}
exports.ytDownload = ytDownload;

function ytGetInfo(url, options) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url, options, (err, info) => {
      if( err ) return reject(err);

      resolve(info);
    })
  });
}
exports.ytGetInfo = ytGetInfo;

function ytDownloadFromInfo(info, song, options) {
  return new Promise((resolve, reject) => {

    const video = path.join(videosDir, `${song.artist} - ${song.title}.mp4`);
    const writeStream = fs.createWriteStream(video);

    writeStream.on('finish', () => {
      resolve(video);
    });

    ytdl.downloadFromInfo(info, options)
      .pipe(writeStream)
      .on("error", (error) => {
        reject(error);
      });

  });
}
exports.ytDownloadFromInfo = ytDownloadFromInfo;