"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fasterUser = exports.removeUser = exports.getCurrentUser = exports.getOpponent = exports.getRandomArbitrary = exports.display = exports.isNull = exports.isNotNull = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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