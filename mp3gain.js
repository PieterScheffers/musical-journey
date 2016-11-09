const exec = require("child_process").exec;
const path = require("path");

const mp3gainExe = path.join(__dirname, 'mp3gain-win-1_2_5', 'mp3gain.exe');

function mp3gain(file) {

  return new Promise((resolve, reject) => {
    const fileInfo = path.parse(file);
    if( fileInfo.ext !== '.mp3' ) throw new Error("mp3gain - file isn't an mp3 file");

    exec(`${mp3gainExe} /d 9.0 /r /p /c "${file}"`, (err, stdout, stderr) => {
      if( err ) return reject(err);
      resolve(stdout);
    });
  });
}

module.exports = mp3gain;
