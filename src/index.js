const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const http      = require('http');

require('dotenv').config();

const { setupWebsocket } = require('./websocket');

const app     = express();
const server  = http.Server(app);

setupWebsocket(server);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser     : true,
  useUnifiedTopology  : true,
  useFindAndModify    : false,
  useCreateIndex      : true
});

app.use(cors());
app.use(express.json());
app.use(require('./routes'));

server.listen(3333);
