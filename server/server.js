'use strict';

const express = require("express");
const path = require('path');
const fs = require('fs');
const opn = require('open');
const {google} = require('googleapis');
const xmlParser = require('xml2json');

const app = express();
const port = 3000;

const REFRESH_KEY_FILE = "refreshKeys.json"
const OAUTH2_KEY_FILE = "googleOauth2Keys.json"

let _oauth2Client = undefined;
let _refreshKey = undefined;

const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));

app.get("/checkgoogleauth", (req, res) => {
  let msg = {};
  let client = getOauth2Client();
  if (!client) {
    msg.error = "Key file not found.";
    res.json(msg);
    return;
  }

  let refreshKey = getRefreshKey();
  if (!refreshKey) {
    msg.needauth = true;
    res.json(msg);

    authenticate(client);
  } else {
    msg.ok = true;
    res.json(msg);
  }
});

app.get("/googleevents", (req, res) => {
  let err = {};
  let calId = req.query.id;

  if (!calId || calId.length <= 0) {
    err.error = "Wrong Calendar ID.";
    res.json(err);
    return;
  }

  let client = getOauth2Client();
  if (!client) {
    err.error = "Key file not found.";
    res.json(err);
    return;
  }

  let refreshKey = getRefreshKey();
  if (!refreshKey) {
    err.needauth = true;
    res.json(err);
    return;
  } else {
    client.setCredentials({
      refresh_token: refreshKey
    });

    const calendar = google.calendar('v3');

    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let mindate = date.toISOString();
    date.setMonth(date.getMonth() + 2);
    let maxdate = date.toISOString();

    calendar.events.list({calendarId:encodeURI(calId), timeMin:mindate, timeMax:maxdate}).then(calres => {
      res.json(calres.data);
      console.log("get:", calres.data.summary);
    })
  }
});

app.get("/goauth2callback", (req, res) => {
  const code = req.param("code");

  let oauth2Client = getOauth2Client();
  if (!oauth2Client) {
    res.end("Authentication failed. try again later.");
    return;
  }
  
  oauth2Client.getToken(code).then((tokenrslt) => {
    oauth2Client.credentials = tokenrslt.tokens;
    
    res.end("Authentication successful! Close this page.");

    let keydata = {
      refresh_token : tokenrslt.tokens.refresh_token,
    };

    const rkeyPath = path.join(__dirname, REFRESH_KEY_FILE);
    const keyjson = JSON.stringify(keydata);
    fs.writeFileSync(rkeyPath, keyjson);  
  });
});

app.get("/news", (req, res) => {
  fetch("https://news.sbs.co.kr/news/sitemapRSS.do", {
    mode: "no-cors",
  })
  .then((response) => response.text())
  .then((str) => xmlParser.toJson(str))
  .then((data) => {
    var json = JSON.parse(data);
    
    let rslts = [];
    json.rss.channel.item.forEach(item => {
      rslts.push({title:item.title});
    });

    res.json(rslts);
  });
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});

function authenticate(oauth2Client) {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: 'consent',
  });
  opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
}

function getOauth2Client() {
  if (_oauth2Client) return _oauth2Client;

  const keyPath = path.join(__dirname, OAUTH2_KEY_FILE);
  let keys = undefined;
  if (fs.existsSync(keyPath)) {
    keys = require(keyPath);
  
    _oauth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      keys.redirect_uris,
    );

    google.options({auth: _oauth2Client});

    return _oauth2Client;
  }
  
  return undefined;
}

function getRefreshKey() {
  if (_refreshKey && _refreshKey.length > 0) return _refreshKey;

  const rkeyPath = path.join(__dirname, REFRESH_KEY_FILE);
  if (fs.existsSync(rkeyPath)) {
    let refreshKey = require(rkeyPath);
    _refreshKey = refreshKey.refresh_token;
  }
  
  return _refreshKey;
}
