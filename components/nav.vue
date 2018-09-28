<template>
  <div class="navbar-container">
    <nav class="navbar">
      <div class="navbar-brand is-size-4">
        <nuxt-link to="/" class="navbar-item navbar-logo">
          <div class="logo-image"></div>
        </nuxt-link>
        <button type="button" class="button navbar-burger" @click="showMenu = !showMenu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="navbar-menu" :class="{'is-active': showMenu}">
        <div class="navbar-start is-uppercase">
          <!--<AttributeInjector class="navbar-item" @click.native="showMenu = !showMenu">-->
            <!--<nuxt-link to="/block">{{ $t('blockchain.blockchain') }}</nuxt-link>-->
           <!-- <nuxt-link to="/contract/tokens">{{ $tc('blockchain.token') }}</nuxt-link> -->
           <!-- <nuxt-link to="/misc/rich-list">{{ $t('misc.rich_list_title') }}</nuxt-link>-->
          <!--</AttributeInjector>-->
        </div>
        <form class="navbar-end" @submit.prevent="search">
          <div class="navbar-item input-item">
            <input type="text" class="input" v-model="searchString" :placeholder="$t('nav.search')">
            <button type="submit" class="button is-btn" :class="{'is-loading': searching}">
              <Icon icon="search" />
            </button>
          </div>
        </form>

      </div>
      <div class="navbar-start is-uppercase">
        <nuxt-link to="/contract/tokens">{{ $tc('blockchain.token') }}</nuxt-link>
      </div>

      <div class="naver-selectcon">
        <div @click="ifshowlanguage = !ifshowlanguage" class="naver-select"><i class="naver-icon" :class="[{'changearrow':ifshowlanguage}]"></i>{{typelang}}</div>
        <ul class="showlanguage" v-if="ifshowlanguage">
          <li @click="changeLan('zh',$event)">简体中文</li>
          <li @click="changeLan('en',$event)">English</li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
  import "@/styles/variables.less"
  import {get as btnorgGet} from '@/services/btnorg-api'

  export default {
    data() {
      return {
        showMenu: false,
        searchString: '',
        searching: false,
        typelang:'',
        ifshowlanguage:false
      }
    },
    async created(){
        //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
        //根据浏览器cookie初始化 select默认选中的值
        const lang = await this.getCookie('lang') || 'zh'
        const showLang = lang == 'zh' ? '简体中文' : 'English'
        this.typelang = showLang

    },
    mounted(){
      setTimeout(()=>{
          this.renderLan();
          this.showAndHide();
      },0)

    },
    methods: {
      async search() {
        let searchString = this.searchString.trim()
        if (!searchString || this.searching) {
            alert('搜索地址不能为空')
          return
        }
        this.searching = true
        try {
          let {type, id} = await btnorgGet(`/search/${searchString}`)
          switch (type) {
          case 'address':
            this.searchString = ''
            this.$router.push(`/address/${searchString}`)
            break
          case 'block':
            this.searchString = ''
            this.$router.push(`/block/${searchString}`)
            break
          case 'contract':
            this.searchString = ''
            if (id) {
              this.$router.push(`/contract/${id}`)
            } else {
              this.$router.push(`/contract/${searchString}`)
            }
            break
          case 'transaction':
            this.searchString = ''
            this.$router.push(`/tx/${searchString}`)
            break
          }
        } catch (err) {}
        this.showMenu = false
        this.searching = false
      },
      async changeLan(languagetype,event){
          if(languagetype == 'zh'){
              this.$i18n.locale = 'zh';
              this.setCookie('lang','zh')
          }else{
              this.$i18n.locale = 'en';
              this.setCookie('lang','en')
          }
          this.typelang = event.target.innerText
          this.ifshowlanguage = false
      },
      async renderLan(){
          //根据浏览器cookie显示 中英文
          const lang = await this.getCookie('lang') || 'zh'
          if(lang == 'zh'){
              this.$i18n.locale = 'zh';
              this.setCookie('lang','zh')

          }else{
              this.$i18n.locale = 'en';
              this.setCookie('lang','en')

          }
      },
      async setCookie(name, value) {
          var exp = new Date();
          exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
          document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/"
      },
      async getCookie(c_name) {
          if (document.cookie.length > 0) {
              var c_start = document.cookie.indexOf(c_name + "=");
              if (c_start > -1) {
                  c_start = c_start + c_name.length + 1;
                  var c_end = document.cookie.indexOf(";", c_start);
                  if (c_end == -1) {
                      c_end = document.cookie.length
                  }
                  return unescape(document.cookie.substring(c_start, c_end))
              }
          }
          return ""
      },
      //点击[语言选择]区域外的地方隐藏日期选择
      async showAndHide(){
          var that = this;
          document.addEventListener('click',function(event){
              try{
                  let dateClass = document.getElementsByClassName('naver-selectcon')[0]
                  if(!dateClass.contains(event.target)){
                      that.ifshowlanguage = false;
                  }
              }catch(error){

              }

          })
      }
    }
  }
</script>

<style lang="less" scoped>
  body,html{
    width:100%;
  }
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  input{
    outline: none;
    border:none;
    -webkit-appearance: none;
    box-shadow: none;
    &:focus {
      outline: none;
    }
  }
  select{
    background-color: #fff;
  }
  .navbar{
    margin: 0 auto;
    background-color:#fff;
  }
  .logo-image{
    width:128px;
    height:34px;
    background: url('data:image/png;base64,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') no-repeat center;
    background-size:100% 100%;
    margin-right:110px;
  }
  .navbar-container{
    width:100%;
    background-color: #fff;
    font-family:@fontfamily!important;
    padding-top:12px;
    padding-bottom:12px;
  }
  .navbar-end .navbar-item button{
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABIdJREFUaAXFmUuIFUcUhr0+MCPoBIXBqCAM6mShYXCRRTRuDIgPBvGBbl3pJsxSfO3ElSsDgbgwZhMxGREVHBR8IOJCEcWVo6MoanwbY4gSHzN+v94Za45Vdat7uu/94af7nDp1Tp3urrqn6lZG5ER/f/8Yun4Pl8BZcDL8CrbAF/A+fADvwpOwu1KpPOXaWDDwRfAP+A/MgrcYn4WdsKnuWRD0O3gaFoF7ONkA9RbLBUEmwYOwDPTidMFwMqjEOuN8Nu2HYGvMjjZ977er10dcx0PNhylwJhwJQ3hDw4/Mj19CBrn0DH45/BeGcJmGLfCbWADaW+A6qLeoeRDCzzQU80nhSIPvC0S6in5FbNChNvq1wa6AX6n3hfom63EyG/qe/Dv0m+CoZGcBQ3zMh39BH7YFutVW400T9obHq5bMpbU9pFvgbwo874mlN78q3ZNjSUffaqPBR79zx0WmW/x+AU9Bi79RTMrqTOu8hT6bQp+8HRT+9dZv2sDIP1nbqEwH34/UpminghqJPQf+B128Qfg6KQSGKg8stNoMe8ImDQAjYm23A0D+Lak/hqptLFYmdS7IiODN8JkZxAvkeN2EwRhoC7PLBY0rkxvGsRVaRFck/cSrJJ5gInUZuV7ifk+g1R7dJxXp7rQpI5eybH6KGr4jdo8Zz/Ww9cciS5sRFw8orK64ijrfHzPxWklorNENivqEtJNyoaqykbhpgmuMbUY3KKpRZa8LlcaNhLahFvYhD7YrAe1hXTx0hQbcaz9h0WcVA7IS0AbchV2R3LZ63Pvivw0FVgL2ldlPKtS3LL3vc9GuzQslYL95bQMbCV/83tCAlIDObVzMYNmy88JtL/vebvK1rAfnpRI4aUYk3TKjq4vIg/uSQPNMsGhZo8F2w3emU4eR6yUuJtBoE+yMkT8XyVwnZi50epBWi3/uLpeGeBV4yR0E99pQTavpEKNO01HigZodCzQg3hrPGI4nhaBjE9Rxn4Uq1dJB0HHwmg2OHK9E3ZFhrLNKCx19THXtir7Hvz6dP21g5HNqS46HsTY2vdDiAoqmZEcZDfG9zQZE1rc/N6OrD/vSBXR87XGoDX+2Y46E6PjUDsx3ArgnobvfBIfroQ86+tBh77CBH825/b4gVd0Tru25A9FZB60+6OhDpwfNeZzTT9/7auibsKiHIH8SuNF8+H2Iu6GCnG+GOjqvCex04rAWaj5lQc0korOcSBsZ3Q6oX+wQrtKgbeAtqMJQ9bxKYlW1okoD1Td5j871v9oP1EPRkgIbP0hiKbTHLlmeYsxWq81e+DRmRFvNN+EffVWLA/1JsQv+D4vCRRx9qxBc22G5SVQDTSfQr/AVzIsTdFwFhxxbIqckoSTzr07VF6Inpp/+Drgb3oUxPKfxKNSfI20DPnxX2jMnEZ3EviA+HYHHodeE1XZQm6GXUJPvMbzDBOzjmgQlgeEJODHS4RltC3NP7IjjQpoyvInWQgKW4SQxicNlxC7MZ0ISzwsLVpajGkn0lBW3UL+RJNYXGqhMZyShU+ojUMuyjuA/DP49pQCX95/AJIAAAAAASUVORK5CYII=) no-repeat center;
    background-size:16px 16px;
    background-color: #657EFF;
  }
  @media screen and (min-width: 1300px) {
    .navbar {
      box-sizing: border-box;
      max-width: 1300px;
      width: 1300px;
      padding-left:2.4rem;
    }
  }
  .input{
    border: 1px solid #D5DBE5;
    border-radius: 2px;
    &:focus{
      border: 1px solid #D5DBE5;
    }
  }
  .is-btn{
    background: #657EFF;
    border-radius:0;
    width:80px;
    content:'';
    &:hover{
      border:none;
    }
  }
  .naver-selectcon{
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    min-height: 52px;
    min-height: 3.25rem;
    margin-left:54px;
    margin-right:60px;
    position: relative;
  }
  .showlanguage{
    box-shadow: 0px 0px 10px 3px rgba(140, 147, 200, .19);
    position: absolute;
    left:0;
    top:3.25rem;
    z-index:9999;
    li{
      @fontfamily:PingFangSC-Regular,pingfangsc;
      width:146px;
      height:40px;
      line-height: 40px;
      font-size:14px;
      text-align: center;
      background-color:#fff;
      cursor: pointer;
      &:hover{
        background-color:#657EFF;
        color:#fff;
      }
    }
  }
  .naver-select{
    cursor: pointer;
    text-align: left;
    border: 1px solid #D5DBE5;
    border-radius: 5px;
    width:146px;
    height:40px;
    line-height: 40px;
    font-size: 14px;
    color: #0B224B;
    padding-left:38px;
    position: relative;
    @fontfamily:PingFangSC-Regular,pingfangsc;

  }
  .naver-icon{
    width:12px;
    height:8px;
    position: absolute;
    top:17px;
    right:32px;
    background: url("data:image/png;base64,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") no-repeat center;
    background-size:100% 100%;
    transition:all 0.3s;
    &.changearrow{
      transform: rotateZ(180deg);
    }
  }
  .fa-search:before{
    content:'';
  }
  .navbar-logo {
    display: inline-block;
    .btn-icon {
      vertical-align: middle;
    }
  }
  .navbar-end {
    flex: auto;
    align-items: center;
    .navbar-item {
      flex: auto;
      position: relative;
      input {
        padding-right: 3em;
        font-family:@fontfamily!important;

      }
      button {
        position: absolute;
        top: 0.5em;
        right: 1em;
      }
    }
  }
  .navbar-menu {
    box-shadow: none;
  }
  a.navbar-item:hover, a.navbar-item.is-active, a.navbar-link:hover, a.navbar-link.is-active{
    background-color:#fff;
  }
  .nuxt-link-exact-active.nuxt-link-active{
    display:inline-block;
    height: 52px;
    line-height: 52px;
  }
</style>
