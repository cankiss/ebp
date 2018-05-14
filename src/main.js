import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import filters from '@/config/filter'
import axios, { _post, _mine } from '@/config/ajax'
import iView from 'iview'
import Meta from 'vue-meta'
import './assets/css/common.less'

import 'babel-polyfill'

iView.LoadingBar.config({
    color: "#ff9800",
    failedColor: "#ff3300",
    height: 3
});

iView.Message.config({
    top: 80
});

Vue.prototype.$http = axios
Vue.prototype.$post = _post
Vue.prototype.$mine = _mine

Vue.use(Meta)
Vue.use(router)
Vue.use(iView)

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})