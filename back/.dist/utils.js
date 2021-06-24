"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.display = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var display = function display(str) {
  return console.log("[".concat((0, _moment["default"])(), "] ").concat(str));
};

exports.display = display;