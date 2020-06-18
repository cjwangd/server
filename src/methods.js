
const login = require('./login.js');
const startUser = require('./start-user.js');

const {  getUser, all } = require('./session.js');

function _wrapError(err){
  return {
    status: 'error',
    message: err.message
  }
}
function _wrapSuccess(data){
  return {
    status: 'success',
    data
  }
}

function _handleLogin({username, password, ip, sid, sessionData, userData}, send){
  login({
    username,
    password,
    ip,
    sid,
    sessionData,
    userData,
    end(err, sid2) {
      if(err){
        send(_wrapError(err));
        return;
      }
      send(_wrapSuccess(sid2));
    }})
}


// function loginAndStartUserProcess({username, password, sid, ip, sessionData, userData}, callback){

//   const pty = login({
//     username,
//     password,
//     ip,
//     end(err) {
//       if(err){
//         return callback(err);
//       }
//       let usersid;
//       if(!sid){
//         usersid = genSid();
//       } else {
//         usersid = sid;
//       }



//     }
//   });
// }



function _handleAll(data, send){
  send(_wrapSuccess(all()));
}

function _hanldeStartUser({sid, username}){
  const user = getUser(sid, username);
  if(user){
    startUser(user._pty);
  }
}



function _handlelogout({sid, username}, send){
  const user = getUser(sid, username);
  if(user){
    user._normal_exit();

    let timer = setTimeout(function(){
      timer = null;
      console.error('user pty normal exit fail. used close it by _socket.destory.');
      user._pty._socket.destory();
    }, 5000);

    user._pty.once('exit', function(){
      if(timer){
        clearTimeout(timer);
      }
      send(_wrapSuccess('ok'));
    });

  } else {
    send(_wrapSuccess('no user'));
  }
}

module.exports = {
  login: _handleLogin,
  logout: _handlelogout,
  all: _handleAll,
  startUser: _hanldeStartUser,
  serverListened: function(){
    global.__is_server_listened = true;
  }
};
