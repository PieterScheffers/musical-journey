// id3tool [<options>] <filename>
//   -t, --set-title=WORD          Sets the title to WORD
//   -a, --set-album=WORD          Sets the album to WORD
//   -r, --set-artist=WORD         Sets the artist to WORD
//   -y, --set-year=YEAR           Sets the year to YEAR [4 digits]
//   -n, --set-note=WORD           Sets the note to WORD
//   -g, --set-genre=INT           Sets the genre code to INT
//   -G, --set-genre-word=WORD     Sets the genre to WORD
//   -c, --set-track=INT           Sets the track number to INT
//   -l, --genre-list              Shows the Genre's and their codes
//   -v, --version                 Displays the version
//   -h, --help                    Displays this message

const config = require('./config');
const spawnResult = require('./spawnResult');

const id3tool = config.id3tool;

function writeMeta(audio, data) {
  const metadata = Object.keys(data).map(k => `--set-${k}=${data[k]}`);

  const args = [ ...metadata, audio ];

  return spawnResult(id3tool, args);
}
module.exports = writeMeta;
