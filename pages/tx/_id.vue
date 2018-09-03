<template>
  <section class="container txid-container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('transaction.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_id') }}</div>
          <div class="column info-value monospace">
            <TransactionLink :transaction="id" plain />
          </div>
        </div>
        <div class="columns" v-if="id !== hash">
          <div class="column info-title">{{ $t('transaction.transaction_hash') }}</div>
          <div class="column info-value monospace">
            <TransactionLink :transaction="id" plain :clipboard="hash">{{ hash }}</TransactionLink>
          </div>
        </div>
        <div class="columns" v-if="block">
          <div class="column info-title">{{ $t('transaction.included_in_block') }}</div>
          <div class="column info-value">
            <BlockLink :block="block.height" :clipboard="block.hash">
              {{ block.height }} ({{ block.hash }})
            </BlockLink>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.transaction_size') }}</div>
          <div class="column info-value">{{ size.toLocaleString() }} bytes</div>
        </div>
        <div class="columns" v-if="block">
          <div class="column info-title">{{ $t('transaction.timestamp') }}</div>
          <div class="column info-value">
            <FromNow :timestamp="block.timestamp" /> ({{ block.timestamp | timestamp }})
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('transaction.confirmation') }}</div>
          <div class="column info-value">{{ confirmations }}</div>
        </div>
        <div class="columns" v-if="fees > 0">
          <div class="column info-title">{{ $t('transaction.transaction_fee') }}</div>
          <div class="column info-value monospace">{{ fees | btn }} btn</div>
        </div>

        <Transaction
          :transaction="{
            id, blockHeight: block && block.height, timestamp: block && block.timestamp,
            vin, vout, fees, tokenTransfers
          }"
          @transaction-change="refresh" />

        <div class="columns">
          <div class="column">
            <div v-for="receipt in receipts" class="receipt-item">
              <div class="columns">
                <div class="column info-title">{{ $t('transaction.receipt.gas_used') }}</div>
                <div class="column info-value monospace">{{ receipt.gasUsed.toLocaleString() }}</div>
              </div>
              <div class="columns" v-if="receipt.contractAddress !== '0'.repeat(40)">
                <div class="column info-title">{{ $t('transaction.receipt.contract_address') }}</div>
                <div class="column info-value">
                  <AddressLink :address="receipt.contractAddress" />
                </div>
              </div>
              <div class="columns" v-if="receipt.excepted !== 'None'">
                <div class="column info-title">{{ $t('transaction.receipt.excepted') }}</div>
                <div class="column info-value">{{ receipt.excepted }}</div>
              </div>
              <div class="columns" v-if="receipt.logs.length">
                <div class="column info-title">{{ $t('transaction.receipt.event_logs') }}</div>
                <div class="column info-value">
                  <ul v-for="log in receipt.logs" class="event-log">
                    <li>
                      <span class="key">{{ $t('transaction.receipt.address') }}</span>
                      <AddressLink :address="log.address" />
                    </li>
                    <li>
                      <span class="key">{{ $t('transaction.receipt.topics') }}</span>
                      <ul class="topic-list monospace">
                        <li v-for="topic in log.topics">{{ topic }}</li>
                      </ul>
                    </li>
                    <li>
                      <span class="key">{{ $t('transaction.receipt.data') }}</span>
                      <span class="monospace">{{ log.data }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Block from '@/models/block'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/btnorg-api'

  export default {
    head() {
      return {
        title: this.$t('blockchain.transaction') + ' ' + this.id
      }
    },
    data() {
      return {
        block: null,
        id: '',
        hash: '',
        size: 0,
        isCoinbase: false,
        fees: 0,
        vin: [],
        vout: [],
        receipts: [],
        tokenTransfers: []
      }
    },
    async asyncData({params, error}) {
      try {
        let transaction = await Transaction.get(params.id)
        let block = null
        if (transaction.blockHeight != null) {
          block = await Block.get(transaction.blockHash)
        }
        return {
          id: transaction.id,
          hash: transaction.hash,
          size: transaction.size,
          isCoinbase: transaction.isCoinbase,
          fees: transaction.fees,
          vin: transaction.vin,
          vout: transaction.vout,
          receipts: transaction.receipts,
          tokenTransfers: transaction.tokenTransfers,
          block
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Transaction ${param.id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          throw err
        }
      }
    },
    computed: {
      blockchain() {
        return this.$store.state.blockchain
      },
      confirmations() {
        return this.block ? this.blockchain.height - this.block.height + 1 : 0
      }
    },
    methods: {
      async refresh(transaction) {
        this.block = transaction.block
        this.timestamp = transaction.block.timestamp
        this.receipts = transaction.receipts
        this.tokenTransfers = transaction.tokenTransfers
      },
      splitData(data) {
        let chunks = data.length / 64
        let list = []
        for (let i = 0; i < chunks; ++i) {
          list.push(data.slice(i * 64, (i + 1) * 64))
        }
        return list
      }
    }
  }
</script>

<style lang="less" scoped>
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  .receipt-item::before {
    display: block;
    height: 1px;
    background-color: #ccc;
    content: "";
  }
  .event-log {
    display: inline-block;
    &:not(:first-child) {
      margin-top: 0.5em;
    }
    padding: 0.5em 1em;
    border: 1px solid #ccc;
    .key {
      display: inline-block;
      margin-right: 0.5em;
      font-weight: bold;
    }
  }
  .topic-list, .data-list {
    list-style-type: disc;
    list-style-position: inside;
  }
  .txid-container{
    box-shadow:0px 0px  10px 3px rgba(140,147,200,0.19);
    margin:14px auto;
    background-color:#fff;
    padding-bottom:40px;
  }
  .card.section-card{
    margin:0;
    border:none;
    box-shadow:none;
  }
  .card-header{
    box-shadow:none;
  }
  .fa-list-alt:before{
    content: '';
  }
  .fa-list-alt{
    width: 18px;
    height: 20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAVCAYAAACkCdXRAAAAAXNSR0IArs4c6QAAAYdJREFUOBHlkrFKA0EQhmf2LklhUIwQFUQJ2KjPYKtlqggKQQVBtLJQbIwsahAiiGksYhNBUJJGU9j6EmqlGMQiEAjB6EVybMbd4B0onjm4dG5xO/vPN/8uMwfgYsVyOc0FBvgXNLey3/ter29KZpkIzwKIyXyWl5xqfjWLrx90vZZra4C0QQQ9djGiAQRphix1meVVW/8KvpnFOPebxaZ8BWwRUPgnbJ0RsYoIqbCPpTMZbti6ClRPzOv7OIHg0mjESrbdEUtIsOePsJM85w2cXUr2G+bHDQGMtS12Bp4CujbFDGH2eTRSV0RMAUN6MAgvtRrOOF/qLuND/5070iVlTzO6uD0tx36o6gjYbiHLL1QcnU9cAeKoHEylcLoz2dIcWF0l1ZJwt/yMqxhRhNTeWi0jqSOULcmJZRbQif2fmNkDAE1/QCGOVe9Iw1urh4R0jsAGpVqzNCfWznciwNgCH2gAJbya6aAf6Q2EEDWbq17NBIp8R38NfTgYenx+q0x4fVnYB8VPn2CNK3mOiWkAAAAASUVORK5CYII=) no-repeat center;
    background-size: 100% 100%;
  }
  .card-header-title{
    font-weight:normal;
    font-family: @fontfamily;
    font-size: 16px;
    color: #0B224B;

  }
  .card-header-icon {
    padding-left: 4.8rem;
    padding-right: 0rem;
  }
  @media screen and (min-width: 1300px) {
    .card-body.info-table {
      max-width: 1240px;
      width: 1240px;
    }
  }
  .card-body.info-table{
    margin:0 auto;
    background-color: #F9FAFC;
    padding-top:0.4rem;
  }
  @media screen and (min-width: 1300px) {
    .columns.is-multiline.transaction-item:before {
      max-width: 1200px;
      width: 1200px;
    }
  }
  .columns.is-multiline.transaction-item{
    margin-top:40px;
    padding-bottom:34px;
  }
  .columns.is-multiline.transaction-item:before{
    content:'';
    height:1px;
    background-color: #D5DBE5;
    margin:0 auto;
    position: relative;
    top:-20px;
  }
  .info-table .info-title{
    font-weight:normal;
    text-align:left;
  }
  .info-title{
    text-indent:1.5rem;
    font-size: 15px;
    color: #6B708D;
    font-family: @fontfamily;
  }
  .column.info-value,.column.info-value a,.column.info-value span{
    font-family: @fontfamily;
    font-size: 15px;
  }
  @media (min-width: 1024px){
    .info-table .info-title{
      width: 14%;
    }
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
    .transaction-link > .clipboard,.block-link > .clipboard{
      top:77%;
    }
    .address-link > .clipboard:hover, .block-link > .clipboard:hover, .transaction-link > .clipboard:hover{
      transform: translateY(-50%) scale(1.0) !important
    }
    .info-title{
      text-indent: 0.9rem;
    }
    .column.info-value{
      padding-left:1.9rem;
    }
    .columns.is-multiline.transaction-item{
      padding-left:1.9rem;
    }
  }
</style>
