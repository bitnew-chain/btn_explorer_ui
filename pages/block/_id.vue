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
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAMhJREFUOBFjDEhoEGBgYDAAYqxAjE3yKEji1a/n1lgVQAQvsABpg3///+7Hpej977diIDl8apgYmR2ZcBlAqvgwNggU2ASBIKvwB2CsOeJRCI41PPIQqVmz0n8DWQfwKSTKRYHZbcJ/v36/jssgRkbmAJb/jAy/gApe41L0h4vhH8s3Bqa//xlEcalhZGBgA2LCIDSxTfTnv++vcKkEJUgWYrIIMHXjMgMuTnQWgevAwRjGKZtqXgMF9gVQ9OEIQwZQ9gDJEcoiAMiNPo6trFGiAAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% 100%;
  }
  .fa-list-alt{
    width: 18px;
    height: 18px;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAVCAYAAACkCdXRAAAAAXNSR0IArs4c6QAAAYdJREFUOBHlkrFKA0EQhmf2LklhUIwQFUQJ2KjPYKtlqggKQQVBtLJQbIwsahAiiGksYhNBUJJGU9j6EmqlGMQiEAjB6EVybMbd4B0onjm4dG5xO/vPN/8uMwfgYsVyOc0FBvgXNLey3/ter29KZpkIzwKIyXyWl5xqfjWLrx90vZZra4C0QQQ9djGiAQRphix1meVVW/8KvpnFOPebxaZ8BWwRUPgnbJ0RsYoIqbCPpTMZbti6ClRPzOv7OIHg0mjESrbdEUtIsOePsJM85w2cXUr2G+bHDQGMtS12Bp4CujbFDGH2eTRSV0RMAUN6MAgvtRrOOF/qLuND/5070iVlTzO6uD0tx36o6gjYbiHLL1QcnU9cAeKoHEylcLoz2dIcWF0l1ZJwt/yMqxhRhNTeWi0jqSOULcmJZRbQif2fmNkDAE1/QCGOVe9Iw1urh4R0jsAGpVqzNCfWznciwNgCH2gAJbya6aAf6Q2EEDWbq17NBIp8R38NfTgYenx+q0x4fVnYB8VPn2CNK3mOiWkAAAAASUVORK5CYII=) no-repeat center;
    background-size: 100% 100%;
    &:before{
      content: '';
    }
  }
  .card-header-icon{
    padding-left:3.6rem;
    padding-right:0.4rem;
  }
  .card-header-title{
    font-size: 16px;
    color: #0B224B;
    font-weight:normal;
    padding-left:0.2rem;
    font-family: @fontfamily;
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
