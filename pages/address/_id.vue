<template>
  <section class="container">
    <div class="card section-card">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="address-card-o" fixedWidth />
        </div>
        <h3 class="card-header-title">{{ $t('address.summary') }}</h3>
      </div>
      <div class="card-body info-table">
        <div class="columns">
          <div class="column info-title">{{ $t('address.address') }}</div>
          <div class="column info-value">
            <div v-for="address in id.split(',')">
              <AddressLink :address="address" plain />
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.balance') }}</div>
          <div class="column info-value monospace">
            {{ balance | btn }} BTN
            <span v-if="unconfirmedBalance !== '0' && stakingBalance !== '0'">
              ({{ unconfirmedBalance | btn }} BTN {{ $t('address.unconfirmed') }},
              {{ stakingBalance | btn }} BTN {{ $t('address.staking') }})
            </span>
            <span v-else-if="unconfirmedBalance !== '0'">
              ({{ unconfirmedBalance | btn }} BTN {{ $t('address.unconfirmed') }})
            </span>
            <span v-else-if="stakingBalance !== '0'">
              ({{ stakingBalance | btn }} BTN {{ $t('address.staking') }})
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_received') }}</div>
          <div class="column info-value monospace">{{ totalReceived | btn }} BTN</div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.total_sent') }}</div>
          <div class="column info-value monospace">{{ totalSent | btn }} BTN</div>
        </div>
        <div class="columns" v-if="tokenBalances.length">
          <div class="column info-title">{{ $t('address.token_balances') }}</div>
          <div class="column info-value">
            <div v-for="token in tokenBalances" class="monospace">
              {{ token.balance | qrc20(token.decimals) }}
              <AddressLink :address="token.address">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column info-title">{{ $t('address.transaction_count') }}</div>
          <div class="column info-value">{{ totalCount }}</div>
        </div>
      </div>
    </div>

    <div class="card section-card transaction-list" ref="transaction-list">
      <div class="card-header">
        <div class="card-header-icon">
          <Icon icon="list-alt" fixedWidth />
        </div>
        <div class="card-header-title">{{ $t('address.transaction_list') }}</div>
      </div>
      <div class="card-body">
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
        <nav v-else class="pagination is-centered nopagination" style="height:74px;"></nav>
        <Transaction v-for="transaction in transactions" :key="transaction.txid"
          :transaction="transaction" :highlightAddress="hexAddress"
          @transaction-change="tx => transactionChange(transaction, tx)" />
        <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import Address from '@/models/address'
  import Transaction from '@/models/transaction'
  import {RequestError} from '@/services/btnorg-api'
  import {toHexAddress} from '@/utils/address'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('blockchain.address') + ' ' + this.id
      }
    },
    data() {
      return {
        balance: '0',
        totalReceived: '0',
        totalSent: '0',
        unconfirmedBalance: '0',
        stakingBalance: '0',
        tokenBalances: [],
        totalCount: 0,
        transactions: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({params, query, redirect, error}) {
      try {
        let address = await Address.get(params.id)
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect(`/address/${params.id}`)
        }
        let page = Number(query.page || 1)
        let {totalCount, transactions} = await Address.getTransactions(
          params.id,
          {from: (page - 1) * 20, to: page * 20}
        )
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect(`/address/${params.id}`, {page: Math.ceil(totalCount / 20)})
        }
        transactions = await Transaction.get(transactions)
        return {
          balance: address.balance,
          totalReceived: address.totalReceived,
          totalSent: address.totalSent,
          unconfirmedBalance: address.unconfirmedBalance,
          stakingBalance: address.stakingBalance,
          tokenBalances: address.tokenBalances,
          totalCount,
          transactions
        }
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.code === 404) {
            error({statusCode: 404, message: `Address ${param.id} not found`})
          } else {
            error({statusCode: err.code, message: err.message})
          }
        } else {
          throw err
        }
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      hexAddress() {
        return toHexAddress(this.id)
      },
      pages() {
        return Math.ceil(this.totalCount / 20)
      }
    },
    methods: {
      getLink(page) {
        return {name: 'address-id', params: {id: this.id}, query: {page}}
      },
      transactionChange(oldTransaction, newTransaction) {
        Vue.set(oldTransaction, 'blockHeight', newTransaction.block.height)
        Vue.set(oldTransaction, 'blockHash', newTransaction.block.hash)
        oldTransaction.tokenTransfers = newTransaction.tokenTransfers
      }
    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, transactions} = await Address.getTransactions(
        this.id,
        {from: (page - 1) * 20, to: page * 20}
      )
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({
          name: 'address-id',
          params: {id: this.id},
          query: {page: Math.ceil(totalCount / 20)}
        })
        return
      }
      this.transactions = await Transaction.get(transactions)
      this.currentPage = page
      next()
      scrollTo(0,0);
      // scrollIntoView(this.$refs['transaction-list'])
    }
  }
</script>

<style lang="less" scoped>
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  .pagination {
    padding: 1em;
  }
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
  .section-card,.card-header{
    box-shadow:none;
  }
  .section-card{
    margin:0;
    box-shadow:0px 0px  10px 3px rgba(140,147,200,0.19);
  }
  .card-header{
    margin:14px auto 0;
  }
  .transaction-list{
    margin-top:24px;
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
    height: 20px;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA/CAYAAABaQWCYAAAAAXNSR0IArs4c6QAAAztJREFUaAXtWr1v00AUf+/Sql3KVImBInVBYszEAqUVGwwQQCpicyPE54JggVDSI/0QiIU5CNWAmAA1/QOKylqpfAxlJYiBTsBSkPJxxztZFxlkO7aTpti9k5Jz7t7X7/3u7GfHAKaZDMTKwKmpuf2xFDtQwg50I6metWYPNKBWkhLOIeIaQ1ZYWuRvIhmJKbztIM9c4CONevMuAOYBZJ87TgK7ghlWqDzha+7xbh9vG8jzF/nwVl3cAgnXQMrBoMARcAkYm15e5J+C5OLOdR3kyfyDIRBbNxDkTVqaQ2EDI1aFBHjOgPGKzath9cLIdQ2kZfHBHyiuSAEFWpbDYZx7yRCrNQlYHkCcf2nzTS+ZqGMdg+Sc973/AhYIMSNBjkQNwFce8RcBfkSfh8TsT1+5EBOZEDKeIlJK/PgVJ799F6+kFFMktMdTMP5gP62IMUC4fDB7FMcPHXu3vr5aj2MuFpO5fPE4LcsFApqN4zSWDuImSpjbO7CvXC5figQ2EsjTeX5ECKHAjcUKtDtKnxniTHaUvaCtIsKYDAUyZ/GshOY8nS1PhDHaI5kNhplp2q+Vdv4CQTpVSn2WmJskQ4Gy7Rxt1zydmNYosELlaWnFz4dn4KpKaTZEkZib+rdK8TO00+NB1dNfIFWV8rsmbwuQV9tVKTsNys8/IlT6+vunXz8ubmiZFkjadznad8+iVCnayP/Wq+qJdtf9ZfveHRWbq2AW2TQAVKDoHMLoDHJYHavGnC7d3wZkWvjdFUymhSyDw2TAZCBBGWiVdX4x56wi95tzxpkd9OCJysUJAEEfv8aqpG/7zarxTmNwlXXeboSUM94zzihDWKWjqvPL61tMBNpA8Za0bC9NPRaoT0LtYtgV10kDUi+XpPeGyaQzqOM3TOpMJL03TCadQR2/YVJnIum9YTLpDOr4DZM6E0nvDZNJZ1DH3/bJACCqO/eg1ubNDFYF5+7f0wYtpQ+eE+7BjmNwGzPHJgMmAyYDPchA6+EyPQS2BAirBz574kKdtSt26bpy5rqEiFH6s328JxH0wImg10B0MxWPzkTSe8Nk0hnU8RsmdSaS3rsuIWyVqVfSUtPo7se0lGXgD0QF6l8vkgTgAAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% 100%;
    &:before{
      content: '';
    }
  }
  .fa-address-card-o{
    width: 20px;
    height: 16px;
    content: '';
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAA2CAYAAABz508/AAAAAXNSR0IArs4c6QAAAtJJREFUaAXtmj9vEzEUwN9zKJGQKGwIIbHwZwLRgYkJJGaKEB1gCSzHyheodCQwsyGRhWRBSFmafoHC0qkSQmwFoQoVqd0QA1La2sZu/S6+u3BKogQU38vynv1efH6/e7ZfcgfAHybgE0C/QXoUxSd29+EhaHUdNFzWCIJssyhRgwKETUCxcWYO3jab8e9sHDkQi4/jG1qpNoC+mHUOo41fUYha90287seTArEUxed7PfXZQJj3ncLT8Ve1Kq52mvF3ii2V8nt76lX4EGzoev4oVsIA/bUfRa/nNOjbfVPYmo3VxkxRHiNlR+5eMRtjldqJRPgEgD+T9kwq+rSJ7Vpq6ibWw5gBPtr+BISQ6pRKeR41BFSerrTi9wNMM9N191F8U4Fcy09YnaS+1B5BnWWUDMLddQbBINIbAGcEZ4QpCqTUlBecEY5EUkcQmWHk4bms8+eywMotqjnu1JYT2sOMOSkffw6jjMkZ4WgxCAZhfnGKSrJ8OSNcRoy1WZrvbgnEZ24MX2xR4y92Mk9TJnMY5SJjgTAng71YXHShlVa90F703f9h46XhqJcaBFeWA9ZeqTPC5zHWZsklto8wMJ2XhruhpQYhucTOr+uxNkszDJfYliWX2PmMCqan1JulQP7zNpfJpc4InwaDcDQYhAOR1BGqYt48O/CThXS5YH5kUWNGpVwYNHFl37ZznwREVcJmj3o9aZxfAkivJxz1uKh8oWhSb9WZp1PbxnCOjEFLxG+rrfoFijG1R5hGnQyhS0R47seYyghrWKwtd8xTj/u+U2i6gfCu22o88ONKZYQ1dNuNJdP5xKg/fMcQdATcBsQoC8HGlssIP+B70YuzB3L/kpD99zF9e5GuBjwtL/If1mafdg/rS372RLSHQacV71BfVhaCyDqP0p7WawGr7cZU5pxbGqMEG5Ivg3B3k0E4EEllOfE0R/ww8TF5QCbwzwj8Acp7u+H5U0i/AAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% 100%;
    &:before{
      content: '';
    }
  }
  .card-header-icon{
    padding-left:3.6rem;
    padding-right:0.4rem;
  }
  .card-body{
    margin:-98px auto 0;
  }
  @media screen and (min-width: 1300px) {
    .card-body{
      max-width: 1222px;
      width: 1222px;
    }
  }
  .card-body.info-table{
    padding-top:14px;
    padding-left:18px;
    background: #F9FAFC;
    margin:0 auto;
    padding-bottom:20px;
  }
  .card.section-card{
    padding-bottom:30px;
  }
  .card-header-title{
    font-weight:normal;
    font-size: 16px;
    color: #0B224B;
    font-family:@fontfamily;
  }
  .column.info-title{
    font-weight:normal;
    color: #6B708D;
    font-size: 15px;
    text-align: left;
    font-family:@fontfamily;
  }
  .column.info-value{
    font-size: 15px;
    color: #0B224B;
    font-family:@fontfamily;
    span{
      font-family:@fontfamily;
    }
  }
  @media (min-width: 1240px) {
    .info-title {
      flex: none;
      width: 14%;
    }
  }
  .info-table .column{
    padding-top:0.34rem;
    padding-bottom:0.34rem;
  }
  .columns.is-multiline.transaction-item{
    padding-left:1.95rem;
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
    .transaction-link > .clipboard{
      top:77%;
    }
    .card-body{
      margin:0 auto;
    }
    .columns.is-multiline.transaction-item{
      margin-top:18px!important;
    }
    .address-link > .clipboard:hover, .block-link > .clipboard:hover, .transaction-link > .clipboard:hover{
      transform: translateY(-50%) scale(1.0) !important
    }
    .nopagination{
      display: none;
    }
  }

</style>
