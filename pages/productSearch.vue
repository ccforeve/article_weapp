<template>
	<view class="content">
		<view class="search-box">
			<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></mSearch>
		</view>
		<view>
			<view class="type-select">停售</view>
			<view class="type-select">复消</view>
			<view class="type-select">报单</view>
			<view class="type-select">预定</view>
		</view>
		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in keywordList" :key="row.keyword">
					<view class="keyword-text" @tap="doSearch(row.keyword)">
						<rich-text :nodes="row.htmlStr"></rich-text>
					</view>
					<view class="keyword-img" @tap="setkeyword(row)">
						<image src="/static/image/HM-search/back.png"></image>
					</view>
				</view>
			</scroll-view>
			<view class="page__bd" v-show="!isShowKeywordList">
			  <view class="weui-panel weui-panel_access">
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
			              @click="collectionHandle(product.collection, product.id)"
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
				<view class="collectionBox" v-if="collection.isShow">
				  <view class="Boxtitle">请选择收藏夹</view>
				  <navigator :url="'/pages/collectorStore?productId=' + collection.product_id" class="toAddBox">
						<i class="iconfont icon-store" style="font-size: 12px">新建收藏夹</i>
					</navigator>
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
		</view>
	</view>
</template>

<script>
	import api from '@/utils/request'
	import { mapState, mapMutations } from 'vuex'
	import mSearch from '@/components/mehaotian-search-revision.vue';
	
	export default {
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
				beginSearch: true,
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				collection: {
					selectIndex: 0,
					isShow: false,
					collectors: [],
					product_id: 0  // 当前要收藏产品的id
				},
				user_id: 0,
				products: [],
				collectedList: [],
				option: {},
				noMoreData: false,  // 有没有更多数据
				isLoading: false		// 是否在加载中
			}
		},
		async onLoad(option) {
			this.option.search_key = option.key
			this.keyword = option.key
			this.init()
			// 获取用户id
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
			this.getProducts()
		},
		computed: {
			...mapState(['collectorListVuex', 'storeCollectorResponseId'])
		},
		components: {
			mSearch
		},
		methods: {
			...mapMutations(['collectorStore', 'refresh', 'setStoreCollector']),
			bindPickerChange: function (e) {
				this.collection.selectIndex = e.detail.value
			},
			init() {
				this.loadDefaultKeyword();
			},
			blur(){
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "";
			},
			//监听输入
			async inputChange(event) {
				var keyword = event.detail?event.detail.value:event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					this.beginSearch = true
					return;
				}
				var zhongwen = /^[\u4e00-\u9fa5]+|[\u4e00-\u9fa5][0-9]+$/
				if (!zhongwen.test(event) || event.length < 2) {
					return;
				} 
				if (this.beginSearch) {
					let _this = this
					this.beginSearch = false
					this.isShowKeywordList = true;
					//关键字列表
					let nameList = await api.authRequest({
						url: 'products/search_name?key=' + keyword
					})
					this.keywordList = this.drawCorrelativeKeyword(nameList, keyword)
					setTimeout(function () {
						_this.beginSearch = true
					}, 1000)
				}
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row.replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row,
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//执行搜索
			doSearch(key) {
				this.isShowKeywordList = false
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				//保存为历史 
				this.saveKeyword(key);
				//实现搜索逻辑
				this.option.search_key = key
				this.getProducts(true)
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			},
			// 搜索产品列表
			async getProducts(reset = false) {
				if (!this.option.page) {
					this.option.page = 1
				}
				let operations = {
					url: 'products/search',
					data: this.option
				}
				try {
					let productResponse = await api.authRequest(operations)
					let products = productResponse.data
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
					// 已收藏产品
					this.collectedList = reset ? collectedList : this.collectedList.concat(collectedList,)
					// 判断是否是最后一页
					if (productResponse.current_page === productResponse.last_page) {
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
			async collectionHandle(collection, productId) {
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
				if (collection) {
					uni.showModal({
						title: '警告',
						content: '确定要取消收藏此产品吗？',
						confirmText: '取消收藏',
						confirmColor: '#FF0000',
						success: async function (res) {
							if (res.confirm) {
								await api.authRequest({
									url: 'collections/' + collection.id,
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
	.type-select {
		float: left;
		padding: 0 15px;
	}
	view{display:block;}
	.search-box {width:95%;background-color:rgb(242,242,242);padding:15upx 2.5%;display:flex;justify-content:space-between;}
	.search-box .mSearch-input-box{width: 100%;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:28upx;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:60upx;}
	.search-box .input-box>input {width:100%;height:60upx;font-size:32upx;border:0;border-radius:60upx;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);margin-top: 2rem;}
	.keyword-list-box {height:calc(100vh - 110upx);padding-top:10upx;border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:80upx;margin:0 3%;font-size:30upx;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1upx #e7e7e7;}
	.keyword-entry image {width:60upx;height:60upx;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:80upx;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:90%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
	.keyword-box {height:calc(100vh - 110upx);border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-box .keyword-block {padding:10upx 0;}
	.keyword-box .keyword-block .keyword-list-header {width:94%;padding:10upx 3%;font-size:27upx;color:#333;display:flex;justify-content:space-between;}
	.keyword-box .keyword-block .keyword-list-header image {width:40upx;height:40upx;}
	.keyword-box .keyword-block .keyword {width:94%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
	.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:28upx;color:#6b6b6b;}
	.keyword-box .keyword-block .keyword>view {display:flex;justify-content:center;align-items:center;border-radius:60upx;padding:0 20upx;margin:10upx 20upx 10upx 0;height:60upx;font-size:28upx;background-color:rgb(242,242,242);color:#6b6b6b;}
</style>
