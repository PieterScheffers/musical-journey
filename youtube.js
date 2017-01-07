const ytDownload = require("./youtube-download").ytDownload;
const getSlam40Songs = require("./slam40");
const ytSearch = require("./youtube-search");
const mp4Tomp3 = require("./ffmpeg").mp4Tomp3;
const mp3gain = require("./mp3gain");
// const emptyDir = require("empty-dir");
// const writeMeta = require("./ffmetadata").writeMeta;
const writeMeta = require('./ffmpeg').writeMeta;
const config = require("./config");
const containsFile = require("./file").containsFile;
const unlink = require('./file').unlink;
const moment = require('moment');
const audioMp3 = require('./paths').audioMp3;
const getPathToVideo = require('./paths').getPathToVideo;
const getPathToAudio = require('./paths').getPathToAudio;

// function downloadSong(name, args) {
//   const defArgs = {
//     album: {
//       name: '',  // create album to store
//       subFolderCb: function() { return ''; } // function to create subfolder for album
//     },
//     force: false // force download and overwrite
//   };
//   args = Object.assign({}, defArgs, args);

//   const albumAudioDir = path.join(config.audioPath, ar)

//   containsFile(config.)
//   ytSearch(name, { maxResults: 1 })
// }


function searchSong(song) {
  // search youtube api for song
  return ytSearch(song.artist + " " + song.title, { maxResults: 1 })

    // get first result
    .then(results => results[0])

    // add song to result
    .then(ytResult => {
      ytResult.song = song;
      return ytResult;
    });
}

// grab the current slam40 songs from the Slam40 website
getSlam40Songs()
// first filter songs list for existing songs
.then(songs => {
  // check a song exist serially
  return songs.reduce((promise, s) => {

    // return a promise that resolves an array of non-existing songs
    return promise.then(songs => {
      return containsFile(config.audioPath, audioMp3(s.artist, s.title))
        .then(files => {
          if( !files.length ) songs.push(s);
          return songs;
        });
    });

  }, Promise.resolve([]));
})
// search for, download mp4 video, convert to mp3 and mp3gain all songs that doesn't exist yet
.then(songs => {
  const subFolder = config.divideAudioInWeeks ? `Slam40 ${moment().format('YYYY-ww')}` : '';

  // serially
  return songs.reduce((promise, s) => {
    const videoPath = getPathToVideo(s.artist, s.title, subFolder);
    const audioPath = getPathToAudio(s.artist, s.title, subFolder);

    // return a promise
    return promise.then(() => {
      // search youtube api for song
      searchSong(s)
      // get link to video
      .then(ytRes => ytRes.link)
      // download video
      .then(link => ytDownload(link, videoPath))
      // convert mp4 video to mp3 audio
      .then(video => {
        mp4Tomp3(video, audioPath)
        .then(audio => {
          // delete video file if in config to do so
          if( config.emptyVideoPath ) {
            return unlink(video).then(() => audio);
          }

          return audio;
        })
      })
      // apply volume leveling with mp3gain to mp3
      .then(audio => mp3gain(audio).then(() => audio))
      // write metadata to mp3
      .then(audio => writeMeta(audio, { album: "Slam!40", artist: s.artist, title: s.title }))

    });

  }, Promise.resolve([]));

})

// getSlam40Songs()
//   .then(songs => {
//     return Promise.all(
//       songs.map(song => {
//         return ytSearch(song.artist + " " + song.title, { maxResults: 1 })
//           .then(ytResuls => ytResuls[0])
//           .then(ytResult => {
//             ytResult.song = song;
//             return ytResult;
//           });
//       })
//     );
//   })
//   .then(ytResults => {
//     return ytResults.reduce((promise, ytResult) => {
//       console.log("song", ytResult.song);
//       console.log("link", ytResult.link);
//       return promise
//         .then(() => ytDownload(ytResult.link, ytResult.song))
//         .then(video => {
//           console.log("video", video);
//           return mp4Tomp3(video);
//         })
//         .then(audio => {
//           console.log("audio", audio);
//           return mp3gain(audio).then(() => audio);
//         })
//         .then(audio => {
//           return writeMeta(audio, { album: "Slam!40", artist: ytResult.song.artist, title: ytResult.song.title });
//         })
//     }, Promise.resolve());
//   })
//   .then(() => {
//     if( config.emptyVideoPath ) {
//       emptyDir(config.videoPath, (err, result) => {});
//     }
//   });
