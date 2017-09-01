import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from 'flux'
import { Track } from 'utils/libs/tongji'
import Auth from 'apis/waiqin/utils/auth'

import loading from 'utils/help/loading'

Vue.use(VueRouter)

import routerCommom from '../../modules/fundament/common/routers/router'
import routerPerformance from '../../modules/waiqin/performance/routers/router'
import routerActivity from '../../modules/waiqin/activity/routers/router'
import routerOauth from '../../modules/waiqin/oauth/routers/router'
import routerBootstrap from '../../modules/waiqin/bootstrap/routers/router'
//import routerAssist from '../assist/routers/router'



let defRouter = [
]

let routerMap = [
  ...routerPerformance,
  ...routerCommom,
  ...routerActivity,
  ...routerOauth,
  ...routerBootstrap,
  ...defRouter
]

//  创建一个路由器实例
//  并且配置路由规则
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: routerMap
})

let indexScrollTop = 0
router.beforeEach(function (to, from, next) {



  loading.show('加载中...')

  if (to.path !== '/') {
    indexScrollTop = document.body.scrollTop
  }
  if ((to.matched.some(record => record.meta.requiresAuth))) {
    if (!Auth.getToken()) {
      next({
        path: '/login'
      })
    } else {
      setTimeout(next, 50)
    }
  } else {
    setTimeout(next, 50)
  }
})

router.afterEach(route => {
  Track.pageView(route.path,route.query);
  loading.close()
  if (route.path !== '/') {
    document.body.scrollTop = 0
  } else {
    Vue.nextTick(() => {
      document.body.scrollTop = indexScrollTop
    })
  }
})

sync(store, router)

export default router
