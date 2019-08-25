<template>
	<view class="page">
		<view class="page__bd">
			<view class="weui-toptips weui-toptips_warn" v-if="fail.tipsFlag">{{fail.tipsMessage}}</view>

			<view class="weui-cells__title">标题</view>
			<view class="weui-cells weui-cells_after-title">
				<view class="weui-cell weui-cell_input">
						<view class="weui-cell__bd">
								<input class="weui-input" placeholder="请输入标题" v-model="collector.title" />
						</view>
						<view class="weui-cell__ft" v-if="fail.title || collector.title.length > 32 || collector.title.length <= 0">
								<icon type="warn" size="23" color="#E64340"></icon>
						</view>
				</view>
			</view>

			<view class="weui-cells__title">描述</view>
			<view class="weui-cells weui-cells_after-title">
				<view class="weui-cell">
						<view class="weui-cell__bd">
								<textarea class="weui-textarea" placeholder="请输入描述" maxlength="200" rows="3" v-model="collector.desc" />
								<view class="weui-textarea-counter">{{ collector.desc.length ? collector.desc.length : 0 }}/200</view>
						</view>
				</view>
			</view>

			<view class="weui-cells weui-cells_after-title" style="margin-top: 20px">
				<view class="weui-cell weui-cell_switch">
						<view class="weui-cell__bd">显示会员价</view>
						<view class="weui-cell__ft">
								<switch checked @tap="switchHandle" v-if="collector.show_member == 1"></switch>
								<switch @tap="switchHandle" v-else></switch>
						</view>
				</view>
			</view>

			<view class="weui-btn-area">
					<button class="weui-btn" type="primary" @tap="submit">添加</button>
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
				fail: {
					title: false,
					tipsFlag: false,
					tipsMessage: ''
				},
				collector: {
					title: '',
					desc: '',
					show_member: 1,
					product_id: null
				}
			}
		},
		onLoad(option) {
			this.collector.product_id = option.productId
		},
		computed: {
			...mapState(['collectorListVuex'])
		},
		methods: {
			...mapMutations(['collectorStore', 'refresh', 'setStoreCollector']),
			switchHandle () {
				this.collector.show_member = !this.collector.show_member
			},
			submit () {
				let collector = this.collector
				if (collector.title.length <= 0 || collector.title.length > 32) {
					this.fail.title = true
					this.fail.tipsMessage = '标题不能为空或超过32个字'
					this.showTipsFlag()
					return false
				}
				// 编辑操作
				this.storeCollector()
			},
			// 提示错误
			showTipsFlag () {
				this.fail.tipsFlag = true
				setTimeout(() => {
					this.fail.tipsFlag = false
				}, 2000)
			},
			async storeCollector () {
				let storeResponse = await api.authRequest({
					url: 'collectors',
					method: 'POST',
					data: this.collector
				})
				// 提交的数据有误
				if (storeResponse.errors) {
					this.fail.tipsMessage = '提交的数据错误'
					this.showTipsFlag()
					return false
				}
				// 更新vuex collectorList数据
				let collectorList = this.collectorListVuex.push(storeResponse.data.collector)
				this.collectorStore(JSON.parse(JSON.stringify(collectorList)))
				// 刷新收藏夹列表
				this.refresh(true)
				// 返回产品页
				this.setStoreCollector(this.collector.product_id)
				uni.navigateBack();
			}
		},
		onShareAppMessage (res) {
			return {
				// 标题是话题标题
				"title": "绿叶产品价格表",
				// 路径为话题详情路径
				"path": "/pages/index",
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
</style>
