const spawn = require('child_process').spawn;

function spawnResult(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);

    proc.once('error', (err) => {
      return reject(err);
    });

    // proc.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });

    // proc.stderr.on('data', (data) => {
    //   console.log(`stderr: ${data}`);
    // });

    proc.once('close', (code) => {
      // if( code > 0 ) {
      //   const error = `Exit code not 0, but ${code}, cmd: ${code}, args: ${JSON.stringify(args)}`;
      //   console.error("command:", [].concat([ cmd ], args).join(' '));
      //   return reject(new Error(error));
      // }
      resolve();
    });
  });
}

module.exports = spawnResult;
