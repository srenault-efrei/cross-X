"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeKeyFasterUser = exports.saveGame = exports.fasterUser = exports.removeUser = exports.getCurrentUser = exports.getOpponent = exports.getRandomArbitrary = exports.display = exports.isNull = exports.isNotNull = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var fs = require('fs');

/**
 * @function isNotNull
 * @description check if all args are not null
 *
 * @param {unknown[]} values - any arguments to checks
 * @return {boolean}
 *
 * @example
 * isNotNull(x, y, z, process.env.PORT)
 *
 */
var isNotNull = function isNotNull() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  for (var _i = 0, _values = values; _i < _values.length; _i++) {
    var v = _values[_i];

    if (v === undefined || v === null) {
      return false;
    }
  }

  return true;
};
/**
 * @function isNull
 * @description check if all args are null
 *
 * @param {unknown[]} values - any arguments to checks
 * @return {boolean}
 *
 * @example
 * isNull(x, y, z, process.env.PORT)
 *
 */


exports.isNotNull = isNotNull;

var isNull = function isNull() {
  return !isNotNull.apply(void 0, arguments);
};
/**
 * @function display
 * @description display on output with time
 *
 * @param {string} str - data to display
 * @return {void}
 *
 * @example
 * display("Il a pas dit bonjour")
 *
 */


exports.isNull = isNull;

var display = function display(str) {
  return console.log("[".concat((0, _moment["default"])(), "] ").concat(str));
};
/**
 * @function getRandomArbitrary
 * @description return a random number 
 *
 * @param {number} min  - minimal number
 * @param {number} max  - maximal number
 * @return {number}
 *
 * @example
 * getRandomArbitrary(0,1337)
 *
 */


exports.display = display;

var getRandomArbitrary = function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * Math.floor(max - min) + min);
};
/**
 * @function getOpponent
 * @description return the opponent of the game 
 *
 * @param {string} id - socketId of the currentUser
 * @param {Array<User>} users - table with game users
 * @return {user}
 *
 * @example
 * getOpponent('12121', [{id:12121, name:Steven, points: 0 ,fasterUser: false},{id:333232Dss, name: heliote, points: 0,fasterUser: false}])
 *
 */


exports.getRandomArbitrary = getRandomArbitrary;

var getOpponent = function getOpponent(id, users) {
  var _iterator = _createForOfIteratorHelper(users),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var user = _step.value;

      if (user.id !== id) {
        return user;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
/**
 * @function getCurrentUser
 * @description return the current User 
 *
 * @param {string} id - socketId of the currentUser
 * @param {Array<User>} users - table with game users
 * @return {user}
 *
 * @example
 * getCurrentUser('333232Dss', [{id:12121, name:Steven, points: 0, fasterUser: false},{id:333232Dss, name: heliote, points: 0 ,fasterUser: false}])
 *
 */


exports.getOpponent = getOpponent;

var getCurrentUser = function getCurrentUser(id, users) {
  var _iterator2 = _createForOfIteratorHelper(users),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var user = _step2.value;

      if (user.id === id) {
        return user;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
};
/**
 * @function removeUser
 * @description remove the user of the game table
 *
 * @param {string} id - socketId of the user u want remove
 * @param {Array<User>} users - table with game users
 * @return {Array<User>}
 *
 * @example
 * removeUser('333232Dss', [{id:12121, name:Steven, points: 0 ,fasterUser: false},{id:333232Dss, name: heliote, points: 0 ,fasterUser: false}])
 *
 */


exports.getCurrentUser = getCurrentUser;

var removeUser = function removeUser(id, users) {
  var result = [];

  var _iterator3 = _createForOfIteratorHelper(users),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var user = _step3.value;

      if (user.id !== id) {
        result.push(user);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return result;
};
/**
 * @function fasterUser
 * @description define the fastest user
 *
 * @param {User} currentUser - the currentUser of the game
 * @param {User} opponent - the opponent of the game
 * @return {User}
 *
 * @example
 * fasterUser({id:12121, name:Steven, points: 0 ,fasterUser: false}, {id:333232Dss, name: heliote, points: 0 ,fasterUser: false})
 *
 */


exports.removeUser = removeUser;

var fasterUser = function fasterUser(currentUser, opponent) {
  var result = {};

  if (currentUser.fasterUser === true && opponent.fasterUser === false) {
    result = currentUser;
  } else if (opponent.fasterUser === true && currentUser.fasterUser === false) {
    result = opponent;
  }

  return result;
};

exports.fasterUser = fasterUser;
var data = {};
var tabQuickWord = [];
var tabMagicNumber = [];
/**
 * @function saveGame
 * @description save the data of each game
 *
 * @param {string} game - the current game
 * @param { Array<User>} users - table of players
 * @param {Date} beginDate - begin date of the game 
 * @param {Date} endDate - end date of the game

 * @return {void}
 *
 * @example
 * saveGame('QuickWord', [{id:12121, name:Steven, points: 0 ,fasterUser: false},{id:333232Dss, name: heliote, points: 0 ,fasterUser: false}],
 *  2020-09-11T03:27:53.697Z, 2020-09-11T03:28:57.095Z)
 *
 */

var saveGame = function saveGame(game, users, beginDate, endDate) {
  var newFile = "game.json";
  var objectGame = {};
  objectGame["beg"] = beginDate;
  objectGame["end"] = endDate;
  objectGame["players"] = users;

  if (game === 'QuickWord') {
    tabQuickWord.push(objectGame);
    data[game] = tabQuickWord;
  } else {
    tabMagicNumber.push(objectGame);
    data[game] = tabMagicNumber;
  }

  var dataStringify = JSON.stringify(data, null, 4);
  fs.writeFile(newFile, dataStringify, function (err) {
    if (err) throw err;
  });
  display(_chalk["default"].green('File `' + newFile + '` has been successfully created'));
};
/**
 * @function removeKeyFasterUser
 * @description remove the properties fasterUser in the table of players
 *
 * @param {Array<User>} users - table of players
 * @param {User} opponent - the opponent of the game
 * @return {Array<User>}
 *
 * @example
 * removeKeyFasterUser({id:12121, name:Steven, points: 0 ,fasterUser: false}, {id:333232Dss, name: heliote, points: 0 ,fasterUser: false})
 *
 */


exports.saveGame = saveGame;

var removeKeyFasterUser = function removeKeyFasterUser(users) {
  var _iterator4 = _createForOfIteratorHelper(users),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var user = _step4.value;
      delete user.fasterUser;
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return users;
};

exports.removeKeyFasterUser = removeKeyFasterUser;