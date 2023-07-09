require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
async function connect() {
  return await mongoose.connect(process.env.CONNECTION_STRING, { writeConcern: { wtimeout: 30000 } });
}
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// Session
const sessionOptions = session({
  secret: 'sabao em po',
  store: new MongoStore({ mongoUrl: process.env.CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

module.exports = {
  connect,
  flash,
  sessionOptions,
};