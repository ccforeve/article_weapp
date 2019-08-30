<template>
	<view class="page">
		<view class="page__bd">
			<view class="weui-toptips weui-toptips_warn" v-if="fail.tipsFlag">{{fail.tipsMessage}}</view>
	
			<view class="weui-cells__title">姓名</view>
			<view class="weui-cells weui-cells_after-title">
				<view class="weui-cell weui-cell_input">
					<view class="weui-cell__bd">
						<input class="weui-input" placeholder="请输入姓名" v-model="user.nickname" />
					</view>
					<view class="weui-cell__ft" v-if="fail.nickname || user.nickname.length > 20 || user.nickname.length <= 0">
						<icon type="warn" size="23" color="#E64340"></icon>
					</view>
				</view>
			</view>
	
			<view class="weui-cells__title">手机号</view>
			<view class="weui-cells weui-cells_after-title">
				<view class="weui-cell weui-cell_input">
					<view class="weui-cell__bd">
						<input type="number" class="weui-input" placeholder="请输入手机号" v-model="user.phone" />
					</view>
					<view class="weui-cell__ft" v-if="fail.phone || user.phone.length > 11 || user.phone.length <= 0">
						<icon type="warn" size="23" color="#E64340"></icon>
					</view>
				</view>
			</view>
			
			<view class="weui-cells__title">微信号</view>
			<view class="weui-cells weui-cells_after-title">
				<view class="weui-cell weui-cell_input">
					<view class="weui-cell__bd">
						<input class="weui-input" placeholder="请输入微信号" v-model="user.wechat" />
					</view>
				</view>
			</view>
	
			<view class="weui-btn-area">
					<button class="weui-btn" type="primary" @click="submit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/utils/request'
	
	export default {
		data() {
			return {
				fail: {
					tipsFlag: false,
					tipsMessage: null,
					nickname: false,
					phone: false,
					wechat: false
				},
				user: {
					nickname: '',
					phone: '',
					wechat: ''
				}
			}
		},
		onLoad() {
			let userInfo = uni.getStorageSync('user')
			this.user.nickname = userInfo.nickname
			this.user.phone = userInfo.phone
			this.user.wechat = userInfo.wechat
		},
		methods: {
			async submit () {
				if (this.user.nickname.length > 20 || this.user.nickname.length < 0) {
					this.fail.title = true
					this.fail.tipsMessage = '姓名不能为空或超过20个字'
					this.showTipsFlag()
					return false
				}
				if (this.user.phone.length > 11 || this.user.phone.length < 0) {
					this.fail.title = true
					this.fail.tipsMessage = '手机号不能为空或超过12位'
					this.showTipsFlag()
					return false
				}
				// 更新操作
				let updateUserResponse = await api.authRequest({
					url: 'user',
					method: 'PUT',
					data: this.user
				})
				// 更新用户缓存
				let user = uni.getStorageSync('user')
				user.nickname = this.user.nickname
				user.phone = this.user.phone
				user.wechat = this.user.wechat
				uni.setStorageSync('user', user)
				// 返回上一页
				uni.navigateBack()
			},
			// 提示错误
			showTipsFlag () {
				this.fail.tipsFlag = true
				setTimeout(() => {
					this.fail.tipsFlag = false
				}, 2000)
			},
		}
	}
</script>

<style>
</style>
