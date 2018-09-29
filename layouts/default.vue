<template>
  <div id="app">
    <div class="header-container-wrap" id="headerContainerwrap">
      <header class="header-container">
        <Navigator />
      </header>
    </div>
    <div class="background">
      <!--<div class="container">-->
        <!--<Breadcrumb v-if="$route.path !== '/'" />-->
      <!--</div>-->
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
  import Navigator from '@/components/nav.vue'
  import Breadcrumb from '@/components/breadcrumb/index.vue'
  import Footer from '@/components/footer.vue'

  export default {
    head() {
      return {
        htmlAttrs: {
          lang: this.$store.state.locale.language
        }
      }
    },
    components: {Navigator, Breadcrumb, Footer},
      methods:{
        //吸顶
        fixTop(){
            var oNav = document.getElementById('headerContainerwrap');
            var oHeaderHe = document.getElementsByClassName('header-container')[0].clientHeight + 50;
            window.onscroll = function() {
                // 获取当前页面的滚动条纵坐标位置 （依次为火狐谷歌、safari、IE678）
                var scrollT = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if (scrollT >= oHeaderHe) {
                    if (window.navigator.userAgent.indexOf('MSIE 6.0') != -1) {
                        // 兼容IE6代码
                        oNav.style.position = 'absolute';
                        oNav.style.top = scrollT + 'px';
                        oNav.style.left = 0 + 'px';
                        oNav.style.zIndex = 2;
                    } else {
                        // 正常浏览器代码
                        oNav.style.position = 'fixed';
                        oNav.style.top = 0;
                        oNav.style.left = 0;
                        oNav.style.zIndex = 2;
                    }
                } else{
                    oNav.style.position = 'static';
                    oNav.style.zIndex = 1;
                }
            }
        }
      },
      mounted(){
        setTimeout(()=>{
            this.fixTop()
        },0)
      }
  }
</script>

<style scoped>
  .header-container,.header-container-wrap{
    width:100%;
    box-shadow: 0px 0px  10px 3px rgba(140,147,200,0.19);
  }
  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .background {
    flex: 1;
    padding: 20px 0 6.0rem;
    background-color: #f5f6f8;
  }
  .header-container-wrap{
    z-index:1
  }
</style>
