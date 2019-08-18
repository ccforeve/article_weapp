import Vuex from '@wepy/x'

export default new Vuex.Store({
  state: {
    collectorListVuex: []
  },
  mutations: {
    collectorStore (state, collectors) {
      // 添加收藏夹列表
      state.collectorListVuex = collectors
    }
  },
  actions: {
    increment ({ commit }) {
      commit('increment')
    },
    decrement ({ commit }) {
      commit('decrement')
    }
  }
})
