<template>
  <div class="container">
    <!--增加排行版等模块-->
    <section class="introduce-detail-wrap" id="introduceDetailwrap">
      <div class="introduce-detail-title">
        {{ $t('btndescribe.description') }}
      </div>
     <ul class="introduce-detail">
       <li>{{ $t('btndescribe.btnnum') }}</li>
       <li>{{ $t('btndescribe.blockheight') }}</li>
       <li>{{ $t('btndescribe.difficulty') }}</li>
       <li>{{ $t('btndescribe.computing_power') }}</li>
     </ul>
      <ol class="introduce-detail">
        <li>{{getDescriptions.totalAmount}}</li>
        <li>{{getDescriptions.height}}</li>
        <li>{{getDescriptions.difficulty}}</li>
        <li>{{getDescriptions.workWeight}}</li>
      </ol>
    </section>

    <!--<section class="columns is-multiline is-desktop">-->
    <section>
      <div class="column is-half">
        <div class="card">
          <div class="card-header">
            <div class="card-header-icon">
              <Icon icon="cubes" fixedWidth />
            </div>
            <h3 class="card-header-title">
              {{ $tc('blockchain.block', 2) }}
            </h3>
          </div>
          <div class="card-body">
            <ul class="block-bodytitle">
              <li>{{ $t('blockinformation.blockheight') }}</li>
              <li>{{ $t('blockinformation.relayed_by') }}</li>
              <li>{{ $t('blockinformation.block_time') }}</li>
              <li>{{ $t('blockinformation.block_reward') }}</li>
            </ul>
            <ol v-for="block in recentBlocks" class="btn-blocknew is-size-7" :key="block.hash">
                <li>
                  <nuxt-link :to="{name: 'block-id', params: {id: block.height}}"
                    class="">
                    #{{ block.height }}
                  </nuxt-link>
                </li>
                <li>
                  <AddressLink :address="block.minedBy" />
                </li>
                <li>
                  <FromNow :timestamp="block.timestamp" />
                </li>
                <li>
                  {{ block.reward | btn }} BTN
                </li>
            </ol>

            <div class="viewmore">
              <nuxt-link to="/block" class="card-header-button button is-btn is-outlined">
                {{ $t('action.view_all') }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>


    </section>
  </div>
</template>

<script>
  import Block from "@/models/block"
  import Description from "@/models/misc"

  export default {
    head() {
      return {
        title: 'btn.org',
        titleTemplate: null
      }
    },
    data() {
      return {
        recentBlocks: [],
        recentTransactions: [],
        getDescriptions:{}
      }
    },
    async asyncData() {
      let recentBlocks = await Block.getRecentBlocks()
      let getDescriptions = await Description.getDescriptions()
      return {recentBlocks,getDescriptions}
    },
    mounted() {
      this.$websocket.subscribe('block')
      //获取主页(BTN概要)
      this.$websocket.subscribe('description')
      this.$websocket.subscribe('mempool/transaction')
      this.$websocket.on('block', block => {
        block.txLength = block.tx.length
        this.recentBlocks.unshift(block)
        this.recentBlocks.pop()
      })
      this.$websocket.on('mempool/transaction', transaction => {
        this.recentTransactions.unshift(transaction)
        if (this.recentTransactions.length > 27) {
          this.recentTransactions.pop()
        }
      })

      //websocket获取BTN概要 （BTN产量、区块高度、全网难度、实时算力）
      this.$websocket.on('description', description => {
          this.getDescriptions = description
      })

    },
    beforeDestroy() {
      this.$websocket.unsubscribe('block')
      this.$websocket.unsubscribe('mempool/transaction')
      this.$websocket.unsubscribe('description')
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/variables.less';

  @media screen and (min-width: 1300px) {
    .container,.introduce-detail-wrap {
      max-width: 1300px;
      width: 1300px;
    }
  }
  .introduce-detail-wrap{
    box-shadow:0px 0px  10px 3px rgba(140,147,200,0.19);
    margin: 20px auto;
    background-color:#fff;
  }
  .introduce-detail{
    width:100%;
    display: flex;
    align-items: center;
    >li{
      width:25%;
      text-align: center;
      font-size: 15px;
      padding:20px 0;
      font-family: @fontfamily;
      background: #F9FAFC;
      color: #6B708D;
    }
  }
  ol.introduce-detail{
    li{
      background-color:#fff;
      word-break: break-all;
      padding:20px 8px;
      box-sizing: border-box;
    }
  }

  .column.is-half, .column.is-half-tablet {
     width: 100%;
  }
  .background{
    padding-top:0!important;
  }
  .column{
    padding-left:0;
    border:none;
    padding-right:0;

  }
  .btn-blocknew{
    border:none!important;
    display: flex;
    width: 100%;
    &:nth-child(odd){
      background: #F9FAFC;
    }
    li{
      width: 25%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      color: #0B224B;
      font-family: @fontfamily;
      span{
        font-family: @fontfamily;
      }
      a{
        color: #568DEF;
        font-family: @fontfamily;
      }
    }
  }
  .card-header{
    box-shadow: none;
  }
  .fa-cubes{
    width:16px;
    height: 16px;
    content: '';
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAMhJREFUOBFjDEhoEGBgYDAAYqxAjE3yKEji1a/n1lgVQAQvsABpg3///+7Hpej977diIDl8apgYmR2ZcBlAqvgwNggU2ASBIKvwB2CsOeJRCI41PPIQqVmz0n8DWQfwKSTKRYHZbcJ/v36/jssgRkbmAJb/jAy/gApe41L0h4vhH8s3Bqa//xlEcalhZGBgA2LCIDSxTfTnv++vcKkEJUgWYrIIMHXjMgMuTnQWgevAwRjGKZtqXgMF9gVQ9OEIQwZQ9gDJEcoiAMiNPo6trFGiAAAAAElFTkSuQmCC) no-repeat center;
    background-size:100%  100%;
  }
  .fa-cubes:before{
    content: '';
  }
  .card-header-icon{
    padding-left:3.2rem;
    padding-right:0;
  }
  .introduce-detail-title{
    width:100%;
    height:50px;
    line-height: 50px;
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAA0FJREFUOBGtVE1I1EEUnzfzbzVd23LXgtYoUGm3CM0KxSj2FqFSFEEEQaeQLgUFXSINgjoU1EUIOnQSijCyr+tiBxWjT8ivFgzdrMzNr3R3def13vydpSz6oAaGefO+35v3GyV+syKRJmdWrQh4C8P528oPpgYHo/pXJvAz4brIkdxP8bFaoXEnoghldUAgGfQKKdsDwcKHg9EbyaxsgfjB4bLS+mqNeJwcFWaVQcwbGoVjeQAiIaW6Mjlwt8vy+FTfXgpK6vdqgacEijwA6KIdJ3mxlHCb6F4KstHyiS5DgZFcf2gynejrs36kJUxmAhvonlFKnd1defgc0esBcNpXlNtS4BMtTDOPZUpCI+tq1MeWle2pItoskyH37MvEzAXOzHHUZSrj8VAqVYOIu5SUj0Zf3umYGumfo2wC1I6K2PtXsanYvY68ovBHrXG7EFi+urzmwfjg83nTQ29Z/X7M4FE3A3jGoUBACRmvBgmvBeKYCQ/gR40bJMA7KjdmeAI3I4IXlLw2PdDW6jaZXpOFLKBjh6EpXXOSA0OYi8vjQHTlTWvhXbVmH63Ac9Y99OS+RBxVOTlnWMWjtPNlZr5ZShFXSzzcy+zKzKUbtRbB/DznWDojzetnUqnzGqBo25qtdU7P0ItCSgYEGY/3tL5lS9+mQyuEmKSUYczyrEeaBCofgynIS0z0tHxmfkFpbVxosZJ9ZV/ZGvzpCcrj1r/IwAmvKU9QyUgRgsvD+9ay3IMzjqkF0G951i6TngsYnflxlvmYppKDVCOyL/eVS+qufgcxa/0XJyGnZzp2/4T7yhLaRQZD/zI2jG+Ob3oYCPofMDZ5bAglnRTpPI3D9QWFAb7zJuUBN2m4znfWNTNItvxZsMwghSc8178+Tl2O0IxVLQ2EY1uKK7tHJkdqqbmlK0MV97yrSjzJpD4JIGcIeleH08mqjNanGQFKqosfnt40E2J66Eal53c/hwYeI/4EuNGEjGr6HG6RDhDMDhByOllOsKxiuQTZPPWmrc36+M4hM//r98UOU4n+YQb67PTsFEXLpyz8lBG3RnJG1OteqrE1UOy/ZMtkO7t+yNAK7MnQNGgiBs9ZNNpkRtTKF59fAYonieAoSdNjAAAAAElFTkSuQmCC) no-repeat 50px center;
    background-size:18px 18px;
    background-color:#fff;
    text-indent:78px;
    font-size: 16px;
    color: #0B224B;
    font-family: @fontfamily;
  }
  .card{
    overflow: hidden;
    box-shadow:0px 0px  10px 3px rgba(140,147,200,0.19);
  }
  .card-header-button{
    display: inline-block;
    margin:0 auto;
    width:145px;
    height:40px;
    text-align: center;
    line-height: 30px;
    background: #657EFF;
    border-radius: 5px;
    font-size: 14px;
    color: #FFFFFF;
    cursor: pointer;
    font-family: @fontfamily;
  }
  .card-header-title{
    font-size: 16px;
    color: #0B224B;
    font-weight: normal;
    font-family: @fontfamily;
  }
  .btn-blocknew {
    padding: 1em 0;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
  }
  .viewmore{
    display:flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-bottom:24px;
    margin-top:24px;
    overflow: hidden;
  }
  .btn-blocknew-box {
    flex-direction: column;
    min-width: 11em;
    padding: 1em;
    background-color: #eee;
    color: inherit;
    &:hover {
      outline: 1px solid @btn;
    }
  }
  .block-bodytitle{
    width:100%;
    display: flex;
    li{
      width:25%;
      background: #F9FAFC;
      text-align: center;
      height:50px;
      line-height:50px;
      font-size: 15px;
      color: #6B708D;
      font-family: @fontfamily;
    }
  }
  .transaction {
    padding: 0.5em 1em;
    border-top: 1px solid #eee;
    &:first-child {
      border-top: none;
    }
    font-family: monospace;
  }
  .address-link{
    a{
      font-family: '黑体',PingFangSC-Regular,pingfangsc;
      font-size:14px;
    }
  }
  @media screen and (max-width:1024px){
    .address-link > .clipboard:hover, .block-link > .clipboard:hover, .transaction-link > .clipboard:hover{
      transform: translateY(-50%) scale(1.0) !important
    }
    .card-header-icon{
      padding-left:1.4rem;
    }
    .introduce-detail-title{
      text-indent: 50px;
      background-position: 22px center;
    }
  }
</style>
