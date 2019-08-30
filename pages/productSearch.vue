<template>
	<view class="content">
		<view class="search-box">
			<mSearch class="mSearch-input-box" :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @input="inputChange" @confirm="doSearch(false)" v-model="keyword"></mSearch>
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
			<view class="page__bd">
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
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/utils/request'
	import mSearch from '@/components/mehaotian-search-revision.vue';
	
	export default {
		data() {
			return {
				defaultKeyword: "",
				keyword: "",
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
		components: {
			mSearch
		},
		methods: {
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
			inputChange(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail?event.detail.value:event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				//以下示例截取淘宝的关键字，请替换成你的接口
				uni.request({
					url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //仅为示例
					success: (res) => {
						this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
					}
				});
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
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
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				this.saveKeyword(key); //保存为历史 
				uni.showToast({
					title: key,
					icon: 'none',
					duration: 2000
				});
				//实现搜索逻辑
				
			},
			// 搜索产品列表
			async getProducts(reset = false) {
				if (!this.option.page) {
					this.option.page = 1
				}
				if (this.user_id) {
					this.option.user_id = this.user_id
				}
				this.option.category_id = 1
				let operations = {
					url: 'products/112/category',
					data: this.option
				}
				try {
					let productResponse = await api.request(operations)
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
					this.collectedList = reset ? collectedList : this.collectedList.concat(collectedList,)
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
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						console.log(res.data);
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
			}
		}
	}
</script>
<style>
	view{display:block;}
	.search-box {width:95%;background-color:rgb(242,242,242);padding:15upx 2.5%;display:flex;justify-content:space-between;}
	.search-box .mSearch-input-box{width: 100%;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:28upx;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:60upx;}
	.search-box .input-box>input {width:100%;height:60upx;font-size:32upx;border:0;border-radius:60upx;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
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
