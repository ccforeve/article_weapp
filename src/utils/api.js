export function request (options) {
  return new Promise((resolve, reject) => {
    options.success = function (res) {
      resolve(res)
    }
    options.fail = function (res) {
      resolve(res)
    }
    wx.request(options)
  })
}

export function login () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        resolve(res)
      }
    })
  })
}

export default{
  request,
  login
}
