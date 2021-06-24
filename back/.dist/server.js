"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _chalk = _interopRequireDefault(require("chalk"));

var _socket = _interopRequireDefault(require("socket.io"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var port = parseInt(process.env.PORT);
var app = (0, _express["default"])(); // app.use(express.static(path.join(__dirname, "../public")));

var server = app.listen(port, function () {
  (0, _utils.display)(_chalk["default"].magenta("cross X  server is running on 0.0.0.0:".concat(port)));
});
var socketio = (0, _socket["default"])(server);
socketio.on('connection', function (client) {
  // display(chalk.cyan(`Connection opened for ( ${client.id} )`))
  client.on('join_room', function (data) {
    client.join(data);
    console.log('join room ' + data);
  });
  client.on('quit_room', function (data) {
    client.leave(data);
  });
  client.on('send_message', function (data) {
    client.to(data.room).emit('receive_message', data);
  });
  client.on('start_call', function (data) {});
  client.on('disconnect', function () {
    (0, _utils.display)(_chalk["default"].cyan("Connection closed for ( ".concat(client.id, " )")));
  });
});