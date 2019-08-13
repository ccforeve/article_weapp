import api from '@/utils/api'

const host = 'https://stl.yxcxin.com/api/'

const request = async (url, method = 'get', data = [], showLoading = true) => {
  let optionUrl = host + url
  // 显示加载中
  if (showLoading) {
    wx.showLoading({title: '加载中'})
  }
  // 调用小程序的 request 方法
  let response = await api.request(method, optionUrl, data)
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
    // return false
  }
  return response.data
}

export default{
  request
}
