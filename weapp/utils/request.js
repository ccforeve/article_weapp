"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(0));

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
  _regeneratorRuntime2["default"].mark(function _callee(options) {
    var showLoading,
        response,
        _args = arguments;
    return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            showLoading = _args.length > 1 && _args[1] !== undefined ? _args[1] : true;

            if (typeof options === 'string') {
              options = {
                url: options
              };
            } // 显示加载中


            if (showLoading) {
              wx.showLoading({
                title: '加载中'
              });
            }

            options.url = host + options.url; // 调用小程序的 request 方法

            _context.next = 6;
            return _api["default"].request(options);

          case 6:
            response = _context.sent;

            if (showLoading) {
              // 隐藏加载中
              wx.hideLoading();
            } // 服务器异常后给与提示


            if (response.statusCode === 500) {
              wx.showModal({
                title: '提示',
                content: '服务器错误，请联系管理员或重试'
              });
            }

            return _context.abrupt("return", response.data);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function request(_x) {
    return _ref.apply(this, arguments);
  };
}(); // 刷新token


var refreshToken =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime2["default"].mark(function _callee2(accessToken) {
    var options, refreshResponse;
    return _regeneratorRuntime2["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = {
              url: host + 'authorizations/current',
              method: 'PUT',
              header: {
                'Authorization': accessToken
              }
            };
            _context2.next = 3;
            return _api["default"].request(options);

          case 3:
            refreshResponse = _context2.sent;
            // 将 Token 及过期时间保存在 storage 中
            wx.setStorageSync('access_token', refreshResponse.data.access_token);
            wx.setStorageSync('access_token_expired_at', new Date().getTime() + refreshResponse.data.expires_in * 1000);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function refreshToken(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  request: request,
  refreshToken: refreshToken
};
exports["default"] = _default;