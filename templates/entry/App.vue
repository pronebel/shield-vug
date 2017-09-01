<template>
  <div class="page-app">
    <transition name="slide-fade">
      <div class="page-router-view">
        <keep-alive>
          <router-view class="page page-no-header" v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view class="page page-no-header" v-if="!$route.meta.keepAlive"></router-view>
        <to-top></to-top>
      </div>
    </transition>
  </div>
</template>
<script type="es6">
  import ToTop from 'widgets/layout/toTop'
  import store from 'flux'
  import Layout from 'utils/help/layout'

  import { appInit, refreshDataTime } from 'apis/waiqin/bizs/global'

  export default {
    data () {
      return {

        navSeed: null
      }
    },
    methods: {
      nav(path){
        this.$router.push(path);
      }
    },
    created: function () {

    },
    mounted(){

      Layout.bindScroll();
      appInit();
    },
    computed: {},
    components: {
      ToTop
    }
  }
</script>
