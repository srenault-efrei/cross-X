"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _chalk = _interopRequireDefault(require("chalk"));

var _socket = _interopRequireDefault(require("socket.io"));

var _randomWords = _interopRequireDefault(require("random-words"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// prelude -- loading environment variable
_dotenv["default"].config();

if ((0, _utils.isNull)(process.env.PORT)) {
  throw 'Sorry missing PORT env';
}

var port = parseInt(process.env.PORT);
var app = (0, _express["default"])();
var randomNumber = (0, _utils.getRandomArbitrary)(0, 1337);
var myRandomWord = (0, _randomWords["default"])(); // let dateSendName: any = new Date()

var server = app.listen(port, function () {
  (0, _utils.display)(_chalk["default"].magenta("crossPWAGame server is running on 0.0.0.0:".concat(port)));
});
var socketio = (0, _socket["default"])(server);
var users = [];
var round = 1;
socketio.on('connection', function (socket) {
  console.log(randomNumber);
  console.log(myRandomWord);
  round = 1; // CURRENT SOCKET/PLAYER

  (0, _utils.display)(_chalk["default"].cyan("Connection opened for ( ".concat(socket.id, " )")));
  socket.on('disconnect', function () {
    // if (users[0].nickname !== undefined) {
    //   let currentUser = getUser(socket.id, users)
    //   console.log(currentUser)
    //   display(chalk.yellow(`Goodbye ${currentUser.nickname}`))
    // }
    users = (0, _utils.removeUser)(socket.id, users);
    myRandomWord = (0, _randomWords["default"])();
    (0, _utils.display)(_chalk["default"].cyan("Connection closed for ( ".concat(socket.id, " )")));
  });
  socket.on('game::sendNickname', function (payload) {
    var user = JSON.parse(payload);
    var nickname = user.nickname;
    (0, _utils.display)(_chalk["default"].yellow("Here comes a new challenger : ".concat(nickname, " ( from ").concat(socket.id, " )")));
    users.push({
      id: socket.id,
      nickname: nickname,
      points: 0,
      fasterUser: false
    });
    console.log(users); // dateSendName = new Date()
    // console.log(dateSendName)

    socket.emit('game::start', {
      howManyPlayers: users.length
    });
  });
  socket.on('magicNumber::sendScore', function (payload) {
    var currentUser = (0, _utils.getCurrentUser)(socket.id, users);
    var position = "less";
    var data = JSON.parse(payload);
    var score = data.score;
    (0, _utils.display)(_chalk["default"].green("".concat(currentUser.nickname, " indicate the number : ").concat(score)));

    if (parseInt(score) < randomNumber) {
      (0, _utils.display)(_chalk["default"].red("".concat(currentUser.nickname, " it's more")));
      position = "more";
    } else if (parseInt(score) > randomNumber) {
      (0, _utils.display)(_chalk["default"].red("".concat(currentUser.nickname, " it's less")));
    } else if (parseInt(score) === randomNumber) {
      (0, _utils.display)(_chalk["default"].green("".concat(currentUser.nickname, " u find the good score")));
      position = "equal";
      users = (0, _utils.removeUser)(socket.id, users);
      currentUser["points"] = currentUser["points"] + 1;
      round++;
      users.push(currentUser);
      randomNumber = (0, _utils.getRandomArbitrary)(0, 1337);
      console.log(users);
      console.log(randomNumber);
    }

    socket.emit('magicNumber::resume', {
      position: position,
      currentUser: currentUser,
      users: users,
      round: round
    });
  });
  socket.on('QuickWord::randomWord', function (playload) {
    var points = (0, _utils.getCurrentUser)(socket.id, users).points;
    socket.emit('Quickword::word', {
      myRandomWord: myRandomWord,
      round: round,
      points: points
    });
  });
  socket.on('QuickWord::sendWord', function (payload) {
    var currentUser = (0, _utils.getCurrentUser)(socket.id, users);
    var message = 'found';
    var data = JSON.parse(payload);
    var word = data.word; // let dateSendWord: any = new Date()
    // let diff: Diff = dateDiff(dateSendName,dateSendWord)

    var winner = {};
    var opponent = (0, _utils.getOpponent)(socket.id, users); // console.log(opponent)

    if (word === myRandomWord) {
      users = (0, _utils.removeUser)(socket.id, users);

      if (opponent.fasterUser !== true) {
        currentUser["fasterUser"] = true;
      }

      users.push(currentUser);
      winner = (0, _utils.fasterUser)(currentUser, opponent); // console.log(winner)

      console.log("winner");
      console.log(winner);

      if (winner.id === currentUser.id) {
        (0, _utils.display)(_chalk["default"].green("".concat(winner.nickname, " u found the word the fastest ")));
        myRandomWord = (0, _randomWords["default"])();
        users = (0, _utils.removeUser)(socket.id, users);
        currentUser["points"] = currentUser["points"] + 3;
        users.push(currentUser);
        console.log(users);
        console.log(myRandomWord);
        users = (0, _utils.removeUser)(socket.id, users);
        currentUser["fasterUser"] = false;
        users.push(currentUser);
        console.log(users);
        message = 'faster';
        round++;
        console.log(round);
      }
    } else if (word !== myRandomWord) {
      (0, _utils.display)(_chalk["default"].red("".concat(word, " it's not the good word")));
      message = 'not found';
    }

    socket.emit('QuickWord::resume', {
      message: message,
      currentUser: currentUser,
      users: users,
      // winner,
      round: round,
      myRandomWord: myRandomWord
    });
  });
});