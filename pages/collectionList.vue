<template>
	<view style="background: #fff">
	  <view class="collection">
	    <view class="headTitle">
	      <text>{{ collector.title }}</text>
	    </view>
	    <view class="desc">
	      <span>{{ collector.desc }}</span>
	    </view>
	    <view class="operation">
	      <navigator :url="'/pages/collectorEdit?collector_id=' + collector.id" class="iconfont icon-edit" style="display: initial !important;">编辑</navigator>
	      <text class="iconfont icon-delete" @tap="delCollectorHandle">删除</text>
	    </view>
	    <!-- 产品列表 -->
	    <view class="prodList" v-for="(collection, index) in collections" :key="index">
	      <view class="prodBox">
	        <view class="prodImg">
	          <img :src="collection.product.cover" alt="" class="image">
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
	        <view class="prodFoot">
	          <text class="rud" @tap="subNum(collection)">-</text>
	          <text class="prodNum">{{ list.quantity[collection.id] }}</text>
	          <text class="add" @tap="addNum(collection)">+</text>
	          <text class="unit">单位: {{ collection.product.min_unit }}</text>
	        </view>
	        <text class="iconfont iconDel icon-iconDel" @tap="delCollectionHandle(collection.product.id)"></text>
	      </view>
	    </view>
	  </view>
	  <!-- 确认数量footer -->
	  <view class="numFooter">
	    <view class="price">
	      <view>总数量：{{ footer.totalQuantity }}</view>
	      <view class="prodTitle" v-if="!collector.show_member">零售：{{ footer.totalFee }}元</view>
	      <view class="prodTitle" v-else>零售:{{ footer.totalFee }}元, 会员:{{ footer.totalMemberFee }}元+{{ footer.totalVolume }}券</view>
	    </view>
	    <view class="priceBtn">
	      <text @click="updateCollectionHandle">确认数量</text>
	    </view>
	  </view>
	  <!-- 删除弹窗 -->
	  <view class="mark" v-if="delShow"></view>
	  <view class="fidDalog" v-if="delCollectorShow">
	    <view>
	      <text class="iconfont delTip icon-delTip"></text>
	    </view>
	    <view>你确定要删除此收藏夹吗？</view>
	    <view>
	      <text class="yesBtn" @tap="delCollectorHandle('del')">确定</text>
	      <text class="noBtn" @tap="delCollectorHandle()">取消</text>
	    </view>
	  </view>
	  <view class="fidDalog" v-if="delCollectionShow">
	    <view>
	      <text class="iconfont delTip icon-delTip"></text>
	    </view>
	    <view>你确定要删除此产品吗？</view>
	      <view>
	        <text class="yesBtn" @tap="delCollectionHandle(delProductId, 'del')">确定</text>
	        <text class="noBtn" @tap="delCollectionHandle()">取消</text>
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
				collector_id: null,		// 当前收藏夹id
				collector: [],				// 当前收藏信息
				collections: [],			// 收藏列表
				delShow: false,
				delCollectorShow: false,
				delCollectionShow: false,
				delCollectionId: null,		// 需要删除的收藏id
				delProductId: null,				// 需要删除的产品id
				option: {},
				state: null,							// 复制收藏夹状态
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
		async onLoad(query) {
		  this.collector_id = query.collector_id
			this.state = query.state
			await this.getCollections()
			this.statistics()
		},
		async onShow() {
		  this.getCollector(this.collector_id)	// 从缓存获取当前收藏夹
		},
		computed: {
			...mapState([ 'collectorListVuex' ])
		},
		methods: {
			...mapMutations(['refresh']),
			// 获取收藏夹下的收藏列表
			async getCollections() {
				let quantity = {}
				let fee = {}
				let memberFee = {}
				let volume = {}
				this.option.collector_id = this.collector_id
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
			// 获取当前收藏夹
			async getCollector (collectorId) {
				if (this.state == 'copy') {
					this.collector = await api.authRequest({
						url: 'collectors/' + this.option.collector_id,
						method: 'GET'
					})
				} else {
					let collector = this.collectorListVuex
					this.collector = collector.find(function (value) {
						if (value.id == collectorId) {
							return value
						}
					})
				}
				uni.setNavigationBarTitle({
					title: this.collector.title
				})
			},
			// 删除收藏夹
			delCollectorHandle (option = 'show') {
				if (option === 'del') {
					api.authRequest({
						url: 'collectors/' + this.collector_id,
						method: 'DELETE'
					})
					// 刷新收藏夹列表
					this.refresh(true)
					uni.showToast({
						title: '删除收藏夹成功！',
						icon: 'success',
						duration: 1000,
						mask: true
					})
					setTimeout(function () {
						uni.navigateBack({})
					}, 1000)
				}
				this.delShow = !this.delShow
				this.delCollectorShow = !this.delCollectorShow
				
			},
			// 删除产品收藏
			async delCollectionHandle (productId, option = 'show') {
				var _this = this
				var isShowToast = false
				this.delProductId = productId
				if (option === 'del') {
					let collectionId = await api.authRequest({
						url: 'collections/' + productId,
						method: 'DELETE'
					})
					this.delCollectionId = collectionId
					isShowToast = true
				}
				this.delShow = !this.delShow
				this.delCollectionShow = !this.delCollectionShow
				if (isShowToast) {
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					})
					// 删除页面列表中的数据
					let findCollection = this.collections.findIndex(value => {
						if (value.product_id == productId) {
							return value
						}
					})
					this.collections.splice(findCollection, 1)
					this.refresh(true)		// 刷新收藏夹列表
					// 更新底数数据
					delete this.list.quantity[this.delCollectionId]
					delete this.list.fee[this.delCollectionId]
					delete this.list.memberFee[this.delCollectionId]
					delete this.list.volume[this.delCollectionId]
					this.statistics()
				}
			},
			// 加数量
			addNum (collection) {
				this.list.quantity[collection.id] ++
				this.list.fee[collection.id] = (Number(this.list.fee[collection.id]) + Number(collection.product.price)).toFixed(2)
				this.list.memberFee[collection.id] = (Number(this.list.memberFee[collection.id]) + Number(collection.product.money)).toFixed(2)
				this.list.volume[collection.id] = (Number(this.list.volume[collection.id]) + Number(collection.product.ticket)).toFixed(2)
				this.statistics()
			},
			// 减数量
			subNum (collection) {
				if (this.list.quantity[collection.id] == 1) {
					uni.showToast({title: '数量不能等于小于0', icon: 'none'})
					return false
				}
				this.list.quantity[collection.id] --
				this.list.fee[collection.id] = (Number(this.list.fee[collection.id]) - Number(collection.product.price)).toFixed(2)
				this.list.memberFee[collection.id] = (Number(this.list.memberFee[collection.id]) - Number(collection.product.money)).toFixed(2)
				this.list.volume[collection.id] = (Number(this.list.volume[collection.id]) - Number(collection.product.ticket)).toFixed(2)
				this.statistics()
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
			// 统计
			statistics () {
				this.totalNumHandle()   				// 统计数量
				this.totalFeeHandle()   				// 统计总价
				this.totalMemberFeeHandle()   	// 统计会员价
				this.totalVolumeHandle()   			// 统计优惠劵
			},
			// 修改收藏的数量
			async updateCollectionHandle () {
				let updateList = await api.authRequest({
					url: 'collections/update_list',
					method: 'PUT',
					data: {
						list: this.list.quantity
					}
				})
				if (updateList.status_code == 403) {
					uni.showToast({
						title: updateList.message,
						icon: 'none'
					});
					return false
				}
				uni.showToast({
					title: '操作成功',
					icon: 'success'
				});
			}
		},
		// 重新加载
		async onPullDownRefresh() {
			await this.getCollections()
			uni.stopPullDownRefresh()
		},
		onShareAppMessage (res) {
			return {
				// 标题是话题标题
				"title": "绿叶产品价格表",
				// 路径为话题详情路径
				"path": `/pages/collectionShare?user_id=${uni.getStorageSync('user_id')}&collector_id=${this.option.collector_id}`,
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

<style>
	.mylist:odd {
	  color: red;
	}
	.mylist:even {
	  color: green;
	}
	@font-face {
	  font-family: 'iconfont';  /* project id 1345172 */
	  src: url('https://at.alicdn.com/t/font_1345172_knr4cta7ob.eot');
	  src: url('https://at.alicdn.com/t/font_1345172_knr4cta7ob.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1345172_knr4cta7ob.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1345172_knr4cta7ob.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1345172_knr4cta7ob.ttf') format('truetype'),
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
	.icon-show::before {
	  content: "\e621";
	}
	.icon-edit::before {
	  content: "\e622";
	}
	.icon-delete::before {
	  content: "\e600";
	}
	.icon-iconDel::before {
	  content: "\e607";
	}
	.icon-delTip::before {
	  content: "\e60c";
	}
	.iconDel {
	  font-size: 18px;
	  position: absolute;
	  right: 0.5%;
	  top: 23%;
	  color: red;
	}
	.headTitle {
	  /*width: 200px;*/
	  /*height: 24px;*/
	  color: rgba(16, 16, 16, 1);
	  font-size: 18px;
	  text-align: left;
	  padding-bottom: 8px;
	  /*overflow: hidden;*/
	  /*white-space: nowrap;*/
	  /*text-overflow: ellipsis;*/
	}
	.desc {
	  width: 100%;
	  color: rgba(119, 119, 119, 1);
	  font-size: 12px;
	  border-bottom: 1px dashed rgba(187, 187, 187, 1);
	  padding-bottom: 10px;
	}
	
	.collection {
	  padding: 10px 15px 0 15px;
	  margin-bottom: 45px;
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
	  margin: 0 0 0 12px;
	}
	.prodBox {
	  padding: 18px 0 40px;
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
	
	.prodTitle {
	  display: inline-block;
	  width: 90%;
	  font-size: 12px;
	  overflow: hidden;
	  white-space: nowrap;
	  text-overflow: ellipsis;
	}
	.prodTitle:nth-child(1) {
	  color: #b57c2d;
	  font-size: 14px;
	}
	.prodFoot {
	  font-size: 13px;
	}
	.prodFoot > text {
	  float: right;
	  border-radius: 4px;
	}
	.add,
	.rud,
	.prodNum {
	  display: inline-block;
	  width: 20px;
	  height: 20px;
	  line-height: 20px;
	  text-align: center;
	  font-size: 13px;
	  border: 1px solid rgba(187, 187, 187, 1);
	}
	.unit {
	  margin-right: 30px;
	}
	.prodNum {
	  width: 40px;
	  margin: 0 8px;
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
	  width: 75%;
	  font-size: 12px;
	  text-align: right;
	  vertical-align: middle;
	}
	.priceBtn {
	  display: inline-block;
	  width: 25%;
	  vertical-align: middle;
	}
	.priceBtn text {
	  width: 60px;
	  height: 25px;
	  display: inline-block;
	  border-radius: 12px;
	  background-color: #8ad92f;
	  color: #ffffff;
	  font-size: 12px;
	  text-align: center;
	  border: 1px solid #bbbbbb;
	  line-height: 25px;
	  margin-left: 18%;
	}
	.fidDalog {
	  position: fixed;
	  width: 65%;
	  height: 185px;
	  border: 1px solid rgba(187, 187, 187, 1);
	  top: 23%;
	  background: #ffffff;
	  left: 17.5%;
	  text-align: center;
	  z-index: 10;
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
	}
	.descMess span{
	  padding: 10px 10px 15px 10px;
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
