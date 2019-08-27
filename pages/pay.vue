<template>
	<web-view v-if="is_show" src="https://btl.yxcxin.com"></web-view>
</template>

<script>
	import api from '@/utils/request'
	
	export default {
		data() {
			return {
				openid: '',
				is_show: false,
				params: []
			}
		},
		async onLoad(option) {
			uni.showLoading({title: '支付中'})
			this.params = option
			let user = await api.login()
			this.openid = user.openid
			this.miniprogramPay()
			// uni.login().then(function (res) {
			// 	api.request('miniprogram/user/login?code=' + res.code).then(function (user) {
			// 		_this.openid = user.data.openid
			// 		_this.miniprogramPay()
			// 	})
			// })
		},
		methods: {
			async miniprogramPay() {
				let params = this.params
				let _this = this
				uni.hideToast()
				let pay = await api.request(`miniprogram/pay?order_id=${params.order_id}&user_id=${params.user_id}&openid=${this.openid}`)
				uni.requestPayment({
					timeStamp: pay.config.timestamp,
					nonceStr: pay.config.nonceStr,
					package: pay.config.package,
					signType: 'MD5',
					paySign: pay.config.paySign,
					success(res) {
						uni.showToast({
							title: '支付成功',
							icon: 'success',
							duration: 2000
						})
						_this.is_show = true
					},
					fail(res) {
						uni.showToast({
							title: '支付失败',
							image: '../static/image/error.png',
							duration: 2000
						})
						_this.is_show = true
					}
				})
			}
		}
	}
</script>

<style>
</style>
