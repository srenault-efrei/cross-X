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
var myRandomWord = (0, _randomWords["default"])();
var server = app.listen(port, function () {
  (0, _utils.display)(_chalk["default"].magenta("crossPWAGame server is running on 0.0.0.0:".concat(port)));
});
var socketio = (0, _socket["default"])(server);
var users = [];
var round = 1;
var beginDate;
var endDate;
socketio.on('connection', function (socket) {
  (0, _utils.display)(_chalk["default"].blue("le nombre al\xE9atoire est : ".concat(randomNumber, "\n")));
  (0, _utils.display)(_chalk["default"].blue("le mot al\xE9atoire est : ".concat(myRandomWord, "\n")));
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
  }); // ADD NEW USER WITH NAME

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
    console.log(users);

    if (users.length === 2) {
      beginDate = new Date();
    } // socket.emit('game::start', {
    //   howManyPlayers: users.length,
    // })

  }); // socket.on('game::howManyPlayers', playload => {
  //   let currentUser = getCurrentUser(socket.id, users)
  //   socket.emit('game::players', {
  //     users,
  //     currentUser,
  //     players: users.length
  //   })
  // })
  //  MAGICNUMBER SENDSCORE

  socket.on('magicNumber::sendScore', function (payload) {
    var currentUser = (0, _utils.getCurrentUser)(socket.id, users);
    var opponent = (0, _utils.getOpponent)(socket.id, users);
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
      (0, _utils.display)(_chalk["default"].blue("le nombre al\xE9atoire est : ".concat(randomNumber, "\n")));
    } else if (score === '' || typeof score === 'string') {
      position = "notNumber";
    }

    if (currentUser.points === 3 || opponent.points === 3) {
      endDate = new Date();
      (0, _utils.saveGame)("magicNumber", (0, _utils.removeKeyFasterUser)(users), beginDate, endDate);
    }

    socket.emit('magicNumber::resume', {
      position: position,
      currentUser: currentUser,
      users: users,
      round: round
    });
  }); // EVENT RANDOM WORD

  socket.on('QuickWord::randomWord', function (playload) {
    socket.emit('Quickword::word', {
      myRandomWord: myRandomWord
    });
  }); // QUICKWORD SENDWORD

  socket.on('QuickWord::sendWord', function (payload) {
    var currentUser = (0, _utils.getCurrentUser)(socket.id, users);
    var message = 'found';
    var data = JSON.parse(payload);
    var word = data.word;
    var winner = {};
    var opponent = (0, _utils.getOpponent)(socket.id, users);

    if (word === myRandomWord) {
      users = (0, _utils.removeUser)(socket.id, users);

      if (opponent.fasterUser !== true) {
        currentUser["fasterUser"] = true;
      }

      users.push(currentUser);
      winner = (0, _utils.fasterUser)(currentUser, opponent);

      if (winner.id === currentUser.id) {
        (0, _utils.display)(_chalk["default"].green("".concat(winner.nickname, " u found the word the fastest ")));
        myRandomWord = (0, _randomWords["default"])();
        users = (0, _utils.removeUser)(socket.id, users);
        currentUser["points"] = currentUser["points"] + 3;
        users.push(currentUser);
        console.log(users);
        (0, _utils.display)(_chalk["default"].blue("le mot al\xE9atoire est : ".concat(myRandomWord, "\n")));
        users = (0, _utils.removeUser)(socket.id, users);
        currentUser["fasterUser"] = false;
        users.push(currentUser);
        message = 'faster';
        round++;
      }
    } else if (word !== myRandomWord) {
      (0, _utils.display)(_chalk["default"].red("".concat(word, " it's not the good word")));
      message = 'not found';
    }

    if (currentUser.points === 15 || opponent.points === 15) {
      endDate = new Date();
      (0, _utils.saveGame)("QuickWord", (0, _utils.removeKeyFasterUser)(users), beginDate, endDate);
    }

    socket.emit('QuickWord::resume', {
      message: message,
      currentUser: currentUser,
      users: users,
      round: round,
      myRandomWord: myRandomWord
    });
  });
});