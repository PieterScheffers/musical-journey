/**
 * Add metadata with ffmpeg http://jonhall.info/how_to/create_id3_tags_using_ffmpeg
 */

const path = require("path");
const spawnResult = require('./spawnResult');
const config = require("./config");
const sanitizeFilename = require("sanitize-filename");

const ffmpeg = config.ffmpeg;
const audioDir = config.audioPath;

function mp4Tomp3(videoPath) {
  console.log("mp4Tomp3", path.parse(videoPath).base);
  
  const videoPathInfo = path.parse(videoPath);
  const audioPath = path.join(audioDir, sanitizeFilename(`${videoPathInfo.name}.mp3`));

  // `${ffmpeg} -y -i "${videoPath}" -q:a 0 -map a "${audioPath}"`
  return spawnResult(ffmpeg, [ '-y', '-i', `"${videoPath}"`, '-q:a', '0', '-map', 'a', `"${audioPath}"`]);
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
  console.log("writeMeta", path.parse(audioPath).base, data);

  // clean invalid keys and create metadata string
  const metaData = Object.keys(data)
    .filter(k => metadataKeys.includes(k))
    .map(k => `-metadata ${k}="${data[k]}"`);

  const writeCmd = [].concat(['-y', '-i', `"${audioPath}"` ], metaData, [ `"${audioPath}"` ]);
  const convertCmd = ['-y', '-i', `"${audioPath}"`, '-id3v2_version', '3', '-write_id3v1', '1', `"${audioPath}"` ];

  // write metadata
  return spawnResult(ffmpeg, writeCmd)
  .then(() => {
    return spawnResult(ffmpeg, convertCmd);
  });

}
exports.writeMeta = writeMeta;
