<template>
	<view>
		<view class="collection">
			<view class="headTitle">
				<view class="user">{{user.nickname}}的收藏夹</view>
				<view class="info">手机号:{{user.phone}} / 微信号:{{user.wechat}}</view>
			</view>
			<view class="headTitle">
				<view>{{collector.title}}</view>
			</view>
			<view class="desc">
				<span>{{collector.desc}}</span>
			</view>
			<!-- 产品列表 -->
			<view class="prodList" v-for="(collection, index) in collections" :key="index">
				<navigator :url="'/pages/productDetail?article_id=' + collection.product.article.id + '&user_id=' + option.user_id" class="prodBox">
					<view class="prodImg">
						<img :src="collection.product.cover" class="image">
					</view>
					<view class="prodMess" v-if="!collector.show_member">
					  <text class="prodTitle">{{ collection.product.name }}</text>
					  <text class="prodTitle">
					    零售：{{list.fee[collection.id]}}元
					  </text>
					</view>
					<view class="prodMess" v-else>
					  <text class="prodTitle">{{ collection.product.name }}</text>
					  <text class="prodTitle" v-if="collection.product.kind == 1 && collection.product.price === collection.product.money">
					    会员价：{{list.memberFee[collection.id]}}元
					  </text>
					  <text class="prodTitle" v-else-if="collection.product.kind == 1 && collection.product.price !== collection.product.money">
					    零售：{{list.fee[collection.id]}}元，会员价：{{list.memberFee[collection.id]}}元
					  </text>
					  <text class="prodTitle" v-else>
					    零售：{{list.fee[collection.id]}}元，会员价：{{list.memberFee[collection.id]}}元+{{list.volume[collection.id]}}券
					  </text>
					</view>
					<text class="prodNum">{{ collection.quantity}}{{ collection.product.min_unit}}</text>
				</navigator>
			</view>
		</view>
		<!-- 确认数量footer -->
		<view class="numFooter">
			<view class="price">
				<text>总数量：{{ footer.totalQuantity }}</text>
				<view class="prodTitle" v-if="!collector.show_member">零售：{{ footer.totalFee }}元</view>
				<view class="prodTitle" v-else>零售:{{ footer.totalFee }}元, 会员:{{ footer.totalMemberFee }}元+{{ footer.totalVolume }}券</view>
			</view>
			<view class="priceBtn">
				<span @tap="copyCollector">复制收藏夹</span>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/utils/request'
	
	export default {
		data() {
			return {
				user: [],
				collector: [],
				collections: [],
				option: {
					user_id: null,
					collector_id: null
				},
				list: {
				  quantity: {},
				  fee: {},
				  memberFee: {},
				  volume: {}
				},
				footer: {
				  totalQuantity: 0,
				  totalFee: 0,
				  totalMemberFee: 0,
				  totalVolume: 0
				}
			}
		},
		async onLoad(option) {
			this.option.user_id = 50
			this.option.collector_id = 1
			this.getUser()
			this.getCollector()				// 收藏夹详情
			await this.getCollections()			// 收藏夹下的收藏列表
			this.totalNumHandle()   				// 统计数量
			this.totalFeeHandle()   				// 统计总价
			this.totalMemberFeeHandle()   	// 统计会员价
			this.totalVolumeHandle()   			// 统计优惠劵
		},
		methods: {
			// 获取当前用户
			async getUser () {
				this.user = await api.authRequest({
					url: 'user',
					method: 'GET',
					data: {
						user_id: this.option.user_id
					}
				})
			},
			// 获取当前收藏夹
			async getCollector () {
				this.collector = await api.authRequest({
					url: 'collectors/' + this.option.collector_id,
					method: 'GET'
				})
			},
			// 获取收藏夹下的收藏列表
			async getCollections() {
				let quantity = {}
				let fee = {}
				let memberFee = {}
				let volume = {}
				this.collections = await api.authRequest({
					url: 'collections',
					method: 'GET',
					data: this.option
				})
				this.collections.forEach(function (collection) {
					// 数量
					quantity[collection.id] = collection.quantity
					// 价格
					fee[collection.id] = (collection.product.price * collection.quantity).toFixed(2)
					// 会员价
					memberFee[collection.id] = (collection.product.money * collection.quantity).toFixed(2)
					// 卷
					volume[collection.id] = (collection.product.ticket * collection.quantity).toFixed(2)
					// 处理产品数据
					let product = collection.product
					let cover = product.cover
					if (cover.indexOf('//img.lvye100.com') >= 0) {
						product.cover = cover.replace(
							'//img.lvye100.com/p/',
							'http://img.lvye100.com/pxs/'
						)
					}
					if (product.kind === 1) {
						product.name = '[复]' + product.name
						product.text_color = 'fu'
					} else if (product.kind === 2) {
						product.name = '[报]' + product.name
						product.text_color = 'bao'
					} else if (product.kind === 3) {
						product.name = '[预]' + product.name
						product.text_color = 'yu'
					} else if (product.state === 0) {
						product.name = '[停]' + product.name
						product.text_color = 'ting'
					}
				})
				this.list.quantity = quantity
				this.list.fee = fee
				this.list.memberFee = memberFee
				this.list.volume = volume
			},
			// 统计数量
			totalNumHandle () {
				let total = 0
				Object.values(this.list.quantity).forEach(function (value) {
					total += Number(value)
				})
				this.footer.totalQuantity = total
			},
			// 统计价钱
			totalFeeHandle () {
				let fee = 0
				let f = this.list.fee
				for (let key in f) {
					fee += Number(f[key])
				}
				this.footer.totalFee = fee.toFixed(2)
			},
			// 统计会员价
			totalMemberFeeHandle () {
				let memberFee = 0
				let mf = this.list.memberFee
				for (let key in mf) {
					memberFee += Number(mf[key])
				}
				this.footer.totalMemberFee = memberFee.toFixed(2)
			},
			// 统计会员价
			totalVolumeHandle () {
				let volume = 0
				let v = this.list.volume
				for (let key in v) {
					volume += Number(v[key])
				}
				this.footer.totalVolume = volume.toFixed(2)
			},
			// 复制收藏夹操作
			async copyCollector () {
				let copyResponse = await api.authRequest({
					url: 'collectors/copy',
					method: 'POST',
					data: {
						collector_id: this.option.collector_id
					}
				})
				if (copyResponse.status_code == 403) {
					uni.showModal({
						title: '警告',
						content: copyResponse.message,
						cancelColor: '#09BB07',
						confirmText: '开通会员',
						success: res => {
							if (res.confirm) {
							  uni.navigateTo({url: '/pages/toPay'});
							}
						}
					});
					return false
				}
				uni.showToast({
					title: '复制收藏夹成功',
					icon: 'success',
					duration: 1500
				})
				setTimeout(function () {
					uni.navigateTo({
						url: `/pages/collectionList?collector_id=${copyResponse.collector_id}&state=copy`
					})
				}, 1500)
			}
		},
		onShareAppMessage (res) {
			return {
				// 标题是话题标题
				"title": "绿叶产品价格表",
				// 路径为话题详情路径
				"path": `/pages/collectionShare?user_id=${this.option.user_id}&collector_id=${this.option.collector_id}`,
				"success": function(res) {
					// 转发成功
					console.log(res)
				},
				"fail": function(res) {
					// 转发失败
					console.log(res)
				}
			}
		}
	}
</script>

<style lang="less">
.mylist:odd {
  color: red;
}
.mylist:even {
  color: green;
}
@font-face {
  font-family: 'iconfont';  /* project id 1345172 */
  src: url('//at.alicdn.com/t/font_1345172_knr4cta7ob.eot');
  src: url('//at.alicdn.com/t/font_1345172_knr4cta7ob.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1345172_knr4cta7ob.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1345172_knr4cta7ob.woff') format('woff'),
  url('//at.alicdn.com/t/font_1345172_knr4cta7ob.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1345172_knr4cta7ob.svg#iconfont') format('svg');
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 12px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.icon-edit::before {
  content: "\e621";
}
.icon-copy::before {
  content: "\e880";
}
.icon-delete::before {
  content: "\e60c";
}
.iconDel {
  font-size: 18px;
  position: absolute;
  right: 0.5%;
  top: 30%;
}
.user {
	height: 24px;
  font-size: 20px;
	color: red;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.info {
	height: 24px;
  font-size: 16px;
	color: red;
}
.headTitle {
  color: rgba(16, 16, 16, 1);
  font-size: 18px;
  text-align: left;
  padding-bottom: 8px;
}
.desc {
  width: 100%;
  color: rgba(119, 119, 119, 1);
  font-size: 12px;
  border-bottom: 1px dashed rgba(187, 187, 187, 1);
  padding-bottom: 10px;
}
.desc span {
	width: 100%;
}
.collection {
  padding: 10px 15px 0 15px;
	margin-bottom: 50px;
}
.operation {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #555555;
  text-align: right;
  border-bottom: 1px solid rgba(187, 187, 187, 1);
}
.operation text:nth-child(2) {
  margin: 0 8px;
}
.prodBox {
  padding: 18px 0 15px 3%;
  position: relative;
  border-bottom: 1px dashed rgba(187, 187, 187, 1);
}
.prodImg {
  width: 45px;
  height: 45px;
  display: inline-block;
  border: 1px solid rgba(187, 187, 187, 1);
}
.prodImg img {
  width: 100%;
  height: 100%;
}
.prodMess {
  display: inline-block;
  font-size: 13px;
  width: 80%;
  vertical-align: top;
  margin-left: 8px;
}
.prodNum{
  display: inline-block;
  width: 34px;
  height: 20px;
  line-height: 20px;
  color: #ffffff;
  background: #8ad92f;
  font-size: 12px;
  text-align: center;
  position: absolute;
  right: 0;
  top: 40%;
}
.prodTitle {
  display: inline-block;
  width: 85%;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.prodTitle:nth-child(1) {
  color: #b57c2d;
  font-size: 14px;
}
.numFooter {
  position: fixed;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  border-top: 1px solid rgba(187, 187, 187, 1);
}
.price {
  color: red;
  display: inline-block;
  width: 70%;
  font-size: 12px;
  text-align: right;
  vertical-align: middle;
}
.priceBtn {
  display: inline-block;
  width: 25%;
  vertical-align: middle;
}
.priceBtn span {
  width: 100%;
  height: 25px;
  display: inline-block;
  border-radius: 12px;
  background-color: #8ad92f;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  border: 1px solid #bbbbbb;
  line-height: 25px;
  margin-left: 14%;
}
.fidDalog {
  position: fixed;
  width: 65%;
  height: 185px;
  border: 1px solid rgba(187, 187, 187, 1);
  top: 30%;
  background: #ffffff;
  left: 17.5%;
  text-align: center;
  z-index: 10;
  display: none;
}
.delTip {
  font-size: 60px;
  color: #F8D490;
}
.yesBtn,
.noBtn {
  display: inline-block;
  width: 60px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #ffffff;
  background: #8cd4f5;
  border-radius: 5px;
}
.noBtn {
  background: #c1c1c1;
  margin-left: 10px;
}
.fidDalog view:nth-child(3) {
  margin-top: 15px;
}
.mark {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background: #555555;
  opacity: 0.7;
  display: none;
}
.descBox {
  position: fixed;
  width: 70%;
  max-height: 150px;
  border: 1px solid rgba(187, 187, 187, 1);
  top: 30%;
  background: #ffffff;
  left: 15%;
  text-align: center;
  z-index: 10;
  font-size: 12px;
  display: none;
}
.descMess span{
  padding: 10px 10% 15px 10px;
  line-height: 20px;
  height: 70px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  border-bottom: 1px solid rgba(187, 187, 187, 1);
}
.messTrue {
  height: 35px;
  text-align: center;
  font-size: 15px;
  line-height: 30px;
}
.image {
  width: 100%;
  height: 100%;
}
</style>
