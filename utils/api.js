export function request (options) {
  return new Promise((resolve, reject) => {
    options.success = function (res) {
      resolve(res)
    }
    options.fail = function (res) {
      resolve(res)
    }
    uni.request(options)
  })
}

export function login () {
  return new Promise((resolve, reject) => {
    uni.login({
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
