<template>
  <view class="collection">
      <view class="headTitle">
        <i class="iconfont icon_collection" style="color: red;">收藏夹</i>
      </view>
      <!-- 收藏列表 -->
      <view class="list">
        <navigator :url="'/pages/collectionList?collector_id=' + collector.id" class="prodBox" v-for="(collector, index) in collectors" :key="index">
          <view class="boxHead">
            <span class="prdTitle">{{ collector.title }}</span><span class="bRight">{{ collector.collections_count }}个</span>
          </view>
          <view>
            <span class="prdMess">{{ collector.desc }}</span><span class="bRight created-at">{{ collector.created_at }}</span>
          </view>
        </navigator>
      </view>
      <view class="weui-loadmore weui-loadmore_line" v-if="noMoreData">
        <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
      </view>
    </view>
</template>

<script>
	import api from '@/utils/request'
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				collectors: [],
				// 有没有更多数据
				noMoreData: false,
				// 是否在加载中
				isLoading: false,
				option: {}
			}
		},
		computed: {
			...mapState(['collectorListVuex', 'isRefresh'])
		},
		async onLoad(options) {
			let userId = uni.getStorageSync('user_id')
			if (!userId) {
				uni.showToast({title: '未授权登录', icon: 'none'})
				uni.navigateTo({url: '/pages/toLogin'})
				return false
			}
			await this.getCollectors()
			this.refresh(false)
		},
		async onShow() {
			if (this.isRefresh) {
				this.option.page = 1
				this.collectors = []
				await this.getCollectors()
			}
		},
		methods: {
			...mapMutations(['collectorStore', 'refresh']),
			async getCollectors (reset = false) {
				this.refresh(false)
				if (!this.option.page) {
					this.option.page = 1
				}
				let collectorList = await api.authRequest({
					url: 'collectors',
					data: this.option
				})
				// 缓存收藏夹列表
				this.collectorStore(JSON.parse(JSON.stringify(collectorList.data)))
				let collectors = collectorList.data

				// 如果传入参数 reset 为true，则覆盖 collectors
				this.collectors = reset ? collectors : this.collectors.concat(collectors)
				// 收藏夹总数
				this.collectorNum = this.collectors.length
				// 判断是否是最后一页
				if (collectorList.current_page === collectorList.last_page) {
					this.noMoreData = true
				}
			}
		},
		// 重新加载
		async onPullDownRefresh() {
			this.noMoreData = false
			this.option.page = 1
			await this.getCollectors(true)
			uni.stopPullDownRefresh()
		},
		// 加载更多
		async onReachBottom() {
			// 如果没有更多数据，或者正在加载，直接返回
			if (this.noMoreData || this.isLoading) {
				return
			}
			// 开始请求之前设置 isLoading 为true
			this.isLoading = true
			this.option.page = this.option.page + 1
			await this.getCollectors()

			// 开始结束后设置 isLoading 为 false
			this.isLoading = false
		},
		onShareAppMessage(res) {
			return {
				// 标题是话题标题
				title: '绿叶价格表',
				// 路径为话题详情路径
				path: '/pages/index',
				success: function (res) {
					// 转发成功
					console.log(res)
				},
				fail: function (res) {
					// 转发失败
					console.log(res)
				}
			}
		}
	}
</script>

<style>
	.mylist:odd {
	    color: red;
	}
	.mylist:even {
		color: green;
	}
	@font-face {
		font-family: 'iconfont'; /* project id 1314494 */
		src: url('https://at.alicdn.com/t/font_1314494_u4ctf32onxf.eot');
		src: url('https://at.alicdn.com/t/font_1314494_u4ctf32onxf.eot?#iefix')
		format('embedded-opentype'),
		url('https://at.alicdn.com/t/font_1314494_u4ctf32onxf.woff2') format('woff2'),
		url('https://at.alicdn.com/t/font_1314494_u4ctf32onxf.woff') format('woff'),
		url('https://at.alicdn.com/t/font_1314494_u4ctf32onxf.ttf') format('truetype'),
		url('https://at.alicdn.com/t/font_1314494_u4ctf32onxf.svg#iconfont') format('svg');
	}
	.iconfont {
		font-family: 'iconfont' !important;
		font-size: 18px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	}
	.icon_collection::before {
		content: "\e629";
	}
	.headTitle {
		width: 50%;
		height: 24px;
		color: rgba(16, 16, 16, 1);
		font-size: 18px;
		text-align: left;
		padding-bottom: 8px;
		border-bottom: 1px solid rgba(187, 187, 187, 1);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.collection {
		padding: 10px 15px 0 15px;
		background: #ffffff;
	}
	.list {
		margin-top: 8px;
		width: 100%;
	}
	.prodBox {
		border-bottom: 1px dashed rgba(187, 187, 187, 1);
		font-size: 14px;
		width: 100%;
		padding-bottom: 5px;
		margin-top: 5px;
	}
	.prdTitle {
		font-size: 15px;
		width: 85%;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-weight: 600;
	}
	.bRight {
		float: right;
	}
	.bRight.created-at {
		font-size: 12px;
	}
	.prdMess {
		width: 80%;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.boxHead {
		margin-bottom: 5px;
	}
	.weui-loadmore {
		margin: 1.5rem auto 0 !important;
	}
</style>
