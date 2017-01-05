const exec = require("child_process").exec;
const path = require("path");
const config = require("./config");

const isWindows = process.platform === 'win32';

const mp3gainExe = config.mp3gain;

function mp3gain(file) {

  return new Promise((resolve, reject) => {
    const fileInfo = path.parse(file);
    if( fileInfo.ext !== '.mp3' ) throw new Error("mp3gain - file isn't an mp3 file");

    const a = isWindows ? '/' : '-';

    exec(`${mp3gainExe} ${a}d 9.0 ${a}r ${a}p ${a}c "${file}"`, (err, stdout, stderr) => {
      if( err ) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = mp3gain;
