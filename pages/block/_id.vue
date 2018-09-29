<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="cubes" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('block.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_height') }}</div>
          <div class="column info-value">{{ height }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_hash') }}</div>
          <div class="column info-value">
            <BlockLink :block="hash" plain />
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_size') }}</div>
          <div class="column info-value">{{ size.toLocaleString() }} {{ $t('block.bytes') }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_weight') }}</div>
          <div class="column info-value">{{ weight.toLocaleString() }} {{ $t('block.bytes') }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.timestamp') }}</div>
          <div class="column info-value">
            <FromNow :timestamp="timestamp" /> ({{ timestamp | timestamp }})
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.block_reward') }}</div>
          <div class="column info-value monospace">{{ reward | btn }} BTN</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.difficulty') }}</div>
          <div class="column info-value">{{ difficulty }}</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.merkle_root') }}</div>
          <div class="column info-value monospace">{{ merkleRoot }}</div>
        </div>
        <div class="columns" v-if="minedBy">
          <div class="column info-title">{{ $t('block.mined_by') }}</div>
          <div class="column info-value">
            <AddressLink :address="minedBy" />
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('block.transactions') }}</div>
          <div class="column info-value">{{ transactions.length }}</div>
        </div>
        <div class="columns" v-if="previousBlockHash && previousBlockHash != '0'.repeat(64)">
          <div class="column info-title">{{ $t('block.previous_block') }}</div>
          <div class="column info-value">
            <BlockLink :block="height - 1" :clipboard="previousBlockHash">
              {{ previousBlockHash }}
            </BlockLink>
          </div>
        </div>
        <div class="columns" v-if="nextBlockHash">
          <div class="column info-title">{{ $t('block.next_block') }}</div>
          <div class="column info-value">
            <BlockLink :block="height + 1" :clipboard="nextBlockHash">
              {{ nextBlockHash }}
            </BlockLink>
          </div>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" ref="transaction-list">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixedWidth />
        </div>
        <div class="card-header-title">{{ $tc('blockchain.transaction', 2) }}</div>
      </div>
      <div class="card-body info-transaction">
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
        <Transaction v-for="transaction in transactions" :key="transaction.txid" :transaction="transaction" />
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import RequestError from '@/services/btnorg-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.block') + ' #' + this.height
      }
    },
    data() {
      return {
        height: 0,
        hash: 0,
        time: 0,
        size: 0,
        reward: 0,
        difficulty: 0,
        merkleRoot: '',
        minedBy: null,
        previousBlockHash: null,
        nextBlockHash: null,
        tx: [],
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({params, query, redirect, error}) {
      let id = params.id
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/block/${params.id}`)
        }
        let block = await Block.get(id)
        let page = Number(query.page || 1)
        if (page > 1 && block.tx.length <= (page - 1) * 20) {
          redirect(`/block/${params.id}`, {page: Math.ceil(block.tx.length / 20)})
        }
        let transactions = await Transaction.get(block.tx.slice((page - 1) * 20, page * 20))
        return {
          height: block.height,
          hash: block.hash,
          timestamp: block.timestamp,
          size: block.size,
          weight: block.weight,
          reward: block.reward,
          difficulty: block.difficulty,
          merkleRoot: block.merkleRoot,
          minedBy: block.minedBy || null,
          previousBlockHash: block.previousBlockHash || null,
          nextBlockHash: block.nextBlockHash || null,
          tx: block.tx,
          transactions
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Block ${id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          throw err
        }
      }
    },
    computed: {
      pages() {
        return Math.ceil(this.tx.length / 20)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'block-id', params: {id: this.height}, query: {page}}
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'block-id',
          params: {id: this.height},
          query: {page: Math.ceil(this.tx.length / 20)}
        })
        return
      }
      this.transactions = await Transaction.get(this.tx.slice((page - 1) * 20, page * 20))
      this.currentPage = page
      next()
      scrollIntoView(this.$refs['transaction-list'])
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    padding: 1em;
  }
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  body,html{
    background-color:#fff;
    font-family:@fontfamily!important;
  }
  @media screen and (min-width: 1300px) {
    .container {
      max-width: 1300px;
      width: 1300px;
    }
  }
  .card.section-card{
    margin-left:0;
    margin-right:0;
    padding-bottom: 40px;
  }
  .card-header{
    box-shadow: none;
    height: 48px;
    display: flex;
    align-items: center;
  }
  .card.section-card{
    box-shadow: none;
  }
  .fa-cubes:before{
    content:''
  }
  .fa-cubes{
    width: 16px;
    height: 16px;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAAUhJREFUaAXtmdENgzAMRB3UARiFDdoRGIERmKBCnaAjMAIrdANGYYJQqBorEv2IkB1MdfwQUDjb9yAiCRGOczngQrp1c396oipcS50LKtqh78ZYr266ypN/xvck2gXROPSPdtW6BMFPUfN8DddiZ0flD62SFGJ5x5xoKfI/DxR2Nq4gBmJGHMCraAREchoglmyVkY4gZgREchoglmyVkY48bcmcz0TOvaRjLq8fz/sOKew78bxJFxbr4RuL3ThDG8TOQCnO8ZDBI+sqVVxthjZWqfaajMFjr3NHPceDx/o7Eq+kCiY0CWolS3FhYc07+UnjHfGNGQe0SQ/ENpYYv8GDR86NvxyecGGZN/7Ua8M3pm6xcAAQEzZUXQ7E1C0WDgBiwoaqy4GYusXCAUBM2FB1ORBTt1g4AE9bFnQ5V6nUN/6EfYKcugNvjDI3umPcgr0AAAAASUVORK5CYII=) no-repeat center;
    background-size: 100% 100%;
  }
  .fa-list-alt{
    width: 18px;
    height: 20px;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA/CAYAAABaQWCYAAAAAXNSR0IArs4c6QAAAztJREFUaAXtWr1v00AUf+/Sql3KVImBInVBYszEAqUVGwwQQCpicyPE54JggVDSI/0QiIU5CNWAmAA1/QOKylqpfAxlJYiBTsBSkPJxxztZFxlkO7aTpti9k5Jz7t7X7/3u7GfHAKaZDMTKwKmpuf2xFDtQwg50I6metWYPNKBWkhLOIeIaQ1ZYWuRvIhmJKbztIM9c4CONevMuAOYBZJ87TgK7ghlWqDzha+7xbh9vG8jzF/nwVl3cAgnXQMrBoMARcAkYm15e5J+C5OLOdR3kyfyDIRBbNxDkTVqaQ2EDI1aFBHjOgPGKzath9cLIdQ2kZfHBHyiuSAEFWpbDYZx7yRCrNQlYHkCcf2nzTS+ZqGMdg+Sc973/AhYIMSNBjkQNwFce8RcBfkSfh8TsT1+5EBOZEDKeIlJK/PgVJ799F6+kFFMktMdTMP5gP62IMUC4fDB7FMcPHXu3vr5aj2MuFpO5fPE4LcsFApqN4zSWDuImSpjbO7CvXC5figQ2EsjTeX5ECKHAjcUKtDtKnxniTHaUvaCtIsKYDAUyZ/GshOY8nS1PhDHaI5kNhplp2q+Vdv4CQTpVSn2WmJskQ4Gy7Rxt1zydmNYosELlaWnFz4dn4KpKaTZEkZib+rdK8TO00+NB1dNfIFWV8rsmbwuQV9tVKTsNys8/IlT6+vunXz8ubmiZFkjadznad8+iVCnayP/Wq+qJdtf9ZfveHRWbq2AW2TQAVKDoHMLoDHJYHavGnC7d3wZkWvjdFUymhSyDw2TAZCBBGWiVdX4x56wi95tzxpkd9OCJysUJAEEfv8aqpG/7zarxTmNwlXXeboSUM94zzihDWKWjqvPL61tMBNpA8Za0bC9NPRaoT0LtYtgV10kDUi+XpPeGyaQzqOM3TOpMJL03TCadQR2/YVJnIum9YTLpDOr4DZM6E0nvDZNJZ1DH3/bJACCqO/eg1ubNDFYF5+7f0wYtpQ+eE+7BjmNwGzPHJgMmAyYDPchA6+EyPQS2BAirBz574kKdtSt26bpy5rqEiFH6s328JxH0wImg10B0MxWPzkTSe8Nk0hnU8RsmdSaS3rsuIWyVqVfSUtPo7se0lGXgD0QF6l8vkgTgAAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% 100%;
    &:before{
      content: '';
    }
  }
  .card-header-icon{
    padding-left:3.6rem;
    padding-right:6px;
  }
  .card-header-title{
    font-size: 16px;
    color: #0B224B;
    font-weight:normal;
    font-family: @fontfamily;
    padding-left:0;
  }
  @media screen and (min-width: 1300px) {
    .card-body{
      max-width: 1222px;
      width: 1222px;
    }
  }
  @media screen and (min-width: 1300px) {
    .card-body.info-transaction{
      max-width: 1218px;
      width: 1218px;
    }
  }
  .card-body.info-table{
    padding-top:14px;
    padding-left:18px;
    background: #F9FAFC;
    margin:0 auto;
    padding-bottom:20px;
  }
  .card-body.info-transaction{
    padding-top:14px;
    padding-left:18px;
    margin:-48px auto 0;
    padding-bottom:48px;
  }
  .info-table .info-title{
    font-weight:normal;
    text-align:left;
    font-size: 15px;
    color: #6B708D;
    font-family: @fontfamily;
  }
  @media (min-width: 1024px){
    .info-table .info-title {
      width: 14%;
    }
  }
  .address-link .monospace{
    font-family: @fontfamily;
    cursor: pointer;
    font-size: 15px;
  }
  .monospace{
    font-family: @fontfamily;
    font-size: 15px;
  }
  .column.info-value{
    font-size: 15px;
    color: #222222;
    font-family: @fontfamily;
    span{
      font-family: @fontfamily;
    }
  }
  .card.section-card{
    box-shadow:0px 0px  10px 3px rgba(140,147,200,0.19);
    margin-top:0;
    margin-bottom:20px;
  }
  .card.section-card.transaction-list{
    padding-bottom:0;
  }
  @media screen and (max-width:1024px){
    .column.is-half.collapse,.column.is-clearfix.collapse{
      padding-left:0;
    }
    .card-header-icon{
      padding-left:1.1rem;
    }
    .info-table .info-title, .info-table .info-value{
      padding-left:1.0rem;
    }
    .block-link > .clipboard{
      top:77%;
    }
    .address-link > .clipboard:hover, .block-link > .clipboard:hover, .transaction-link > .clipboard:hover{
      transform: translateY(-50%) scale(1.0) !important
    }
  }
</style>
