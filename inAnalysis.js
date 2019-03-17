const express = require('express');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const config = require('config');
const formidable = require('formidable');
const fs = require('fs');
const pg=require('pg');
const iaapp = express();


var data1="123abca"

iaapp.set('view engine', 'ejs');

const pg_config = {
    host: '140.112.26.237',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'root',
    password: 'lab125a',
    database: 'DB',
    port: 5432
};


function dbConnection(){
  var data="";
  const client = new pg.Client(pg_config);
  client.connect(err => {
    if (err) throw err;
    else {
      console.log(`Running query to PostgreSQL server: ${pg_config.host}`);
      const query = 'SELECT * FROM "user";';

      client.query(query)

          .then(res => {
              const rows = res.rows;
              rows.map(row => {
                  // data.user_index=row['user_index'];
                  // data.id=row['id'];
                  data=row['name'];  //data can not pass out a function
                  // data.email=row['email'];
                  // data.password=row['password'];
                  // data.role=row['roles']
                  console.log(`Read: ${JSON.stringify(row)}`);
                  return data;




              });

              // process.exit();
          })
          .catch(err => {
              console.log(err);
          });
  }
  });
  return data;
}








// function queryDatabase() {




//    return data;
// }




function getWebAttrs(){
  const webAttrs = {};
  webAttrs.webroot = config.get('iaappRoot');
  // webAttrs.backroot = config.get('backroot');
  webAttrs.webtitle = config.get('webtitle');


  return webAttrs;
}

function commonRoute(ejsName, req, res, optionData) {

  var webAttrs = getWebAttrs();
  webAttrs.data = dbConnection();

  if (optionData) {
    webAttrs = optionData;
  }
  res.render(ejsName,
    {webAttrs}
  );
}

function parsingIndex(req, res ) {
  commonRoute('iaapp/index.ejs', req, res);
}

function parsingLogin(req, res) {
  commonRoute('iaapp/login.ejs', req, res);
}

function parsingSignup(req, res) {
  commonRoute('iaapp/signup.ejs', req, res);
}

function parsingProjectManagement(req, res) {
  commonRoute('iaapp/projectManagement.ejs', req, res);
}

function parsingApiManagement(req, res) {
  commonRoute('iaapp/apiManagement.ejs', req, res);
}

function parsingDocument(req, res) {
  commonRoute('iaapp/document.ejs', req, res);
}

function parsingProject(req, res) {
  commonRoute('iaapp/project.ejs', req, res);
}

iaapp.use('/', express.static('public/iaapp'));
iaapp.get('/', parsingIndex);
iaapp.get('/login', parsingLogin);
iaapp.get('/signup', parsingSignup);
iaapp.get('/dashboard', parsingProjectManagement);
iaapp.get('/api-management', parsingApiManagement);
iaapp.get('/docs', parsingDocument);
iaapp.get('/project/:id', parsingProject);

module.exports = iaapp;
