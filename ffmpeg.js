// const ffmpeg = require('fluent-ffmpeg');
// const path = require("path");

// ffmpeg.setFfmpegPath("C:\\Users\\piete_000\\Desktop\\youtube_download\\ffmpeg-3.1.4-win64-static\\bin\\ffmpeg.exe");
// ffmpeg.setFfmpegPath("C:\\Users\\piete_000\\Desktop\\youtube_download\\ffmpeg-3.1.4-win64-static\\bin\\ffprobe.exe");

// const audioDir = path.join(__dirname, 'audio');

// function mp4Tomp3(videoPath) {
//   return new Promise((resolve, reject) => {
//     const videoPathInfo = path.parse(videoPath);
//     const audioPath = path.join(audioDir, `${videoPathInfo.name}.mp3`);

//     ffmpeg(videoPath)
//       .once('error', function(error) {
//         reject(error);
//       })
//       .once('end', function() {
//         resolve(audioPath);
//       })
//       .save(audioPath);
//   });
// }
// exports.mp4Tomp3 = mp4Tomp3;

/**
 * Add metadata with ffmpeg http://jonhall.info/how_to/create_id3_tags_using_ffmpeg
 */


const path = require("path");
const exec = require("child_process").exec;
const config = require("./config");
const sanitizeFilename = require("sanitize-filename");

const ffmpeg = config.ffmpeg;
const audioDir = config.audioPath;

function mp4Tomp3(videoPath) {
  return new Promise((resolve, reject) => {
    const videoPathInfo = path.parse(videoPath);
    const audioPath = path.join(audioDir, sanitizeFilename(`${videoPathInfo.name}.mp3`));

    exec(`${ffmpeg} -y -i "${videoPath}" -q:a 0 -map a "${audioPath}"`, (err, stdout, stderr) => {
      if( err ) return reject(err);
      resolve(audioPath);
    });
  });
}
exports.mp4Tomp3 = mp4Tomp3;

const metadataKeys = [
  'title',
  'TIT3', // subtitle
  'artist',
  'album_artist',
  'album',
  'date',
  'track',
  'genre',
  'publisher',
  'encoded_by',
  'copyright',
  'composer',
  'performer',
  'TIT1', // group description
  'disc',
  'TKEY', // initial key
  'TBPM', // beats-per-minute
  'language', 
  'encoder'
];


function writeMeta(audioPath, data) {
  return new Promise((resolve, reject) => {

    // clean invalid keys and create metadata string
    const metaData = Object.keys(data)
      .filter(k => metadataKeys.includes(k))
      .map(k => `-metadata ${k}="${data[k]}"`)
      .join(' ');

    const writeCmd = `${ffmpeg} -y -i "${audioPath}" ${metaData} "${audioPath}"`;
    const convertCmd = `${ffmpeg} -y -i "${audioPath}" -id3v2_version 3 -write_id3v1 1 "${audioPath}"`;

    exec(writeCmd, (err, stdout, stderr) => {
      if( err ) return reject(err);

      exec(convertCmd, (err, stdout, stderr) => {
        if( err ) return reject(err);
        resolve(audioPath);
      });
    });

  });
}
exports.writeMeta = writeMeta;
