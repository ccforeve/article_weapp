"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('vendor.js')(0));

var _core = _interopRequireDefault(require('vendor.js')(2));

require('vendor.js')(1);

var _api = _interopRequireDefault(require('utils/api.js'));

var _request = _interopRequireDefault(require('utils/request.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].app({
  data: {
    has_user: false
  },
  globalData: {
    userInfo: null
  },
  constructor: function constructor() {
    this.use('requestfix');
    this.use('promisify');
  },
  onLaunch: function () {
    var _onLaunch = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee() {
      var login, user;
      return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _api["default"].login();

            case 2:
              login = _context.sent;
              _context.next = 5;
              return _request["default"].request('miniprogram/user/login?code=' + login.code);

            case 5:
              user = _context.sent;

              if (user.code === 401) {
                this.getUser(user.session_key);
                wx.setStorageSync('session_key', user.session_key);
              } else {
                // 缓存用户id
                wx.setStorageSync('user_id', user.user_id);
              }

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLaunch() {
      return _onLaunch.apply(this, arguments);
    }

    return onLaunch;
  }(),
  methods: {
    getUser: function () {
      var _getUser = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime2["default"].mark(function _callee2(session) {
        var _wx;

        return _regeneratorRuntime2["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _wx = wx;
                wx.getUserInfo({
                  withCredentials: true,
                  success: function success(res) {
                    var user = res;
                    user.session_key = session; // 接下来写业务代码

                    var options = {
                      url: 'miniprogram/user/check_user',
                      data: user
                    };

                    _request["default"].request(options).then(function (res) {
                      if (res.code === 200) {
                        // 缓存用户id
                        _wx.setStorageSync('user_id', res.user_id);
                      }
                    });
                  },
                  fail: function fail(res) {
                    wx.showModal({
                      title: '警告',
                      content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                      showCancel: false,
                      success: function success(res) {
                        if (res.confirm) {
                          wx.navigateTo({
                            url: '/pages/toLogin'
                          });
                        }
                      }
                    });
                  }
                });

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getUser(_x) {
        return _getUser.apply(this, arguments);
      }

      return getUser;
    }()
  }
}, {a: 1}, {a: 1}, {a: 1}, {a: 1}, {a: 1}, {a: 1}, {a: 1}, {a: 1});