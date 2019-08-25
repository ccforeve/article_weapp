<template>
  <view class="page">
    <official-account></official-account>
    <view class="page__bd">
      <view class="weui-grids">
        <view v-for="(category, key) in categories" :key="key">
          <navigator :url="'/pages/productList?category_id=' + category.online_id" class="weui-grid" hover-class="weui-grid_active">
            <image class="weui-grid__icon" :src="category.cover" />
            <view class="weui-grid__label">{{category.name}}</view>
            <view class="label-text">({{ category.products_count }}种)</view>
          </navigator>
        </view>
      </view>
    </view>
    <ad unit-id="adunit-339b94eca8c9de27"></ad>
  </view>
</template>

<script>
	import api from '@/utils/request'
	
	export default {
		data() {
			return {
				categories: []
			}
		},
		async onLoad() {
			let productCategories = await api.request('product_categories')
			this.categories = productCategories.data
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
  .weui-grid_active {
    background-color:#ECECEC
  }
  .weui-grid {
    position:relative;
    float:left;
    padding:10px 10px;
    width:33.33333333%;
    text-align:center;
    box-sizing:border-box;
    border-right:1rpx solid #D9D9D9;
    border-bottom:1rpx solid #D9D9D9;
  }
  navigator {
    height:auto;
    width:auto;
    display:block;
  }
  image {
    width: 3.5rem !important;
    height: 3.5rem !important;
  }
  .weui-grid__label {
    font-size: .7rem;
  }
  .label-text {
    font-size: .6rem;
    color: #777;
  }
</style>
