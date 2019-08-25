<template>
	<web-view v-if="is_show" :src="'https://btl.yxcxin.com/' + webUrl"/>
</template>

<script>
	import api from '@/utils/request.js'
	
	export default {
		data() {
			return {
				is_show: false,
				article_id: 0,
				user_article_id: 0,
				user_id: 0,
				title: '',
				article_type: 1,
			}
		},
		computed: {
			webUrl() {
				if (this.article_type === 1) {
					return `article_detail/${this.article_id}/public`
				} else if (this.article_type === 2) {
					return `article_detail/${this.user_article_id}/user`
				}
			}
		},
		async onLoad(option) {
			uni.showLoading({title: '加载中'})
			try {
				let requestOption = {}
				if (option.user_id) {
					this.user_id = option.user_id
					requestOption.user_id = option.user_id
				}
				let responseDetail = await api.request({
					url: 'articles/' + option.article_id + '/detail',
					method: 'get',
					data: requestOption
				})
				this.title = responseDetail.title
				uni.setNavigationBarTitle({
					title: this.title  // 设置文章标题
				})
				// 如果用户已创建了该文章
				// 则直接跳转到用户文章
				if (responseDetail.type === 2) {
					this.article_type = responseDetail.type
					this.user_article_id = responseDetail.user_article_id
				}
				this.article_id = option.article_id
				this.is_show = true
				uni.hideLoading()
			} catch (e) {
				uni.showModal({
					title: '提示',
					content: '服务器错误，请联系管理员'
				})
			}
		},
		onUnload() {
			this.is_show = false
		},
		onShareAppMessage (res) {
			return {
				// 标题是话题标题
				title: this.title,
				// 路径为话题详情路径
				path: '/pages/detail?article_id=' + this.article_id + '&user_id=' + this.user_id,
				success: function(res) {
					// 转发成功
					console.log(res)
				},
				fail: function(res) {
					// 转发失败
					console.log(res)
				}
			}
		}
	}
</script>

<style>
</style>
