const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
let io = require('socket.io')(server);


const port = 8889;

const staticFolder = '/www';

app.use(cors());
//app.use(express.static('www'));
app.use(staticFolder, express.static(path.join(__dirname, staticFolder)));
app.use("/js", express.static(__dirname + "/www/js"))
app.use("/img", express.static(__dirname + "/www/img"))
app.use("/css", express.static(__dirname + "/www/css"))
app.use("/fonts", express.static(__dirname + "/www/fonts"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

let games = [];

io.on('connection', function (socket) {
  io.emit('update_games', JSON.stringify(games))
  console.log('smb connected!');
});

server.listen(port, () => {
  console.log(`We are live on ${port}`);
});

app.get('/', (req, res) => {
  console.log('check /');
  res.sendFile("index.html", { root: path.join(__dirname, staticFolder) })
})

app.post('/create_game', cors(), (req, res) => {
  console.log('check /create_game');
  const username = req.body["username"];
  let havegame = false;
  for (g in games) {
    if (games[g]["creator"] == username) {
      havegame = true;
      break;
    }
  }
  if (!havegame) {
    games.push({ 'creator': username, 'time': new Date().getTime() });
  }
  console.log(games);
  io.emit('update_games', JSON.stringify(games));
  res.send({ 'status': !havegame });
})

app.get('*', function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, staticFolder) })
});
