"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(1));

var _core = _interopRequireDefault(require('../vendor.js')(2));

var _request = _interopRequireDefault(require('../utils/request.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].page({
  data: {
    categories: []
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee() {
      var productCategories;
      return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _request["default"].request('product_categories');

            case 2:
              productCategories = _context.sent;
              this.categories = productCategories.data;

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function onLoad() {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  onShareAppMessage: function onShareAppMessage(res) {
    return {
      // 标题是话题标题
      title: '绿叶产品价格表',
      // 路径为话题详情路径
      path: '/pages/index',
      success: function success(res) {
        // 转发成功
        console.log(res);
      },
      fail: function fail(res) {
        // 转发失败
        console.log(res);
      }
    };
  }
}, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} });