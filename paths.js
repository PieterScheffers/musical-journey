const sanitizeFilename = require("sanitize-filename");
const path = require("path");
const config = require("./config");

const videoDir = config.videoPath;
const audioDir = config.audioPath;

function audioMp3(artist, title) {
  return sanitizeFilename(artist + ' ' + title + '.mp3');
}
exports.audioMp3 = audioMp3;

function videoMp4(artist, title) {
  return sanitizeFilename(artist + ' ' + title + '.mp4');
}
exports.videoMp4 = videoMp4;

function getPathToVideo(artist, title, subFolder = '') {
  if( subFolder ) {
    return path.join(videoDir, subFolder, videoMp4(artist, title));
  }

  return path.join(videoDir, videoMp4(artist, title));
}
exports.getPathToVideo = getPathToVideo;

function getPathToAudio(artist, title, subFolder = '') {
  if( subFolder ) {
    return path.join(audioDir, subFolder, audioMp3(artist, title));
  }

  return path.join(audioDir, audioMp3(artist, title));
}
exports.getPathToAudio = getPathToAudio;