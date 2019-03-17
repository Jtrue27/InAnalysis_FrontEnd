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
  commonRoute('maoli1/index.ejs', req, res);
}

function parsingIntro(req, res) {
  commonRoute('maoli1/intro.ejs', req, res);
}

function parsingNews(req, res) {
  commonRoute('maoli1/news.ejs', req, res);
}

function parsingNewsContent(req, res) {
  commonRoute('maoli1/newsContent.ejs', req, res);
}

function parsingOsususme(req, res) {
  commonRoute('maoli1/osusume.ejs', req, res);
}

function parsingFeedback(req, res) {
  commonRoute('maoli1/feedback.ejs', req, res);
}

function parsingSearch(req, res) {
  commonRoute('maoli1/search.ejs', req, res);
}

function parsingSearchResult(req, res) {
  commonRoute('maoli1/searchResult.ejs', req, res);
}

maoliApp.use('/', express.static('public/maoli1'));
maoliApp.get('/', parsingIndex);
maoliApp.get('/intro', parsingIntro);
maoliApp.get('/news', parsingNews);
maoliApp.get('/newsContent', parsingNewsContent);
maoliApp.get('/osusume', parsingOsususme);
maoliApp.get('/feedback', parsingFeedback);
maoliApp.get('/search', parsingSearch);
maoliApp.get('/searchResult', parsingSearchResult);

module.exports = maoliApp;
