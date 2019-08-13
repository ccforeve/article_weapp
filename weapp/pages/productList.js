"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('../vendor.js')(1));

var _core = _interopRequireDefault(require('../vendor.js')(2));

var _request = _interopRequireDefault(require('../utils/request.js'));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_core["default"].page({
  data: {
    // 有没有更多数据
    noMoreData: false,
    // 是否在加载中
    isLoading: false,
    products: [],
    user_id: 0,
    total: 0,
    category_id: 0,
    option: {},
    state: '',
    title: ''
  },
  methods: {
    getProducts: function () {
      var _getProducts = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime2["default"].mark(function _callee() {
        var reset,
            productResponse,
            products,
            _args = arguments;
        return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                reset = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;

                if (!this.option.page) {
                  this.option.page = 1;
                }

                _context.prev = 2;
                _context.next = 5;
                return _request["default"].request('products/' + this.category_id + '/category', 'get', this.option);

              case 5:
                productResponse = _context.sent;
                this.title = productResponse.category.name;
                wx.setNavigationBarTitle({
                  title: productResponse.category.name
                });
                products = productResponse.products.data;
                products.forEach(function (product) {
                  var cover = product.cover;

                  if (cover.indexOf('//img.lvye100.com') >= 0) {
                    product.cover = cover.replace('//img.lvye100.com/p/', 'http://img.lvye100.com/pxs/');
                  }

                  product.desc = "\u96F6\u552E\uFF1A".concat(product.price, "\u5143\uFF0C\u4F1A\u5458\uFF1A").concat(product.money, "\u5143 + ").concat(product.ticket, "\u5238");

                  if (product.kind === 1) {
                    if (product.price === product.money) {
                      product.desc = "\u4F1A\u5458\u4EF7\uFF1A".concat(product.money, "\u5143");
                    } else {
                      product.desc = "\u96F6\u552E\uFF1A".concat(product.price, "\u5143\uFF0C\u4F1A\u5458\u4EF7\uFF1A").concat(product.money, "\u5143");
                    }
                  }

                  if (product.kind === 1) {
                    product.state_text = '[复]';
                    product.text_color = 'fu';
                  } else if (product.kind === 2) {
                    product.state_text = '[报]';
                    product.text_color = 'bao';
                  } else if (product.kind === 3) {
                    product.state_text = '[预]';
                    product.text_color = 'yu';
                  } else if (product.state === 0) {
                    product.state_text = '[停]';
                    product.text_color = 'ting';
                  }
                }); // 如果传入参数 reset 为true，则覆盖 topics

                this.products = reset ? products : this.products.concat(products); // 判断是否是最后一页

                if (productResponse.products.current_page === productResponse.products.last_page) {
                  this.noMoreData = true;
                }

                this.total = productResponse.products.total;
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](2);
                wx.showModal({
                  title: '提示',
                  content: '服务器错误，请联系管理员'
                });

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 15]]);
      }));

      function getProducts() {
        return _getProducts.apply(this, arguments);
      }

      return getProducts;
    }(),
    collection: function collection() {
      console.log("collection");
    }
  },
  onLoad: function () {
    var _onLoad = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee2(options) {
      return _regeneratorRuntime2["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.category_id = options.category_id;
              _context2.next = 3;
              return this.getProducts();

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function onLoad(_x) {
      return _onLoad.apply(this, arguments);
    }

    return onLoad;
  }(),
  onShow: function () {
    var _onShow = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee3() {
      var login, user;
      return _regeneratorRuntime2["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!wx.getStorageSync('user_id')) {
                _context3.next = 4;
                break;
              }

              this.user_id = wx.getStorageSync('user_id');
              _context3.next = 11;
              break;

            case 4:
              _context3.next = 6;
              return _core["default"].login();

            case 6:
              login = _context3.sent;
              _context3.next = 9;
              return _request["default"].request('miniprogram/user/login?code=' + login.code);

            case 9:
              user = _context3.sent;

              if (user.code === 200) {
                wx.setStorageSync('user_id', user.data.user_id);
                this.user_id = user.data.user_id;
              }

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function onShow() {
      return _onShow.apply(this, arguments);
    }

    return onShow;
  }(),
  // 重新加载
  onPullDownRefresh: function () {
    var _onPullDownRefresh = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee4() {
      return _regeneratorRuntime2["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              this.noMoreData = false;
              this.option.page = 1;
              _context4.next = 4;
              return this.getProducts(true);

            case 4:
              _core["default"].stopPullDownRefresh();

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function onPullDownRefresh() {
      return _onPullDownRefresh.apply(this, arguments);
    }

    return onPullDownRefresh;
  }(),
  // 加载更多
  onReachBottom: function () {
    var _onReachBottom = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime2["default"].mark(function _callee5() {
      return _regeneratorRuntime2["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(this.noMoreData || this.isLoading)) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return");

            case 2:
              // 开始请求之前设置 isLoading 为true
              this.isLoading = true;
              this.option.page = this.option.page + 1;
              _context5.next = 6;
              return this.getProducts();

            case 6:
              // 开始结束后设置 isLoading 为 false
              this.isLoading = false;

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function onReachBottom() {
      return _onReachBottom.apply(this, arguments);
    }

    return onReachBottom;
  }(),
  onShareAppMessage: function onShareAppMessage(res) {
    return {
      // 标题是话题标题
      title: this.title,
      // 路径为话题详情路径
      path: '/pages/productList?category_id=' + this.category_id,
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
}, {info: {"components":{},"on":{}}, handlers: {'11-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.collection($event)
      })();
    
  }}}, models: {} }, {info: {"components":{},"on":{}}, handlers: {'11-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.collection($event)
      })();
    
  }}}, models: {} });