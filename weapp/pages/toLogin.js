"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(1));

var _core = _interopRequireDefault(require('../vendor.js')(2));

var _request = _interopRequireDefault(require('../utils/request.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].page({
  methods: {
    bindGetUserInfo: function () {
      var _bindGetUserInfo = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime2["default"].mark(function _callee(e) {
        var user;
        return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                user = e.$wx.detail;
                console.log(user);
                user.session_key = wx.getStorageSync('session_key'); // 接下来写业务代码

                _context.prev = 3;
                _context.next = 6;
                return _request["default"].request('miniprogram/user/check_user', 'get', user);

              case 6:
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](3);
                wx.showModal({
                  title: '提示',
                  content: '服务器错误，请联系管理员'
                });

              case 11:
                // 最后，记得返回刚才的页面
                wx.navigateBack();

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 8]]);
      }));

      function bindGetUserInfo(_x) {
        return _bindGetUserInfo.apply(this, arguments);
      }

      return bindGetUserInfo;
    }()
  }
}, {info: {"components":{},"on":{}}, handlers: {'14-0': {"getuserinfo": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.bindGetUserInfo($event)
      })();
    
  }}}, models: {} }, {info: {"components":{},"on":{}}, handlers: {'14-0': {"getuserinfo": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.bindGetUserInfo($event)
      })();
    
  }}}, models: {} });