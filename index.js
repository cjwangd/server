
const os = require('os');

const env = process.env;
// Protect my disk
global.__TMP_DIR__ = (env.NODE_ENV === 'production') ? os.tmpdir() : '/dev/shm';

if(os.userInfo().username !== 'linux-remote'){
  console.error(`linux-remote must start by the 'linux-remote' user.`);
  process.exit(1);
}


global.CONF = {
  serverPath: env.LR_SERVER_PATH,
  userServerPath: env.LR_USER_SERVER_PATH,
  loginBinPath: env.LR_LOGIN_BIN_PATH,
}

require('./src/net-server.js');
