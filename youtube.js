const ytDownload = require("./youtube-download").ytDownload;
const getSlam40Songs = require("./slam40");
const ytSearch = require("./youtube-search");
const mp4Tomp3 = require("./ffmpeg").mp4Tomp3;
const mp3gain = require("./mp3gain");
const emptyDir = require("empty-dir");
// const writeMeta = require("./ffmetadata").writeMeta;
const writeMeta = require('./ffmpeg').writeMeta;
const config = require("./config");

getSlam40Songs()
  .then(songs => {
    return Promise.all(
      songs.map(song => {
        return ytSearch(song.artist + " " + song.title, { maxResults: 1 })
          .then(ytResuls => ytResuls[0])
          .then(ytResult => {
            ytResult.song = song;
            return ytResult;
          });
      })
    );
  })
  .then(ytResults => {
    return ytResults.reduce((promise, ytResult) => {
      console.log("song", ytResult.song);
      console.log("link", ytResult.link);
      return promise
        .then(() => ytDownload(ytResult.link, ytResult.song))
        .then(video => {
          console.log("video", video);
          return mp4Tomp3(video); 
        })
        .then(audio => {
          console.log("audio", audio);
          return mp3gain(audio).then(() => audio);
        })
        .then(audio => {
          return writeMeta(audio, { album: "Slam!40", artist: ytResult.song.artist, title: ytResult.song.title });
        })
    }, Promise.resolve());
  })
  .then(() => {
    if( config.emptyVideoPath ) {
      emptyDir(config.videoPath, (err, result) => {});
    }
  });
