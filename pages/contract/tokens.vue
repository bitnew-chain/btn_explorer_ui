<template>
  <section class="container" ref="section">
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th>{{ $t('misc.ranking') }}</th>
          <th>{{ $t('contract.token.name') }}</th>
          <th>{{ $t('contract.token.total_supply') }}</th>
          <th>{{ $t('contract.token.token_holders') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({address, qrc20, holders}, index) of tokens">
          <td>{{ 20 * (currentPage - 1) + index + 1 }}</td>
          <td>
            <AddressLink :address="address">{{ qrc20.name }}</AddressLink>
          </td>
          <td class="monospace break-word">
            {{ qrc20.totalSupply | qrc20(qrc20.decimals, true) }}
            {{ qrc20.symbol || $t('contract.token.tokens') }}
          </td>
          <td>{{ holders }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination v-if="pages > 1" :pages="pages" :currentPage="currentPage" :getLink="getLink" />
  </section>
</template>

<script>
  import Contract from '@/models/contract'
  import {RequestError} from '@/services/btnorg-api'
  import {scrollIntoView} from '@/utils/dom'

  export default {
    head() {
      return {
        title: this.$t('contract.token.tokens')
      }
    },
    data() {
      return {
        totalCount: 0,
        tokens: [],
        currentPage: Number(this.$route.query.page || 1)
      }
    },
    async asyncData({query, redirect, error}) {
      try {
        if (query.page && !/^[1-9]\d*$/.test(query.page)) {
          redirect('/contract/tokens')
        }
        let page = Number(query.page || 1)
        let {totalCount, tokens} = await Contract.listTokens({from: (page - 1) * 20, to: page * 20})
        if (page > 1 && totalCount <= (page - 1) * 20) {
          redirect('/contract/tokens', {page: Math.ceil(totalCount / 20)})
        }
        return {totalCount, tokens}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          throw err
        }
      }
    },
    methods:{
      //鼠标划过不变色
      nohoverChangeColor(){
          var allLink = document.querySelectorAll('.break-word.monospace')
            for(let i=0; i<allLink.length;i++) {
              allLink[i].onmouseover = function(){
                  let currentNextSibling = this.nextSibling;
                  if(currentNextSibling){
                      currentNextSibling.style.backgroundImage = "";
                  }
                }

              allLink[i].onmouseout = function(){
                  let currentNextSibling = this.nextSibling;
                  if(currentNextSibling){
                      if(!currentNextSibling.dataset.ifclick || currentNextSibling.dataset.ifclick == 'false'){
                          currentNextSibling.style = ''
                      }else if(currentNextSibling.dataset.ifclick == 'true') {
                          currentNextSibling.style.backgroundImage = "";
                      }
                  }
              }
          }
      }
    },
    computed: {
      pages() {
        return Math.ceil(this.totalCount / 20)
      }
    },
    mounted(){
      var _this = this;
      setTimeout(function(){
          _this.nohoverChangeColor()
      },20)

    },
    async beforeRouteUpdate(to, from, next) {
      let page = Number(to.query.page || 1)
      let {totalCount, tokens} = await Contract.listTokens({from: (page - 1) * 20, to: page * 20})
      this.totalCount = totalCount
      if (page > this.pages && this.pages > 1) {
        this.$router.push({name: 'contract-tokens', query: {page: Math.ceil(totalCount / 20)}})
        return
      }
      this.tokens = tokens
      this.currentPage = page
      next()
      scrollIntoView(this.$refs.section)
    }
  }
</script>

<style scoped>
  .table {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  } 
</style>
