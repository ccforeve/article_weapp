<template>
	<view>
	    <official-account></official-account>
	    <view class="page__bd">
	      <view class="weui-panel weui-panel_access">
	        <view style="padding: 14px 15px 10px;">
	          <view class="label-text">当前收录绿叶产品 {{ total }} 种（实时更新）</view>
	          <view class="weui-media-box__info">
	            <view class="weui-media-box__info__meta ting">[停]商城暂时停售、</view>
	            <view class="weui-media-box__info__meta fu">[复]复消产品、</view>
	            <view class="weui-media-box__info__meta bao bao-padding">[报]报单产品、</view>
	            <view class="weui-media-box__info__meta yu yu-padding">[预]产品需要预定</view>
	          </view>
	        </view>
	        <view class="weui-panel__bd">
	          <view v-for="(product, index) in products" :key="index">
	            <view class="weui-media-box weui-media-box_appmsg" style="border-top: 1px solid #e5e5e5;margin: 0 15px;">
	              <view class="weui-media-box__hd weui-media-box__hd_in-appmsg">
	                <image class="weui-media-box__thumb" :src="product.cover" />
	              </view>
	              <view class="weui-media-box__bd weui-media-box__bd_in-appmsg">
	                <view class="weui-media-box__title" :class="product.text_color">{{ product.state_text }}{{ product.name }}</view>
	                <view class="weui-media-box__desc">{{ product.desc }}</view>
	              </view>
	              <view class="collection">
	                <i
	                  class="iconfont icon-collection"
	                  :class="{'collected': collectedList.find(value => {if (value == product.id) { return value }})}"
	                  @click="collectionHandle(product.id)"
	                ></i>
	              </view>
	              <navigator :url="'/pages/productDetail?article_id=' + product.article.id + '&user_id=' +user_id" class="navigator"></navigator>
	            </view>
	            <ad unit-id="adunit-339b94eca8c9de27" v-if="index !== 0 && index % 15 == 0"></ad>
	          </view>
	          <view class="weui-loadmore weui-loadmore_line" v-if="noMoreData">
	            <view class="weui-loadmore__tips weui-loadmore__tips_in-line">没有更多数据</view>
	          </view>
	        </view>
	      </view>
	    </view>
	    <view class="collectionBox" v-if="collection.isShow">
	      <view class="Boxtitle">请选择收藏夹</view>
				<view class="toAddBox" @tap="checkStore">
					<i class="iconfont icon-store" style="font-size: 12px">新建收藏夹</i>
				</view>
	      <view class="selectBox">
	        <view class="section">
	          <picker @change="bindPickerChange" :value="collection.selectIndex" :range="collection.collectors">
	            <view class="picker">
	              {{collection.collectors[collection.selectIndex]}}
	            </view>
	          </picker>
	        </view>
	      </view>
	      <view>
	        <span class="yesBtn" @tap="submitCollection">确定</span>
	        <span class="noBtn" @tap="showHandle">取消</span>
	      </view>
	    </view>
	  </view>
</template>

<script>
	import api from '@/utils/request'
	import { mapState, mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				collection: {
					selectIndex: 0,
					isShow: false,
					collectors: [],
					product_id: 0  // 当前要收藏产品的id
				},
				isStoreCollector: false,
				collectedList: [],
				products: [],
				user_id: 0,
				total: 0,         // 产品总数
				category_id: 0,   // 当前产品分类id
				option: {},
				state: '',
				title: '',
				noMoreData: false,  // 有没有更多数据
				isLoading: false    ,// 是否在加载中
			}
		},
		async onLoad(options) {
			this.category_id = options.category_id
			if (uni.getStorageSync('user_id')) {
				this.user_id = uni.getStorageSync('user_id')
			} else {
				let login = await uni.login()
				let user = await api.request('miniprogram/user/login?code=' + login.code)
				if (user.code === 200) {
					uni.setStorageSync('user_id', user.user_id)
					this.user_id = user.user_id
				}
			}
			await this.getProducts()
		},
		onShow() {
			let vuexProductId = this.storeCollectorResponseId
			if (vuexProductId && this.isStoreCollector) {
				this.collectedList.push(vuexProductId)
				uni.showToast({
					title: '收藏成功',
					icon: "success",
					duration: 2000
				});
				this.setStoreCollector(null)
				this.showHandle()
			}
		},
		computed: {
			...mapState(['collectorListVuex', 'storeCollectorResponseId'])
		},
		methods: {
			...mapMutations(['collectorStore', 'refresh', 'setStoreCollector']),
			bindPickerChange: function (e) {
				this.collection.selectIndex = e.detail.value
			},
			// 获取产品列表
			async getProducts(reset = false) {
				if (!this.option.page) {
					this.option.page = 1
				}
				if (this.user_id) {
					this.option.user_id = this.user_id
				}
				let operations = {
					url: 'products/' + this.category_id + '/category',
					data: this.option
				}
				try {
					let productResponse = await api.request(operations)
					this.title = productResponse.category.name
					uni.setNavigationBarTitle({
						title: productResponse.category.name
					})
					let products = productResponse.products.data
					var collectedList = []
					products.forEach(function (product) {
						let cover = product.cover
						if (cover.indexOf('//img.lvye100.com') >= 0) {
							product.cover = cover.replace(
								'//img.lvye100.com/p/',
								'http://img.lvye100.com/pxs/'
							)
						}
						product.desc = `零售：${product.price}元，会员：${product.money}元 + ${product.ticket}券`
						if (product.kind === 1) {
							if (product.price === product.money) {
								product.desc = `会员价：${product.money}元`
							} else {
								product.desc = `零售：${product.price}元，会员价：${product.money}元`
							}
						}
						product.state_text = ''
						if (product.kind === 1) {
							product.state_text = '[复]'
							product.text_color = 'fu'
						} else if (product.kind === 2) {
							product.state_text = '[报]'
							product.text_color = 'bao'
						} else if (product.kind === 3) {
							product.state_text = '[预]'
							product.text_color = 'yu'
						} else if (product.state === 0) {
							product.state_text = '[停]'
							product.text_color = 'ting'
						}
						// 处理已收藏的产品
						if (product.collection) {
							collectedList.push(product.id)
						}
					})
					// 如果传入参数 reset 为true，则覆盖 products
					this.products = reset ? products : this.products.concat(products)
					// 总数
					this.total = productResponse.products.total
					// 已收藏产品
					this.collectedList = reset ? collectedList : this.collectedList.concat(collectedList)
					// 判断是否是最后一页
					if (productResponse.products.current_page === productResponse.products.last_page) {
						this.noMoreData = true
					}
				} catch (e) {
					uni.showModal({
						title: '提示',
						content: '服务器错误，请联系管理员'
					})
				}
			},
			// 收藏操作
			async collectionHandle(productId) {
				let _this = this
				if (!this.user_id) {
					uni.showModal({
						title: '警告',
						content: '您尚未登陆，不可收藏产品！',
						confirmText: '去登陆',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({url: '/pages/toLogin'})
							}
						}
					})
					return false
				}
				if (this.collectedList.find(value => {if(value == productId) {return true}})) {
					uni.showModal({
						title: '警告',
						content: '确定要取消收藏此产品吗？',
						confirmText: '取消收藏',
						confirmColor: '#FF0000',
						success: async function (res) {
							if (res.confirm) {
								await api.authRequest({
									url: 'collections/' + productId,
									method: 'DELETE'
								})
								var collected = _this.collectedList
								var findIndex = collected.findIndex(value => {
									if (value == productId) {
										return value
									}
								})
								collected.splice(findIndex, 1)
								// 刷新收藏夹列表
								_this.refresh(true)
							}
						}
					})
				} else {
					this.collection.product_id = productId
					// 获取收藏夹列表并缓存
					if (this.collectorListVuex.length <= 0) {
						await this.getCollectors()
					} else {
						this.collectorListHandle(this.collectorListVuex)
					}
					this.collection.isShow = true
				}
			},
			// 获取收藏夹列表
			async getCollectors () {
				let collectorList = await api.authRequest({
					url: 'collectors',
					data: {
						list: true
					}
				})
				// 没有收藏夹的时候跳转到新增收藏夹
				if (collectorList.length <= 0) {
					uni.navigateTo({
						url: '/pages/collectorStore?productId=' + this.collection.product_id
					})
					return false
				}
				this.collectorListHandle(collectorList)
				// 缓存收藏夹列表
				this.collectorStore(collectorList)
			},
			// 处理收藏夹列表的数据
			collectorListHandle (list) {
				let newArr = []
				for (let item in list) {
					newArr.push(list[item]['title'])
				}
				this.collection.collectors = newArr
			},
			async checkStore() {
				let checkStoreResponse = await api.authRequest({
					url: 'collectors/check_store'
				})
				if (checkStoreResponse.status_code) {
					uni.showModal({
						title: '警告',
						content: checkStoreResponse.message,
						cancelColor: '#09BB07',
						confirmText: '开通会员',
						success: res => {
							if (res.confirm) {
							  uni.navigateTo({url: '/pages/toPay'});
							}
						}
					})
					return false
				}
				this.this.isStoreCollector = true
				uni.navigateTo({
					url: '/pages/collectorStore?productId=' + this.collection.product_id
				})
			},
			// 收藏操作
			async submitCollection () {
				let option = {}
				let productId = this.collection.product_id
				option.product_id = productId
				let findCollector = this.collectorListVuex.find(value => {
					if (value.title === this.collection.collectors[this.collection.selectIndex]) {
						return value
					}
				})
				option.collector_id = findCollector.id
				let collectionStoreResponse = await api.authRequest({
					url: 'collections',
					method: 'POST',
					data: option
				})
				this.showHandle()
				if ( collectionStoreResponse.status_code == 403 ) {
					uni.showModal({
						title: '警告',
						content: collectionStoreResponse.message,
						cancelColor: '#09BB07',
						confirmText: '开通会员',
						success: res => {
							if (res.confirm) {
							  uni.navigateTo({url: '/pages/toPay'});
							}
						}
					})
					return false
				} 
				this.collectedList.push(productId)
				// 刷新收藏夹列表
				this.refresh(true)
			},
			// 关闭收藏弹窗
			showHandle () {
				this.collection.isShow = !this.collection.isShow
			}
		},
	  // 重新加载
		async onPullDownRefresh() {
			this.noMoreData = false
			this.option.page = 1
			await this.getProducts(true)
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
			await this.getProducts()
	
			// 开始结束后设置 isLoading 为 false
			this.isLoading = false
		},
		// 分享
		onShareAppMessage(res) {
		    return {
		      // 标题是话题标题
		      title: this.title,
		      // 路径为话题详情路径
		      path: '/pages/productList?category_id=' + this.category_id,
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
	@font-face {
	  font-family: 'iconfont';  /* project id 1345172 */
	  src: url('//at.alicdn.com/t/font_1345172_8ajjpo39im6.eot');
	  src: url('//at.alicdn.com/t/font_1345172_8ajjpo39im6.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_1345172_8ajjpo39im6.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_1345172_8ajjpo39im6.woff') format('woff'),
	  url('//at.alicdn.com/t/font_1345172_8ajjpo39im6.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_1345172_8ajjpo39im6.svg#iconfont') format('svg');
	}
	.iconfont {
	  font-family: 'iconfont' !important;
	  font-size: 18px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -webkit-text-stroke-width: 0.2px;
	  -moz-osx-font-smoothing: grayscale;
	}
	.icon-collection::before {
	  content: '\e6d9';
	}
	.icon-collection {
	  font-size: 1.8rem;
	}
	.icon-store::before {
	  content: '\e66f';
	}
	.weui-media-box {
	  padding: 15px 0 !important;
	}
	.weui-media-box__info {
	  margin-top: 5px !important;
	}
	.weui-media-box__info__meta {
		width: 45%;
	}
	.label-text {
	  color: #000000;
	}
	.ting {
	  color: #b22e08;
	}
	.fu {
	  color: #3179b2;
	}
	.bao {
	  color: #8f55b2;
	}
	.yu {
	  color: #b2792a;
	}
	.bao-padding {
	  padding-top: 5px;
	}
	.yu-padding {
	  padding-top: 5px;
	}
	.collection {
	  color: #999;
	}
	.navigator {
	  position: absolute;
	  width: 84%;
	  height: 100%;
	}
	.collectionBox {
	  position: fixed;
	  top: 30%;
	  width: 80%;
	  background: #ffffff;
	  border: 1px solid #dfdfdf;
	  text-align: center;
	  left: 10%;
	  padding: 5% 0;
	}
	.Boxtitle {
	  font-size: 20px;
	}
	.toAddBox {
	  font-size: 12px;
	  padding: 3px 4px;
	  border: 1px solid #dfdfdf;
	  width: 75px;
	  margin: 0 auto;
	}
	.selectIcon {
	  font-size: 12px;
	  transform: rotate(90deg);
	  display: inline-block;
	  float: right;
	  margin-right: 8px;
	}
	.section {
	  width: 80%;
	  margin: 10px auto;
	  border: 1px solid #dfdfdf;
	  font-size: 13px;
	  text-align: left;
	  padding-left: 10px;
	  height: 35px;
	  line-height: 35px;
	  border-radius: 6px;
	}
	.yesBtn,
	.noBtn {
	  display: inline-block;
	  font-size: 15px;
	  padding: 4px 13%;
	  color: #fff;
	  background: green;
	  border-radius: 4px;
	  border: 1px solid #dfdfdf;
	}
	.noBtn {
	  margin-left: 20px;
	  background: #fff;
	  color: #cccccc;
	}
	.picker {
	  white-space: nowrap;/*内容超宽后禁止换行显示*/
	  overflow: hidden;/*超出部分隐藏*/
	  text-overflow:ellipsis;/*文字超出部分以省略号显示*/
	}
	.collected {
	  color: red;
	}
</style>
