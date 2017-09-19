const http = require('http');
const express = require('express');
const app = express();
const db = new lokijs('example.db');
const routes = require('./routes');


app.set('view engine', 'pug');
app.use(routes);

http
  .createServer(app)
  .listen(3000);
