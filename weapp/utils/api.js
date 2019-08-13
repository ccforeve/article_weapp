"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = request;
exports.login = login;
exports["default"] = void 0;

function request(method, optionUrl, data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: optionUrl,
      method: method,
      data: data,
      header: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc3RsLnl4Y3hpbi5jb21cL2FwaVwvdXNlclwvbG9naW4iLCJpYXQiOjE1NjU3MDIxMjUsImV4cCI6MTU2NTcwOTMyNSwibmJmIjoxNTY1NzAyMTI1LCJqdGkiOiJSMDFWUTV0RGIxUzRpRnp1Iiwic3ViIjo1MCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.cxrVhV4ecZTeEi2vU0H6ro5GTpLTVn-RS_W3wzau8S0'
      },
      success: function success(res) {
        resolve(res);
      },
      fail: function fail(res) {
        resolve(res);
      }
    });
  });
}

function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function success(res) {
        resolve(res);
      },
      fail: function fail(res) {
        resolve(res);
      }
    });
  });
}

var _default = {
  request: request,
  login: login
};
exports["default"] = _default;