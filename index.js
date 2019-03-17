const http = require('http');
const https = require('https');
const express = require('express');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const config = require('config');
const formidable = require('formidable');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { base64encode, base64decode } = require('nodejs-base64');
const md5 = require('md5');
const utf8 = require('utf8');

const Translate = require('@google-cloud/translate');
const projectId = 'writes-186808';

const Maoli1App = require('./maoli_1.js');
const Maoli2App = require('./maoli_2.js');
const writes2App = require('./writes.js');
const inAnalysisApp = require('./inAnalysis.js');

const GameRoom = require('./game_room.js');

const translate = new Translate({
  projectId: projectId,
});

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

async function parseToGoogleSpeechAPI(req, res) {
  const data = req.body;
  const resJson = await googleSpeechAPI(data);
  if (resJson != null) {
    res.json(resJson);
  } else {
    res.json({
      status: 'error',
      reason: '?????'
    });
  }
};

async function parseXfyunTranslate(req, res){
  const data = req.body;
  const text = data.text;
  const from = data.from;
  const to = data.to;

  const appid = '5b99cff0';
  const key = 'ec6499c6d4920e2fa73e917fc1b692be';

  const xPar = base64encode(`appid=${appid}`);
  const sign = md5(`${text}${xPar}${key}`);
  const url = `http://openapi.openspeech.cn/webapi/its.do?svc=its&token=its&from=${from}&to=${to}&q=${encodeURIComponent(text)}&sign=${sign}`;
  const header = {
    'X-Par': xPar,
    'Ver': '1.0',
  };
  const option = {
    uri: url,
    method: 'GET',
    headers: header,
  };

  try {
    const resData = await rp(option);
    const resJson = JSON.parse(base64decode(resData));
    res.json(resJson);
  } catch (err) {
    console.error(err);
    console.error('Failed calling Send API');
    res.json({
      result: 'error',
    });
  }


}

function parseZipRequest(req, res) {
  const data = req.body;
  const filenames = data.filenames;
  const mp3Dir = '/home/zxaustin/popworld-tools/public/mp3/';
  var zip = new AdmZip();
  for(let i=0;i<filenames.length;i++){
    zip.addLocalFile(mp3Dir+filenames[i]);
  }
  const zipName = new Date().getTime() + '.zip';
  zip.writeZip('/home/zxaustin/popworld-tools/public/zips/' + zipName);
  res.json({
    zip: zipName
  });
};

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) rej(err)
            else res()
        })
    })

async function googleSpeechAPI(data){
  const text = data.text;
  const usingSSML = data.ssml;
  const lang = data.lang;
  let speed = "1.0";
  if(data.speed){
    speed = data.speed;
  }
  let pitch = "0.0";
  if(data.pitch){
    pitch = data.pitch;
  }
  let voice = {
    languageCode: 'en-US',
    name: 'en-US-Wavenet-A'
  };
  let audioConfig = {
    'audioEncoding': 'MP3',
    "pitch": pitch,
    "speakingRate": speed
  }
  if(lang == 'en1'){
    voice.languageCode = 'en-US';
    voice.name = 'en-US-Wavenet-F';
  }else if(lang == 'en2'){
    voice.languageCode = 'en-US';
    voice.name = 'en-US-Wavenet-E';
  }else if(lang == 'en3'){
    voice.languageCode = 'en-US';
    voice.name = 'en-US-Wavenet-D';
  }else if(lang == 'en4'){
    voice.languageCode = 'en-US';
    voice.name = 'en-US-Wavenet-C';
  }else if(lang == 'en5'){
    voice.languageCode = 'en-US';
    voice.name = 'en-US-Wavenet-B';
  }else if(lang == 'en6'){
    voice.languageCode = 'en-US';
    voice.name = 'en-US-Wavenet-A';
  }else if(lang == 'jp'){
    voice.languageCode = 'ja-JP';
    voice.name = 'ja-JP-Standard-A';
  }else if(lang == 'jp2'){
    voice.languageCode = 'ja-JP';
    voice.name = 'ja-JP-Wavenet-A';
  }else if(lang == 'kr'){
    voice.languageCode = 'ko-KR';
    voice.name = 'ko-KR-Standard-A';
  }else if(lang == 'kr2'){
    voice.languageCode = 'ko-KR';
    voice.name = 'ko-KR-Wavenet-A';
  }
  const requestRaw = {
    voice,
    audioConfig
  };
  if(usingSSML){
    requestRaw.input = {
      ssml: text,
    };
  }else{
    requestRaw.input = {
      text: text,
    };
  }
  const url = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyCTcoFpm5EIm-V-kA0SR9uZAyr979mjGbM';
  const option = {
    uri: url,
    method: 'POST',
    followAllRedirects: true,
    maxRedirects: 100,
    json: requestRaw
  };
  try {
    const resJson = await rp(option);
    if(resJson.audioContent){
      const binAudio = new Buffer(resJson.audioContent.replace("data:audio/x-wav;",""), 'base64');
      const mp3Name = new Date().getTime() + '.mp3';
      const err = await writeFile("/home/zxaustin/popworld-tools/public/mp3/"+mp3Name, binAudio, "binary");
      if(err){
        return null;
      }
      return {mp3: mp3Name};
    }
    return resJson;
  } catch (err) {
    console.error('Failed calling Send API');
    console.error(err);
  }
  return null;
}

async function parseToGoogleTranslateAPI(req, res) {
  const data = req.body;
  const resJson = await googleTranslateAPI(data);
  if (resJson != null) {
    res.json(resJson);
  } else {
    res.json({
      status: 'error',
      reason: '?????'
    });
  }
};

async function googleTranslateAPI(opt){
  const apiUrl = 'https://translation.googleapis.com/language/translate/v2/';
  var key = 'AIzaSyCTcoFpm5EIm-V-kA0SR9uZAyr979mjGbM';
  var text = '123';
  var src = 'en';
  var target = 'zh-TW';
  if(opt.text){
    text = opt.text;
  }
  if(opt.src){
    src = opt.src;
  }
  if(opt.target){
    target = opt.target;
  }
  const realApiUrl = apiUrl + '?q=' + encodeURI(text) + '&source=' + src + '&target=' + target + '&key=' + key;
  //console.log(realApiUrl);
  const option = {
    uri: realApiUrl,
    method: 'GET',

  };
  try {
    const resJson = await rp(option);
    //console.log(resJson);
    return resJson;
  } catch (err) {
    console.error(err);
    console.error('Failed calling Send API');
  }
  return null;
}

async function googleTranslateAPIV2(opt){
  const key = 'AIzaSyCTcoFpm5EIm-V-kA0SR9uZAyr979mjGbM';
  //const key = 'ya29.c.El_XBT6hAuaVMn0fuBtpEfjjyq_TgteIIDKC05EYK2V1zBZmpXfECMSliQct7GNYULMaLFx3ab5MfFx5h4tcj-Nc2xS236vJvZAc1YvAIV_QeCLPCgbDfRbKO60Dq-I_Pg';
  const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
  var text = '123';
  var src = 'en';
  var target = 'zh-TW';
  if(opt.text){
    text = opt.text;
  }
  if(opt.src){
    src = opt.src;
  }
  if(opt.target){
    target = opt.target;
  }
  const requestRaw = {
    q: [text],
    source: src,
    target: target,
    format: 'text'
  };
  const option = {
    uri: apiUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + key,
    },
    json: requestRaw
  };
  try {
    const resJson = await rp(option);
    //console.log(resJson);
    return resJson;
  } catch (err) {
    console.error(err);
    console.error('Failed calling Send API');
  }
  return null;

}

async function googleTranslateAPIV3(opt){
  var text = '123';
  var src = 'en';
  var target = 'zh-TW';
  if(opt.text){
    text = opt.text;
  }
  if(opt.src){
    src = opt.src;
  }
  if(opt.target){
    target = opt.target;
  }
  try {
    const apiRes = await translate.translate(text, target);
    //console.log(apiRes);
    const resJson = {
      data:{
        translations: [
          {
            translatedText: apiRes[0]
          }
        ],
      }
    };
    //console.log(resJson);
    return resJson;
  } catch (err) {
    console.error(err);
    console.error('Failed calling Send API');
  }
  return null;

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

popApp.use('/maoli1', Maoli1App);
popApp.use('/maoli2', Maoli2App);
popApp.use('/iaapp', inAnalysisApp);//
popApp.use('/writes', writes2App);

popApp.use('/speech', bodyParser.json());
popApp.all('/speech', parseToGoogleSpeechAPI);
popApp.use('/translate', bodyParser.json());
popApp.all('/translate', parseToGoogleTranslateAPI);
popApp.use('/zip', bodyParser.json());
popApp.all('/zip', parseZipRequest);
popApp.use('/xfyun', bodyParser.json());
popApp.all('/xfyun', parseXfyunTranslate);

const httpServer = http.createServer(popApp);
//const httpsServer = https.createServer(credentials, mainApp);


var io = require('socket.io')(httpServer);

var gameRoom = new GameRoom();

const socket_chat = io.of('/chat');
socket_chat.on('connection', function (socket) {

  socket.on('setName', function(data){
    //設定使用者姓名
    socket.client._username = data.name;
    //送出歡迎訊息
    socket_chat.emit('helloMsg', {
      name: socket.client._username
    });
  });

  socket.on('receiveMsg', function(data){
    socket_chat.emit('msg', {
      name: socket.client._username,
      msg: data.msg,
    });
  });

  socket.on('disconnecting', function (reason) {
    socket_chat.emit('exitMsg', {
      name: socket.client._username,
    });
  });

});

const team = io.of('/team');
team.on('connection', function (socket) {
  socket.username = '';

  socket.on('setName', function (data) {
    socket.username = data.name;
    socket.client._username = data.name;
  });

  socket.on('joinTeam', function(data){
    const teamId = data.id;
    team.to(data.id).emit('memberJoined', { id: socket.id, name: socket.client._username});
    team.to(data.id).emit('receiveMsg', {
      msg: socket.client._username+' JOINED!!!',
    });

    socket.join(teamId, () => {
      let userInRoom = [];
      const tempRoom = team.to(teamId);
      for( var k in tempRoom.connected){
        const s = tempRoom.connected[k];
        if(s.client._username && s.rooms[teamId]){
          userInRoom.push({
            id: s.id,
            name: s.client._username,
          });
        }
      }
      socket.emit('memberList', { list: userInRoom});
    });
  });

  socket.on('sendMsg', function (data) {
    const teamId = data.teamId;
    const name = socket.client._username;
    const msg = data.msg;
    team.to(teamId).emit('receiveMsg', {
      msg: name+' : '+msg,
    });
  });

  socket.on('disconnecting', function (reason) {
    let rooms = Object.keys(socket.rooms);
    for(var i=0;i<rooms[i];i++){
      team.to(rooms[i]).emit('receiveMsg', {
        msg: socket.client._username+' left...',
      });
      team.to(rooms[i]).emit('memberLeft', { id: socket.id, name: socket.client._username});
    }
  });
});

httpServer.listen(8080);
//httpsServer.listen(8443);

//module.exports = popApp;
