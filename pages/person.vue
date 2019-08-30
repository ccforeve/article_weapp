<template>
  <view>
    <view class="person-head">
			<view class="cmd-avatar cmd-avatar-lg">
				<image class="cmd-avatar-img" :src="user.avatar"></image>
			</view>
      <view class="person-head-box">
        <view class="person-head-nickname">{{ user.nickname }}</view>
        <view class="person-head-username">手机号：{{ user.phone }}</view>
				<view class="person-head-username">微信：{{ user.wechat }}</view>
      </view>
    </view>
    <view class="person-list">
			<navigator url="/pages/userBase" class="cmd-cell-item" hover-class="cmd-cell-item-hover">
				<view class="cmd-cell-item-body">
					<view class="cmd-cell-item-left">
						<view class="icon icon-base" style="color:#64E635;font-size:24px;line-height:24px"></view>
					</view>
					<view class="cmd-cell-item-content">
						<view class="cmd-cell-item-title">基本信息</view>
					</view>
					<view class="cmd-cell-icon-arrow-right">
						<view class="icon icon-right" style="color:#C5CAD5;font-size:22px;line-height:24px"></view>
					</view>
				</view>
			</navigator>
			<navigator url="/pages/collector" class="cmd-cell-item" hover-class="cmd-cell-item-hover">
				<view class="cmd-cell-item-body">
					<view class="cmd-cell-item-left">
						<view class="icon icon-collector" style="color:#64E635;font-size:24px;line-height:24px"></view>
					</view>
					<view class="cmd-cell-item-content">
						<view class="cmd-cell-item-title">收藏夹</view>
					</view>
					<view class="cmd-cell-icon-arrow-right">
						<view class="icon icon-right" style="color:#C5CAD5;font-size:22px;line-height:24px"></view>
					</view>
				</view>
			</navigator>
    </view>
  </view>
</template>

<script>
  export default {
		data () {
			return {
				user: null
			}
		},
		onShow() {
			this.user = uni.getStorageSync('user')
		}
  }
</script>

<style>
	@font-face {
	  font-family: 'iconfont';  /* project id 1377547 */
	  src: url('//at.alicdn.com/t/font_1377547_zy0wnp2t5z.eot');
	  src: url('//at.alicdn.com/t/font_1377547_zy0wnp2t5z.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_1377547_zy0wnp2t5z.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_1377547_zy0wnp2t5z.woff') format('woff'),
	  url('//at.alicdn.com/t/font_1377547_zy0wnp2t5z.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_1377547_zy0wnp2t5z.svg#iconfont') format('svg');
	}
	.icon {
		display: inline-block;
		font-family: iconfont;
		font-style: normal;
		font-weight: 400;
		font-variant: normal;
		text-transform: none;
		text-rendering: auto;
		text-align: center;
		line-height: 1;
		-webkit-font-smoothing: antialiased;
		vertical-align: middle;
	}
	.icon-collector::before {
		content: "\e610";
	}
	.icon-right::before {
		content: "\e62e";
	}
	.icon-base::before {
		content: "\e6bf";
	}
  .person-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 150px;
    padding-left: 20px;
    background: linear-gradient(to right, #64E635, #8EE627);
  }
  .person-head-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-left: 10px;
  }
  .person-head-nickname {
    font-size: 18px;
    font-weight: 500;
    color: #fff;
  }
  .person-head-username {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }
  .person-list {
    line-height: 0;
  }
	.cmd-avatar {
		color: #fff;
		text-align: center;
		border-radius: 6upx;
		background: #eee;
		box-shadow: 0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12);
		overflow: hidden;
		background-color: #fff;
		border-radius: 50%;
	}
	.cmd-avatar-img {
		width: 100%;
		height: 100%;
	}
	.cmd-avatar-lg {
		width: 128upx;
		height: 128upx;
		font-size: 64upx;
		line-height: 128upx;
	}
	.cmd-cell-item {
		position: relative;
	}
	
	.cmd-cell-item.no-border .cmd-cell-item-body::before {
		display: none;
	}
	
	.cmd-cell-item-body {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 100upx;
		padding-top: 20upx;
		padding-bottom: 20upx;
		margin-left: 20upx;
		margin-right: 20upx;
		box-sizing: border-box;
	}
	
	.cmd-cell-item-body::before {
		content: '';
		position: absolute;
		z-index: 2;
		background-color: #E2E4EA;
		transform-origin: 100% 50%;
		transform: scaleY(0.5) translateY(100%);
		bottom: 0;
		left: 0;
		right: auto;
		top: auto;
		width: 100%;
		height: 2upx;
		transform-origin: 50% 100%;
	}
	
	.cmd-cell-item-left {
		flex-shrink: 0;
		margin-right: 32upx;
	}
	
	.cmd-cell-item-content {
		flex: 1 1 0%;
		color: #111A34;
		font-size: 32upx;
		line-height: 1.2;
	}
	
	.cmd-cell-item-right {
		flex-shrink: 0;
		margin-left: 12upx;
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		color: #858B9C;
		font-size: 32upx;
	}
	
	.cmd-cell-item-right .cmd-cell-icon-arrow-right {
		margin-left: 6upx;
		margin-right: -6upx;
		color: #C5CAD5;
	}
	
	.cmd-cell-item.is-disabled .cmd-cell-item-content,
	.cmd-cell-item.is-disabled .cmd-cell-item-left,
	.cmd-cell-item.is-disabled .cmd-cell-item-right,{
		color: #C5CAD5;
	}
	
	.cmd-cell-item-hover {
		background: #E5E5E5;
	}
</style>
