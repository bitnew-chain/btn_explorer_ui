<template>
  <!--<Icon icon="clipboard" tag="a" :class="clipboard" @click="copy($event)" :title="$t('action.copy')"/>-->
  <Icon icon="clipboard" tag="a" class="clipboard" :title="$t('action.copy')" :data-clipboard-text="string" />
</template>

<script>
  export default {
    name: 'clipboard',
    props: {
      string: {type: String, required: true}
    },
    methods: {
      // copy(e) {
      //   let textarea = document.createElement('textarea')
      //   textarea.textContent = this.string
      //   textarea.style.position = 'fixed'
      //   document.body.appendChild(textarea)
      //   textarea.select()
      //   try {
      //       var eTargrt = e.target;  //点击的目标元素
      //       var allClick = document.querySelectorAll('.break-word.monospace')
      //       for(let i=0; i<allClick.length;i++) {
      //           let currentNextSibling = allClick[i].nextSibling;
      //           if(currentNextSibling){
      //               currentNextSibling.style = "";
      //               currentNextSibling.dataset.ifclick = false
      //           }
      //       }
      //       document.execCommand('copy')
      //       eTargrt.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAAAXNSR0IArs4c6QAAAc9JREFUWAntmL9LAzEUx9+Lp3Wy6iYOujmpm1pEJ8FZZ/8Ah+rkWLD6J1gQnHTwLxEsFkUU0dnJ4lK1W++Hz1S4coaSNGcuVkiWy8t7L/nkm3C5HECfFYx5xq/ORz6ixgoimwOiXNye9omMnoPC7plu/jeQV62sE9EpT57Q7UAWj4AH4fJOWRYj+jB3fTwT+tEdAA2LThO2LhQLg/DQKAwiJSdCQPveZaWcbJPVGQAuygJ0fYi4x/t8S+bpQDG+gSeTyb+v0y1juJYWiitkvgSFYmqoTIDaU0wLlRlQWqj2pu68HM0vnr5SmSoUT1Bn+awA6SyfNaBeoawC9QJlHUgF9SdAMigcqB5FQGAMjJ/u94D03h60l0KA0/z4mopjvbhi6skP0nk+QY3yM9iYMhoE0lAHJJWHO51CTiGVAio/30PZfg+pAES/29SiIqLtFBIVEW2nkKiIaPehQkSZ3stEBVR2HyqkQrbsdwqpBHcK/UuF6ipqe358Yfyvac3egPKR+KdijTEPS4Dgy0OteFuMDZaYv1B85FffTQ71amXY7oPUgeGGv7T91DnHxm5O8s0gXEWIZuETh7rnGW5FbPGb/UOejV40lraahns3090XcWWqqiCrZ2wAAAAASUVORK5CYII=')";
      //       eTargrt.dataset.ifclick = true;
      //       return false;
      //       // setTimeout(()=>{
      //       //     eTargrt.style = ""
      //       // },1000)
      //   } finally {
      //     document.body.removeChild(textarea)
      //   }
      // },
      //鼠标划过变色
      hoverChangeColor(){
          var allLink = document.querySelectorAll('.break-word.monospace')
          for(let i=0; i<allLink.length;i++) {
              allLink[i].onmouseover = function(){
                  let currentNextSibling = this.nextSibling;
                  if(currentNextSibling){
                      currentNextSibling.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAAAXNSR0IArs4c6QAAAdJJREFUWAntmL9LAzEUx997rT+W+mMUB92c1NFJJ8FZBxV0dixUHQtW90Jxc9KlWP8Nty6iiM5OilNrxaGVyzMnnNZAL82ZO09Ilkvy3sv73PeF5DiAlDUMeLaOecTzWotC8BwBDwXzkZ8ED7XC+Jlp/CfQeuVlBYQ4BYYJ0wXC/AngsLY3XgrzUW24XWnNvHvimoGHVaONsSkUdYQ4sgqDyN0vIgAONsuNUvdcWJ+QeSHMwdQmefYRsNEdZwJFDDjZHfzbvtyUV0CwHBVKlth+uyiMRYaKBch/xahQsQFFhSKQxbZftO8VTZWKVaEAywQqESCT8iUG1C9UokD9QCUOpIP6E6AwKNwoNz15uVoDQ4Qbebs2/aT9NHkVT0v/qcA3G3RsPZlh3mStH58GMtCaMiYQYb4OKEwd3+YUcgrpFNDZiWP+HtIBqHa3qVVF1LFTSFVEHTuFVEXUcQoVYnkSpailUKEUqeOjOIV0BXEK/UOFEJ501EnZ5YH4KP/CYj2phLo8jFgnwkwRADs659jtiO2BbKZI57u5O0m1hojPsSftlUBuG5l/tZrP3X/dYzsnPNp8e10iELPAPNgr1ua8AGxjhm6zlLus5rFlc21ra30AJcyktjU8V1kAAAAASUVORK5CYII=')";
                  }
              }

              allLink[i].onmouseout = function(){
                  let currentNextSibling = this.nextSibling;
                  if(currentNextSibling){
                      if(!currentNextSibling.dataset.ifclick || currentNextSibling.dataset.ifclick == 'false'){
                          currentNextSibling.style = ''
                      }else if(currentNextSibling.dataset.ifclick == 'true') {
                          currentNextSibling.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAAAXNSR0IArs4c6QAAAc9JREFUWAntmL9LAzEUx9+Lp3Wy6iYOujmpm1pEJ8FZZ/8Ah+rkWLD6J1gQnHTwLxEsFkUU0dnJ4lK1W++Hz1S4coaSNGcuVkiWy8t7L/nkm3C5HECfFYx5xq/ORz6ixgoimwOiXNye9omMnoPC7plu/jeQV62sE9EpT57Q7UAWj4AH4fJOWRYj+jB3fTwT+tEdAA2LThO2LhQLg/DQKAwiJSdCQPveZaWcbJPVGQAuygJ0fYi4x/t8S+bpQDG+gSeTyb+v0y1juJYWiitkvgSFYmqoTIDaU0wLlRlQWqj2pu68HM0vnr5SmSoUT1Bn+awA6SyfNaBeoawC9QJlHUgF9SdAMigcqB5FQGAMjJ/u94D03h60l0KA0/z4mopjvbhi6skP0nk+QY3yM9iYMhoE0lAHJJWHO51CTiGVAio/30PZfg+pAES/29SiIqLtFBIVEW2nkKiIaPehQkSZ3stEBVR2HyqkQrbsdwqpBHcK/UuF6ipqe358Yfyvac3egPKR+KdijTEPS4Dgy0OteFuMDZaYv1B85FffTQ71amXY7oPUgeGGv7T91DnHxm5O8s0gXEWIZuETh7rnGW5FbPGb/UOejV40lraahns3090XcWWqqiCrZ2wAAAAASUVORK5CYII=')";
                      }
                  }
              }
          }
      }
    },
    mounted(){
        setTimeout(()=>{
            this.hoverChangeColor();
        },20)
    }
  }
</script>

<style lang="less" scoped>
  .clipboard:hover {
    transform: scale(1.2);
  }
  .clipboard{
    display: block;
  }
  .address-link:not(:hover) > .clipboard, .block-link:not(:hover) > .clipboard, .transaction-link:not(:hover) > .clipboard{
    display: block;
  }
  .fa-paste:before, .fa-clipboard:before{
    content: '';
  }
  .fa-paste, .fa-clipboard{
    margin-left:4px;
    width:14px;
    height: 18px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAAAXNSR0IArs4c6QAAAcVJREFUWAntmb1OwzAQx32XpAFKIz4kHgGQWFh4FwaYkECCBd4EBoRgQAwMPAoSzAhY2VvaqrTNx5kEKVVaNXGcJqaDsyTx/3z3y99XV0oYm7MDYp7jW251+701gMBBDhiPFz37lvnzdLb0JTv/D+jwprvh9oNdztCWTZAVX0P2+XjufGTFTGp4es2XvQHtlQ0TFXKJbR5cdrYmi2bdY3PY3qYSliitiCwUErCVtGRFxsGkN4NxLzlXBgqBcCE5edZrdLFtAz0XhZr51zTtAR4uVr+LQlUCFEEWhaoMqChUuAf6o81xmv2zjsk6ValD8cPIQCkBklk+ZUB5oZQC5YFSDiSC+hegLCgzEks9asHO/lVn7L8sLf8gFIjIZxysOKZ0oMA3nDh5vvP4Io3f5ctQaZQGEtmrHdIOiRwQ6WEPlb4ViWpm6rqpM+0JRe2QdkjkgEjXPaQdEjkg0nUPaYdEDoj0+eshYDQUUavSgXlDNBFaqgoK66DZQrvhvAP3uTC44gAETvWQBe+PoItG7YWR51ZcMzV91DYAg9eIZfR+Mfr40mr31i07aJTx8SW1ekKg0BXOjU5jsd68O4FcLygS09Vc/gJEUc/ivCQ0mAAAAABJRU5ErkJggg==") no-repeat center;
    background-size: 100% 100%;
  }

</style>
