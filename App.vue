<script>
	import curl from '@/utils/request'
	
	export default {
		onLaunch: async function() {
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager()
				updateManager.onCheckForUpdate(function (res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function () {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function (res) {
									// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function () {
							// 新的版本下载失败
							uni.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			}
			let user = await curl.login()
			if (user.code === 401) {
				this.getUser(user.session_key)
				uni.setStorageSync('session_key', user.session_key)
			} else {
				// 缓存用户id
				uni.setStorageSync('user_id', user.user_id)
			}
		},
		methods: {
		    async getUser(session) {
		      let _uni = uni
		      _uni.getUserInfo({
		        withCredentials: true,
		        success: function (res) {
		          var user = res
		          user.session_key = session
		          // 接下来写业务代码
		          let options = {
		            url: 'miniprogram/user/check_user',
		            data: user
		          }
		          curl.request(options).then(function (res) {
		            if (res.code === 200) {
		              // 缓存用户id
		              _uni.setStorageSync('user_id', res.user_id)
		            }
		          })
		        },
		        fail: function (res) {
		          _uni.showModal({
		            title: '警告',
		            content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
		            showCancel: false,
		            success: function (res) {
		              if (res.confirm) {
		                uni.navigateTo({url: '/pages/toLogin'})
		              }
		            }
		          })
		        }
		      })
		    }
		  }
	}
</script>

<style lang="less">
	@import './common/style/weui.less';
	
	page{
			background-color: #F8F8F8;
			font-size: 16px;
	}
	.page__hd {
			padding: 40px;
	}
	.page__bd {
			padding-bottom: 40px;
	}
	.page__bd_spacing {
			padding-left: 15px;
			padding-right: 15px;
	}
	.page__ft{
			padding-bottom: 10px;
			text-align: center;
	}
	.page__title {
			text-align: left;
			font-size: 20px;
			font-weight: 400;
	}
	.page__desc {
			margin-top: 5px;
			color: #888888;
			text-align: left;
			font-size: 14px;
	}
</style>
