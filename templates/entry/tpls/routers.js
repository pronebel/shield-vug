import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'

Vue.use(VueRouter)
{{#each mods}}
import router_{{this}} from '../../modules/{{this}}/routers/router'
{{/each}}



let defRouter = [

]

let routerMap = [
  {{#each mods}}
  ...router_{{this}},
  {{/each}}
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
  if (to.path !== '/') {
    indexScrollTop = document.body.scrollTop
  }
  if ((to.matched.some(record => record.meta.requiresAuth))) {
      setTimeout(next, 50)
  } else {
    setTimeout(next, 50)
  }
})

router.afterEach(route => {

  if (route.path !== '/') {
    document.body.scrollTop = 0
  } else {
    Vue.nextTick(() => {
      document.body.scrollTop = indexScrollTop
    })
  }
})

sync(store, router);

export default router;
