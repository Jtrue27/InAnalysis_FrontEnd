const express = require('express');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const config = require('config');
const formidable = require('formidable');
const fs = require('fs');

const writesApp = express();

writesApp.set('view engine', 'ejs');

function getWebAttrs(){
  const webAttrs = {};
  // webAttrs.webroot = config.get('webroot');
  // webAttrs.backroot = config.get('backroot');
  // webAttrs.webtitle = config.get('webtitle');
  return webAttrs;
}

function commonRoute(ejsName, req, res, optionData) {
  const webAttrs = getWebAttrs();
  if (optionData) {
    webAttrs.data = optionData;
  }
  res.render(ejsName, {
    webAttrs
  });
}

async function callSearchApi(req, res) {
  try {
    const data = req.body;
    const capOpt = {
      uri: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'POST',
      form: {
        'secret': '6Lf1MXYUAAAAAPBEbFVA02CWt-PEUsPOiv0NZYuN',
        'response': data.captcha_token,
      },
    };

    var capRes = await rp(capOpt);
    capRes = JSON.parse(capRes);
    if(!capRes.success){
      throw new Error('recaptcha failed!');
    }

    const option = {
      uri: 'https://chatbot.chulifelogger.tw/v1/wechat/callback',
      method: 'POST',
      followAllRedirects: true,
      maxRedirects: 100,
      json: data
    };

    const resJson = await rp(option);
    res.json(resJson);
  } catch (err) {
    res.json({
      status: 'error'
    });
    console.error('Failed calling Send API');
    console.error(err);
  }
};

function parsingIndex(req, res) {
  commonRoute('writes/index.ejs', req, res);
}


writesApp.use('/', express.static('public/writesApp'));
writesApp.get('/', parsingIndex);

writesApp.use('/search', bodyParser.json());
writesApp.all('/search', callSearchApi);

module.exports = writesApp;
