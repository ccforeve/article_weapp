<template>
	<view class="login">
	    <button type="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">登录</button>
	  </view>
</template>

<script>
	import api from '@/utils/request'
	
	export default {
		methods: {
			async bindGetUserInfo(e) {
				let user = e.detail
				user.session_key = wx.getStorageSync('session_key')
				uni.getStorageSync('session_key')
				// 接下来写业务代码
				try {
					let authResponse = await api.request({
						url: 'miniprogram/user/check_user',
						data: user
					})
					// 登录成功，记录 token 信息及用户信息
					uni.setStorageSync('user_id', authResponse.user.id)
					uni.setStorageSync('user', authResponse.user)
					uni.setStorageSync('access_token', authResponse.access_token)
					uni.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.expires_in * 1000)
				} catch (e) {
					uni.showModal({
						title: '提示',
						content: '服务器错误，请联系管理员',
						showCancel: false
					})
				}
				// 最后，记得返回刚才的页面
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	.login{
	    padding-top: 50%;
	  }
</style>
