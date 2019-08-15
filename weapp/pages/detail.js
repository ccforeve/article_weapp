"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(0));

var _core = _interopRequireDefault(require('../vendor.js')(2));

var _api = _interopRequireDefault(require('../utils/api.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].page({
  data: {
    is_show: false,
    article_id: 0,
    user_article_id: 0,
    user_id: 0,
    title: '',
    article_type: 1
  },
  computed: {
    webUrl: function webUrl() {
      if (this.article_type === 1) {
        return "article_detail/".concat(this.article_id, "/public");
      } else if (this.article_type === 2) {
        return "article_detail/".concat(this.user_article_id, "/user");
      }
    }
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee(option) {
      var requestOption, responseDetail;
      return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _core["default"].showLoading({
                title: '加载中'
              });

              _context.prev = 1;
              requestOption = {};

              if (option.user_id) {
                this.user_id = option.user_id;
                requestOption.user_id = option.user_id;
              }

              _context.next = 6;
              return _api["default"].request({
                url: 'articles/' + option.article_id + '/detail',
                method: 'get',
                data: requestOption
              });

            case 6:
              responseDetail = _context.sent;

              if (responseDetail.statusCode === 200) {
                this.title = responseDetail.data.title;

                _core["default"].setNavigationBarTitle({
                  title: responseDetail.data.title // 设置文章标题

                }); // 如果用户已创建了该文章
                // 则直接跳转到用户文章


                if (responseDetail.data.type === 2) {
                  this.article_type = responseDetail.data.type;
                  this.user_article_id = responseDetail.data.user_article_id;
                  this.$apply();
                }
              }

              this.article_id = option.article_id;
              this.is_show = true;
              this.$apply();

              _core["default"].hideLoading();

              _context.next = 17;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](1);

              _core["default"].showModal({
                title: '提示',
                content: '服务器错误，请联系管理员'
              });

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 14]]);
    }));

    function onLoad(_x) {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  onUnload: function onUnload() {
    this.is_show = false;
    this.$apply();
    console.log('页面销毁');
  },
  onShareAppMessage: function onShareAppMessage(res) {
    return {
      // 标题是话题标题
      title: this.title,
      // 路径为话题详情路径
      path: '/pages/detail?article_id=' + this.article_id + '&user_id=' + this.user_id,
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
}, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} }, {info: {"components":{},"on":{}}, handlers: {}, models: {} });