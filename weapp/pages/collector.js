"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(0));

var _core = _interopRequireDefault(require('../vendor.js')(2));

var _request = _interopRequireDefault(require('../utils/request.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].page({
  data: {
    collectors: {}
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee(options) {
      var userId;
      return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              userId = wx.getStorageSync('user_id');

              if (userId) {
                _context.next = 5;
                break;
              }

              wx.showToast({
                title: '未授权登录',
                icon: 'none'
              });
              wx.navigateTo({
                url: '/pages/toLogin'
              });
              return _context.abrupt("return", false);

            case 5:
              if (!wx.getStorageSync('Authorize')) {
                _context.next = 8;
                break;
              }

              _context.next = 8;
              return this.getCollections();

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLoad(_x) {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  methods: {
    getCollections: function () {
      var _getCollections = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime2["default"].mark(function _callee2() {
        var collectorList;
        return _regeneratorRuntime2["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _request["default"].request('collector');

              case 2:
                collectorList = _context2.sent;
                this.collectors = collectorList.data;

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getCollections() {
        return _getCollections.apply(this, arguments);
      }

      return getCollections;
    }()
  }
}, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} });