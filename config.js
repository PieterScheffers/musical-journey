const fs = require("fs");
const path = require("path");

function getConfig() {
  const defaults = {
    youtubeApiKey: "",
    mp3gain: path.join(__dirname, 'mp3gain-win-1_2_5', 'mp3gain.exe'),
    ffmpeg: path.join(__dirname, 'ffmpeg-3.1.4-win64-static', 'bin', 'ffmpeg.exe'),
    videoPath: path.join(__dirname, 'videos'),
    audioPath: path.join(__dirname, 'audio'),
    cachePath: path.join(__dirname, 'cache'),
    emptyVideoPath: false,
    divideAudioInWeeks: true
  };

  try {
    const contents = fs.readFileSync(path.join(__dirname, '.env.json'));
    return Object.assign({}, defaults, JSON.parse(contents));

  } catch(error) {
    return defaults;
  }
}

const config = getConfig();

module.exports = config;
