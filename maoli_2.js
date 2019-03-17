const express = require('express');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const config = require('config');
const formidable = require('formidable');
const fs = require('fs');

const maoliApp = express();

maoliApp.set('view engine', 'ejs');

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

function parsingIndex(req, res) {
  commonRoute('maoli2/index.ejs', req, res);
}

function parsingNews(req, res) {
  commonRoute('maoli2/news.ejs', req, res);
}

function parsingNewsContent(req, res) {
  commonRoute('maoli2/newsContent.ejs', req, res);
}

function parsingBunka(req, res) {
  commonRoute('maoli2/bunka.ejs', req, res);
}

function parsingMedia(req, res) {
  commonRoute('maoli2/media.ejs', req, res);
}

function parsingMediaContent(req, res) {
  commonRoute('maoli2/mediaContent.ejs', req, res);
}

function parsingInternation(req, res) {
  commonRoute('maoli2/internation.ejs', req, res);
}

function parsingTravelInfo(req, res) {
  commonRoute('maoli2/travelInfo.ejs', req, res);
}

function parsingTravelContent(req, res) {
  commonRoute('maoli2/travelContent.ejs', req, res);
}

function parsingTravelBus(req, res) {
  commonRoute('maoli2/travelBus.ejs', req, res);
}

function parsingTravelLinks(req, res) {
  commonRoute('maoli2/travelLinks.ejs', req, res);
}

maoliApp.use('/', express.static('public/maoli2'));
maoliApp.get('/', parsingIndex);
maoliApp.get('/news', parsingNews);
maoliApp.get('/newsContent', parsingNewsContent);
maoliApp.get('/bunka', parsingBunka);
maoliApp.get('/media', parsingMedia);
maoliApp.get('/mediaContent', parsingMediaContent);
maoliApp.get('/internation', parsingInternation);
maoliApp.get('/travelInfo', parsingTravelInfo);
maoliApp.get('/travelContent', parsingTravelContent);
maoliApp.get('/travelBus', parsingTravelBus);
maoliApp.get('/travelLinks', parsingTravelLinks);

module.exports = maoliApp;
