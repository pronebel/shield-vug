import Vue from 'vue'

import VueResource from 'vue-resource'

import Vue2Touch from 'utils/libs/touch'



import App from './App'
import router from './routers'

import 'styles/mint-adaptor/mint.less'
import 'styles/mint-adaptor/mint-rem.less'
import 'styles/mint-adaptor/index.less'

import 'styles/main.less'
import 'styles/activity/index.less'

import 'styles/assist/index.less'

//  开启debug模式
Vue.config.debug = ZIJIN.debug
Vue.use(Vue2Touch)
Vue.use(VueResource)


document.addEventListener('DOMContentLoaded', function () {
  if (window.FastClick) window.FastClick.attach(document.body)
}, false)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
