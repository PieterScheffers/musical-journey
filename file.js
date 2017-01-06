const fs = require('fs');
const path = require("path");

const isWindows = process.platform === 'win32';

function readdir(path, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, options, (err, files) => {
      if(err) return reject(err);
      resolve(files);
    });
  });
}
exports.readdir = readdir;

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if(err) return reject(err);
      resolve(Object.assign(stats, { fullPath: path }));
    });
  });
}
exports.stat = stat;

/**
 * Recursively checks if a directory contains a file
 */
function containsFile(dir, file) {
  return readdir(dir)
  .then(files => files.map(f => path.join(dir, f)))
  .then(paths => {
    return Promise.all(paths.map(p => stat(p)));
  })
  .then(stats => {
    return Promise.all(stats.map(s => {
      const base = path.parse(s.fullPath).base;

      if( s.isDirectory() && base !== 'node_modules' ) return containsFile(s.fullPath, file);

      if (isWindows) {
        return Promise.resolve(s.isFile() && base.toLowerCase() == path.parse(file).base.toLowerCase());
      }

      return Promise.resolve(s.isFile() && base == path.parse(file).base);      
    }));
  })
  .then(bools => {
    for (let i = 0; i < bools.length; i++) {
      if( bools[i] ) return true;
    }

    return false;
  })
}
exports.containsFile = containsFile;
