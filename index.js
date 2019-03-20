const http = require('http');
const https = require('https');
const express = require('express');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const config = require('config');
const formidable = require('formidable');
const fs = require('fs');
const AdmZip = require('adm-zip');
const md5 = require('md5');
const utf8 = require('utf8');
const projectId = 'writes-186808';

const inAnalysisApp = require('./inAnalysis.js');

const GameRoom = require('./game_room.js');



const popApp = express();

popApp.set('view engine', 'ejs');

function getWebAttrs(){
  const webAttrs = {};
  webAttrs.webroot = config.get('webroot');
  webAttrs.backroot = config.get('backroot');
  webAttrs.webtitle = config.get('webtitle');
  return webAttrs;
}


function commonRoute(ejsName, req, res, optionData) {
  const webAttrs = getWebAttrs();
  if (req.params.id) {
    webAttrs.objectId = req.params.id;
  }
  if (optionData) {
    webAttrs.data = optionData;
  }
  res.render(ejsName, {
    webAttrs
  });
}

function parsingIndex(req, res) {
  commonRoute('popIndex.ejs', req, res);
}

function parsingAbout(req, res) {
  commonRoute('aboutus.ejs', req, res);
}

function parsingWantGuide(req, res) {
  commonRoute('wantguide.ejs', req, res);
}

function parsingTravelerFind(req, res) {
  commonRoute('travelerfind.ejs', req, res);
}

function parsingLogin(req, res) {
  commonRoute('login.ejs', req, res);
}

function parsingEscape(req, res) {
  commonRoute('escape.ejs', req, res);
}

function parsingTeam(req, res) {
  commonRoute('team.ejs', req, res);
}

function parsingGame(req, res) {
  commonRoute('game.ejs', req, res);
}




function parseSpeechPage(req, res) {
  commonRoute('popSpeech.ejs', req, res);
}

function parseSpeechTestPage(req, res) {
  commonRoute('popSpeechTest.ejs', req, res);
}

function parseSpeechApp(req, res) {
  commonRoute('popSpeechApp.ejs', req, res);
}

function parseTransApp(req, res) {
  commonRoute('popTransApp.ejs', req, res);
}

function parseFakeIndex(req, res) {
  commonRoute('fakeIndex.ejs', req, res);
}

function parseGuideMaker(req, res) {
  commonRoute('guide_maker.ejs', req, res);
}

function parseNewGuideMaker(req, res) {
  // commonRoute('new_guide_maker.ejs', req, res);
  commonRoute('new_guide_maker3.ejs', req, res);
}

function parseNtuTest(req, res) {
  commonRoute('test_gen.ejs', req, res);
}




popApp.use('/', express.static('public'));
popApp.get('/', parsingIndex);
popApp.get('/app1', parseSpeechPage);
popApp.get('/appTest', parseSpeechTestPage);
popApp.get('/speechApp', parseSpeechApp);
popApp.get('/transApp', parseTransApp);
popApp.get('/fakeIndex', parseFakeIndex);
popApp.get('/aboutus', parsingAbout);
popApp.get('/want_guide', parsingWantGuide);
popApp.get('/traveler/find', parsingTravelerFind);
popApp.get('/login', parsingLogin);
popApp.get('/escape', parsingEscape);
popApp.get('/team', parsingTeam);
popApp.get('/game', parsingGame);
popApp.get('/guide', parseGuideMaker);
popApp.get('/guide2', parseNewGuideMaker);
popApp.get('/testgen', parseNtuTest);


popApp.use('/iaapp', inAnalysisApp);//

// popApp.use('/speech', bodyParser.json());
// popApp.all('/speech', parseToGoogleSpeechAPI);
// popApp.use('/translate', bodyParser.json());
// popApp.all('/translate', parseToGoogleTranslateAPI);
// popApp.use('/zip', bodyParser.json());
// popApp.all('/zip', parseZipRequest);
// popApp.use('/xfyun', bodyParser.json());
// popApp.all('/xfyun', parseXfyunTranslate);

const httpServer = http.createServer(popApp);
//const httpsServer = https.createServer(credentials, mainApp);


// var io = require('socket.io')(httpServer);

// var gameRoom = new GameRoom();

// const socket_chat = io.of('/chat');
// socket_chat.on('connection', function (socket) {

//   socket.on('setName', function(data){
//     //設定使用者姓名
//     socket.client._username = data.name;
//     //送出歡迎訊息
//     socket_chat.emit('helloMsg', {
//       name: socket.client._username
//     });
//   });

//   socket.on('receiveMsg', function(data){
//     socket_chat.emit('msg', {
//       name: socket.client._username,
//       msg: data.msg,
//     });
//   });

//   socket.on('disconnecting', function (reason) {
//     socket_chat.emit('exitMsg', {
//       name: socket.client._username,
//     });
//   });

// });

// const team = io.of('/team');
// team.on('connection', function (socket) {
//   socket.username = '';

//   socket.on('setName', function (data) {
//     socket.username = data.name;
//     socket.client._username = data.name;
//   });

//   socket.on('joinTeam', function(data){
//     const teamId = data.id;
//     team.to(data.id).emit('memberJoined', { id: socket.id, name: socket.client._username});
//     team.to(data.id).emit('receiveMsg', {
//       msg: socket.client._username+' JOINED!!!',
//     });

//     socket.join(teamId, () => {
//       let userInRoom = [];
//       const tempRoom = team.to(teamId);
//       for( var k in tempRoom.connected){
//         const s = tempRoom.connected[k];
//         if(s.client._username && s.rooms[teamId]){
//           userInRoom.push({
//             id: s.id,
//             name: s.client._username,
//           });
//         }
//       }
//       socket.emit('memberList', { list: userInRoom});
//     });
//   });

//   socket.on('sendMsg', function (data) {
//     const teamId = data.teamId;
//     const name = socket.client._username;
//     const msg = data.msg;
//     team.to(teamId).emit('receiveMsg', {
//       msg: name+' : '+msg,
//     });
//   });

//   socket.on('disconnecting', function (reason) {
//     let rooms = Object.keys(socket.rooms);
//     for(var i=0;i<rooms[i];i++){
//       team.to(rooms[i]).emit('receiveMsg', {
//         msg: socket.client._username+' left...',
//       });
//       team.to(rooms[i]).emit('memberLeft', { id: socket.id, name: socket.client._username});
//     }
//   });
// });

httpServer.listen(8080);
//httpsServer.listen(8443);

//module.exports = popApp;
