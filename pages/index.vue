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
                <li class="pr12">
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
    margin: 10px auto;
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
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAAUhJREFUaAXtmdENgzAMRB3UARiFDdoRGIERmKBCnaAjMAIrdANGYYJQqBorEv2IkB1MdfwQUDjb9yAiCRGOczngQrp1c396oipcS50LKtqh78ZYr266ypN/xvck2gXROPSPdtW6BMFPUfN8DddiZ0flD62SFGJ5x5xoKfI/DxR2Nq4gBmJGHMCraAREchoglmyVkY4gZgREchoglmyVkY48bcmcz0TOvaRjLq8fz/sOKew78bxJFxbr4RuL3ThDG8TOQCnO8ZDBI+sqVVxthjZWqfaajMFjr3NHPceDx/o7Eq+kCiY0CWolS3FhYc07+UnjHfGNGQe0SQ/ENpYYv8GDR86NvxyecGGZN/7Ua8M3pm6xcAAQEzZUXQ7E1C0WDgBiwoaqy4GYusXCAUBM2FB1ORBTt1g4AE9bFnQ5V6nUN/6EfYKcugNvjDI3umPcgr0AAAAASUVORK5CYII=) no-repeat center;
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
    background:url(data:image/png;base64,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) no-repeat 50px center;
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
    .pr12{
      padding-right: 12px;
    }
  }
  @media (min-width:375px) and (max-width:414px){

    .pr12{
      padding-right: 22px;
    }
  }
  @media screen and (max-width:500px){

    .pr12{
      padding-right: 22px;
    }
  }
</style>
