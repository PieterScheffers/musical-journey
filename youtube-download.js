const ytdl = require('ytdl-core');
const path = require("path");
const fs = require("fs");

const videosDir = path.join(__dirname, 'videos');

function ytDownload(url, video) {
  console.log("ytDownload", url, video);
  return new Promise((resolve, reject) => {

    const writeStream = fs.createWriteStream(video);

    writeStream.on('finish', () => {
      resolve(video);
    });

    writeStream.once('error', err => {
      console.error("ytDownload writeStream error:", err);
      reject(err);
    });

    const downloadStream = ytdl(url, { filter: function(format) { return format.container === 'mp4'; } });

    downloadStream.once('error', err => {
      console.error("ytDownload downloadstream error:", err);
      reject(err);
    });

    // pipe download to video file
    downloadStream.pipe(writeStream);
  });
}
exports.ytDownload = ytDownload;

function ytGetInfo(url, options) {
  console.log("ytGetInfo", url, options);

  return new Promise((resolve, reject) => {
    ytdl.getInfo(url, options, (err, info) => {
      if( err ) return reject(err);

      resolve(info);
    })
  });
}
exports.ytGetInfo = ytGetInfo;

function ytDownloadFromInfo(info, song, options) {
  console.log('ytDownloadFromInfo', info, song, options);
  
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
