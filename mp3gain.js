const spawnResult = require('./spawnResult');
const path = require("path");
const config = require("./config");

const isWindows = process.platform === 'win32';

const mp3gainExe = config.mp3gain;

function mp3gain(file) {
  console.log("mp3gain", path.parse(file).base);

  const fileInfo = path.parse(file);
  if( fileInfo.ext !== '.mp3' ) throw new Error("mp3gain - file isn't an mp3 file");

  const a = isWindows ? '/' : '-';
  // `${mp3gainExe} ${a}d 9.0 ${a}r ${a}p ${a}c "${file}"`
  
  return spawnResult(mp3gainExe, [ `${a}d`, '9.0', `${a}r`, `${a}p`, `${a}c`, `"${file}"` ]);
}

module.exports = mp3gain;
