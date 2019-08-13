"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(1));

var _api = _interopRequireDefault(require('api.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var host = 'https://stl.yxcxin.com/api/';

var request =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime2["default"].mark(function _callee(url) {
    var method,
        data,
        showLoading,
        optionUrl,
        response,
        _args = arguments;
    return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            method = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'get';
            data = _args.length > 2 && _args[2] !== undefined ? _args[2] : [];
            showLoading = _args.length > 3 && _args[3] !== undefined ? _args[3] : true;
            optionUrl = host + url; // 显示加载中

            if (showLoading) {
              wx.showLoading({
                title: '加载中'
              });
            } // 调用小程序的 request 方法


            _context.next = 7;
            return _api["default"].request(method, optionUrl, data);

          case 7:
            response = _context.sent;

            if (showLoading) {
              // 隐藏加载中
              wx.hideLoading();
            } // 服务器异常后给与提示


            if (response.statusCode === 500) {
              wx.showModal({
                title: '提示',
                content: '服务器错误，请联系管理员或重试'
              }); // return false
            }

            return _context.abrupt("return", response.data);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function request(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = {
  request: request
};
exports["default"] = _default;