import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		isRefresh: false,
		storeCollectorResponseId: null,
		collectorListVuex: []
	},
	mutations: {
		// 添加收藏夹列表
		collectorStore (state, collectors) {
			state.collectorListVuex = collectors
		},
		// 设置是否刷新收藏夹列表
		refresh (state, value) {
			state.isRefresh = value
		},
		// 设置添加收藏夹完成并收藏后返回的产品id
		setStoreCollector (state, id) {
			state.storeCollectorResponseId = id
		}
	},
	actions: {
		
	}
})

export default store
