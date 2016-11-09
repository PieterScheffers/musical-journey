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

const path = require("path");
const exec = require("child_process").exec;
const ffmpeg = path.join(__dirname, 'ffmpeg-3.1.4-win64-static', 'bin', 'ffmpeg.exe');
const sanitizeFilename = require("sanitize-filename");

const audioDir = path.join(__dirname, 'audio');

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
