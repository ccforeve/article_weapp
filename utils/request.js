import api from '@/utils/api'

const host = 'https://stl.yxcxin.com/api/'

// 公共请求方法
const request = async (options, getData = true, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wx.showLoading({title: '加载中'})
  }
  options.url = host + options.url
  // 调用小程序的 request 方法
  let response = await api.request(options)
  if (showLoading) {
    // 隐藏加载中
    wx.hideLoading()
  }
  // 服务器异常后给与提示
  if (response.statusCode === 500) {
    wx.showModal({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
    return false
  }
  // 判断是否获取返回的data层数据
  if (getData) {
    return response.data
  } else {
    return response
  }
}

// 登录
const login = async (params = {}) => {
  // code 只能使用一次，所以每次单独调用
  let loginData = await api.login()

  // 参数中增加code
  params.code = loginData.code

  // 接口请求 weapp/authorizations
  let authResponse = await request({
    url: 'miniprogram/user/login',
    data: params,
    method: 'POST'
  })

  // 登录成功，记录 token 信息及用户信息
  wx.setStorageSync('user', authResponse.user)
  wx.setStorageSync('access_token', authResponse.access_token)
  wx.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.expires_in * 1000)

  return authResponse
}

// 刷新token
const refreshToken = async (accessToken) => {
  let options = {
    url: 'authorizations/refresh_token',
    method: 'PUT',
    header: {
      'Authorization': accessToken
    }
  }
  let refreshResponse = await request(options, false)
  return refreshResponse
}

// 获取token
const getToken = async () => {
  // 从缓存中取出token
  let accessToken = wx.getStorageSync('access_token')
  let expiredAt = wx.getStorageSync('access_token_expired_at')

  // 如果token过期了，则调用刷新方法
  if (accessToken && new Date().getTime() > expiredAt) {
    let refreshResponse = await refreshToken(accessToken)
    // 刷新成功
    if (refreshResponse.statusCode === 200) {
      accessToken = refreshResponse.data.access_token
      // 将 Token 及过期时间保存在 storage 中
      wx.setStorageSync('access_token', accessToken)
      wx.setStorageSync('access_token_expired_at', new Date().getTime() + refreshResponse.data.expires_in * 1000)
    } else {
      // 刷新失败了，重新调用登录方法，设置 Token
      let authResponse = await login()
      accessToken = authResponse.access_token
    }
  }

  return accessToken
}

// 带身份验证的请求
const authRequest = async (options, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wx.showLoading({title: '加载中'})
  }
  options.url = host + options.url
  let accessToken = await getToken()
  // 将 Token 设置在 header 中
  let header = options.header || {}
  header.Authorization = accessToken
  options.header = header
  // 调用小程序的 request 方法
  let response = await api.request(options)
  if (showLoading) {
    // 隐藏加载中
    wx.hideLoading()
  }
  // 服务器异常后给与提示
  if (response.statusCode === 500) {
    wx.showModal({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
    return false
  }

  return response.data
}

export default{
  request,
  login,
  refreshToken,
  getToken,
  authRequest
}
