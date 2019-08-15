"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(0));

var _core = _interopRequireDefault(require('../vendor.js')(2));

var _api = _interopRequireDefault(require('../utils/api.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].page({
  data: {
    openid: '',
    is_show: false,
    params: []
  },
  onLoad: function onLoad(option) {
    var _this = this;

    _core["default"].showLoading({
      title: '支付中'
    });

    this.params = option;

    _core["default"].login().then(function (res) {
      _api["default"].request('miniprogram/user/login?code=' + res.code).then(function (user) {
        _this.openid = user.data.openid;

        _this.$apply();

        _this.miniprogramPay();
      });
    });
  },
  miniprogramPay: function () {
    var _miniprogramPay = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee() {
      var params, _this, pay;

      return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              params = this.params;
              _this = this;

              _core["default"].hideToast();

              _context.next = 5;
              return _api["default"].request("miniprogram/pay?order_id=".concat(params.order_id, "&user_id=").concat(params.user_id, "&openid=").concat(this.openid));

            case 5:
              pay = _context.sent;

              _core["default"].requestPayment({
                timeStamp: pay.data.config.timestamp,
                nonceStr: pay.data.config.nonceStr,
                "package": pay.data.config["package"],
                signType: 'MD5',
                paySign: pay.data.config.paySign,
                success: function success(res) {},
                fail: function fail(res) {}
              }).then(function (res) {
                console.log(res);

                _core["default"].showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                });

                _this.is_show = true;

                _this.$apply();
              })["catch"](function (e) {
                _core["default"].showToast({
                  title: '支付失败',
                  image: '/images/error.png',
                  duration: 2000
                });

                _this.is_show = true;

                _this.$apply();
              });

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function miniprogramPay() {
      return _miniprogramPay.apply(this, arguments);
    }

    return miniprogramPay;
  }()
}, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} });