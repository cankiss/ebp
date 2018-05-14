import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({})
    //updata is wrong,I'm sorry to spell

store.registerModule('loginStatus', {
    state: {
        isLogin: false
    },
    mutations: {
        updataLoginStatus(state, payload) {
            state.isLogin = payload.isLogin
        }
    }
})

store.registerModule('loanChecked', {
    state: {
        isChecked: false
    },
    mutations: {
        updataIsChecked(state, payload) {
            state.isChecked = payload.isChecked
        }
    }
})

store.registerModule('buttonLoading', {
    state: {
        isLoading: false
    },
    mutations: {
        updataButtonStatus(state, payload) {
            state.isLoading = payload.isLoading
        }
    }
})

export default store