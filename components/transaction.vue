<template>
  <div class="columns is-multiline transaction-item">
    <div class="column is-full is-clearfix">
      <div class="pull-left collapse-bottom">
        <Icon
                :icon="collapsed ? 'chevron-right' : 'chevron-down'" fixedWidth
                class="toggle-collapse"
                @click="collapsed = !collapsed" />
        <TransactionLink :transaction="id" />
      </div>
      <div class="pull-right pull-no">
        <span v-if="transaction.timestamp" class="timestamp">
          {{ transaction.timestamp | timestamp }}
        </span>
      </div>
    </div>
    <div class="column is-clearfix collapse">
      <template v-if="inputs[0].coinbase">{{ $t('transaction.coinbase_input') }}</template>
      <template v-else>
        <div v-for="input in inputs" class="is-clearfix">
          <AddressLink v-if="input.address" :address="input.address" class="pull-left"
                       :highlight="highlightAddress" />
          <span v-else class="pull-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="pull-right amount">
            {{ input.value | btn(8) }} BTN
          </span>
        </div>
      </template>
    </div>
    <Icon icon="arrow-right" class="column arrow collapse"></Icon>
    <div class="column is-half collapse">
      <template v-if="collapsed">
        <div v-for="output in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="pull-left"
                       :highlight="highlightAddress" />
          <span v-else-if="output.scriptPubKey.type === 'nonstandard'">
            {{ $t('transaction.empty_output') }}
          </span>
          <span v-else-if="output.scriptPubKey.type === 'nulldata'">
            {{ $t('transaction.op_return_output') }}
          </span>
          <span v-else class="pull-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | btn(8) }} BTN
          </span>
          <span class="pull-right" v-else-if="contractInfo">
            {{ $t('transaction.utxo.contract_' + contractInfo.type) }}
          </span>
        </div>
      </template>
      <template v-else>
        <div v-for="output in outputs" class="is-clearfix">
          <AddressLink v-if="output.address" :address="output.address" class="pull-left"
                       :highlight="highlightAddress" />
          <span v-else-if="output.scriptPubKey.type === 'nonstandard'">
            {{ $t('transaction.empty_output') }}
          </span>
          <span v-else-if="output.scriptPubKey.type === 'nulldata'">
            {{ $t('transaction.op_return_output') }}
          </span>
          <span v-else class="pull-left">{{ $t('transaction.unparsed_address' )}}</span>
          <span class="pull-right amount" v-if="output.value">
            {{ output.value | btn(8) }} BTN
          </span>
          <span class="pull-right" v-else-if="contractInfo">
            {{ $t('transaction.utxo.contract_' + contractInfo.type) }}
          </span>
          <div class="is-clearfix"></div>
          <div class="output-script">
            <div>
              <span class="key">{{ $t('transaction.utxo.type') }}</span>
              <span class="value">{{ output.scriptPubKey.type }}</span>
            </div>
            <div v-if="output.scriptPubKey.asm">
              <span class="key">{{ $t('transaction.utxo.script') }}</span>
              <code class="value">{{ output.scriptPubKey.asm | btn-script }}</code>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-for="({token, from, to, amount}, index) in tokenTransfers">
      <div class="column is-full flex-full"></div>
      <AttributeInjector
              class="column collapse token-transfer-list"
              :class="{
          'first-item': index === 0,
          'last-item': index === tokenTransfers.length - 1
        }">
        <div class="is-clearfix">
          <div v-if="from" class="is-clearfix">
            <AddressLink :address="from" class="pull-left" :highlight="highlightAddress" />
            <span class="pull-right amount">
              {{ amount | qrc20(token.decimals) }}
              <AddressLink :address="token.address" :highlight="highlightAddress">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </span>
          </div>
          <template v-else>{{ $t('contract.token.mint_tokens') }}</template>
        </div>
        <Icon icon="arrow-right" class="arrow"></Icon>
        <div class="is-half">
          <div v-if="to" class="is-clearfix">
            <AddressLink :address="to" class="pull-left" :highlight="highlightAddress" />
            <span class="pull-right amount">
              {{ amount | qrc20(token.decimals) }}
              <AddressLink :address="token.address" :highlight="highlightAddress">
                {{ token.symbol || $t('contract.token.tokens') }}
              </AddressLink>
            </span>
          </div>
          <template v-else>{{ $t('contract.token.burn_tokens') }}</template>
        </div>
      </AttributeInjector>
    </template>
    <code class="column is-full break-word" v-if="contractInfo && !collapsed">{{ contractInfo.code }}</code>
    <div class="column is-full has-text-right collapse-bottom" v-if="fees">
      <template v-if="fees > 0">
        {{ $t('transaction.fee') }} <span class="amount fee">{{ fees | btn }} BTN</span>
      </template>
      <template v-else>
        {{ $t('transaction.reward') }} <span class="amount fee">{{ -fees | btn }} BTN</span>
      </template>
    </div>
    <div class="confirmnum">
      <!--<nuxt-link v-if="confirmations" :to="{name: 'block-id', params: {id: transaction.blockHeight}}"-->
      <!--class="tag" :class="confirmations >= 10 ? 'is-success' : 'confirmation-' + confirmations">-->
      <!--{{ confirmations }} {{ $tc('transaction.confirmations', confirmations) }}-->
      <!--</nuxt-link>-->
      <nuxt-link v-if="confirmations" :to="{name: 'block-id', params: {id: transaction.blockHeight}}"
                 class="tag confirmation-color" :class="[{'confirmation-onetype': confirmations >= 0  && confirmations <=5},{'confirmation-twotype':confirmations >= 6  && confirmations <=11},{ 'is-success' : confirmations > 11 } ]">
        {{ confirmations }} {{ $tc('transaction.confirmations', confirmations) }}

      </nuxt-link>
      <span v-else class="tag is-danger">{{ $t('transaction.unconfirmed') }}</span>
    </div>
  </div>
</template>

<script>
    import Transaction from '@/models/transaction'

    export default {
        data() {
            return {
                collapsed: true
            }
        },
        props: {
            transaction: {type: Object, required: true},
            highlightAddress: String
        },
        computed: {
            blockchain() {
                return this.$store.state.blockchain
            },
            id() {
                return this.transaction.id
            },
            inputs() {
                return this.transaction.vin
            },
            outputs() {
                return this.transaction.vout
            },
            fees() {
                return this.transaction.fees
            },
            confirmations() {
                return this.transaction.blockHeight == null
                    ? 0
                    : this.blockchain.height - this.transaction.blockHeight + 1
            },
            tokenTransfers() {
                return this.transaction.tokenTransfers
            },
            contractInfo() {
                for (let output of this.outputs) {
                    let chunks = output.scriptPubKey.asm.split(' ')
                    switch (chunks[chunks.length - 1]) {
                        case 'OP_CREATE':
                            return {
                                type: 'create',
                                version: chunks[0],
                                gasLimit: chunks[1],
                                gasPrice: chunks[2],
                                code: chunks[3]
                            }
                        case 'OP_CALL':
                            return {
                                type: 'call',
                                version: chunks[0],
                                gasLimit: chunks[1],
                                gasPrice: chunks[2],
                                code: chunks[3],
                                address: chunks[4]
                            }
                    }
                }
                return null
            }
        },
        filters: {
            'btn-script'(asm) {
                let chunks = asm.split(' ')
                if (['OP_CREATE', 'OP_CALL'].includes(chunks[chunks.length - 1])) {
                    chunks[3] = '[byte code]'
                    return chunks.join(' ')
                } else {
                    return asm
                }
            }
        },
        mounted() {
            if (this.transaction.confirmations) {
                return
            }
            this.$websocket.subscribe('transaction/' + this.id)
            this.$options.subscribing = true
            this.$websocket.on('transaction/' + this.id, transaction => {
                this.$emit('transaction-change', transaction)
                this.$websocket.unsubscribe('transaction/' + this.id)
                this.$options.subscribing = false
            })
        },
        beforeDestroy() {
            if (this.$options.subscribing) {
                this.$websocket.unsubscribe('transaction/' + this.id)
            }
        },
        subscribing: false
    }
</script>

<style lang="less" scoped>
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  .transaction-item {
    padding-left: 0.75em;
    padding-right: 0.75em;
    &::before {
      display: block;
      width: 100%;
      height: 1px;
      background-color: #ccc;
      content: "";
    }
    &:first-child {
      margin-top: 0;
      &::before {
        display: none;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  .flex-full {
    padding: 0;
  }

  .toggle-collapse {
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.2);
    }
  }

  .tag:link {
    text-decoration: none;
  }

  .tag, .timestamp {
    margin-left: 1em;
    font-family: @fontfamily;
  }

  .confirmation-1 {
    background-color: #fa4035;
    color: white;
  }
  .confirmation-2 {
    background-color: #f56f33;
    color: white;
  }
  .confirmation-3 {
    background-color: #f19d31;
    color: white;
  }
  .confirmation-4 {
    background-color: #ecca2f;
  }
  .confirmation-5 {
    background-color: #dae72c;
  }
  .confirmation-6 {
    background-color: #a6e32a;
  }
  .confirmation-7 {
    background-color: #74de28;
    color: white;
  }
  .confirmation-8 {
    background-color: #43da26;
    color: white;
  }
  .confirmation-9 {
    background-color: #24d535;
    color: white;
  }

  .output-script {
    font-size: 0.8em;
    .key {
      display: inline-block;
      margin-left: 2em;
      margin-right: 1em;
      font-weight: bold;
    }
    code {
      word-break: break-all;
    }
  }

  .arrow {
    flex: 0;
    line-height: 1.5em;
  }
  .amount {
    font-family: Monospace;
  }
  .fee {
    margin-left: 0.5em;
  }

  .token-transfer-list {
    &:not(.first-item) {
      padding-top: 0;
    }
    &:not(.last-item) {
      padding-bottom: 0;
    }
  }
  .monospace{
    font-family: @fontfamily;
    cursor: pointer;
    font-size: 14px;
  }
  .amount{
    font-family: @fontfamily;
    font-size: 15px;
  }
  .column{
    font-size: 15px;
  }
  .is-clearfix{
    padding:0.4rem 0;
    span{
      font-size: 15px;
      font-family: @fontfamily;
    }
  }
  .is-full.is-clearfix{
    padding:0;
    margin-right:20px;

    background: #F9FAFC;
    >div{
      display: inline-block;
    }
  }
  .pull-left.collapse-bottom{
    border-left:4px solid #568DEF;
    padding:0.8rem 0;

  }

  .fa-chevron-right:before{
    content: '';
  }
  .column.is-half.collapse{
    padding-top:0.3rem;
    padding-left:3.5rem;
    padding-right:1.2rem;
  }
  .transaction-item:before{
    height:0;
  }
  .fa-arrow-right:before{
    content: '';
  }
  .fa-arrow-right{
    margin-left:2.4rem;
    width:28px;
    height:48px;
    content: '';
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAeCAYAAACyqDnLAAAAAXNSR0IArs4c6QAAA7RJREFUaAXtmUtME0EYgGe2lFIplJISlIePWlqJgBGESOIDFSIG2qCGGCXGmzcTj4ZEjScv3kw8awwXGwVBBOXh46CJRqMSFEiLaAwkIC30waNud/wXM6Fpt90tj0i23cu/8z+m+3+dnX9mFiOZXuk7rbUc4q4gQkoQRi5C0AuMk5u9jtbJ9UwZr2fn/6tvjcFyjSDuRujvY4ymMEpq8Dgevwm1rVVbdkDTTfUVARYBMKIQggRQ3YwC17hHnrwTsq9Wx6y2g40WT1h0JhJM/lnh1U/nWPRMa7SUrsezyw4oh4hZDBRBJCPAcT0Zpvo9Yr6x2mUHFGPskAKBIJTJBlCvxmjZLcVfqo/8gBJsg+SBl/hFCNEjjvSlmSy7xL2leQhO3NJCN6aX3zXyU5Vp1sPTVUh8Qg3hyGm1zty+6BpxSoyJ6Ca7EcpneqJUfRmq+YOIWYcbtgQw6dea6gzhptg0sgRqs9kC+/LLm2A+bZWMg6A8lkX9GYWntkmOEXCU3To0OMeysovKIdf4Q5hSLcH66Pf4u4pJPuS0P/oV3U/YKmugfMpG4yXVBBltgzJVK4wgXAsj256SxBz+Pdw+Hm6NrpHlKx+cst1+ezErP+skjJzeYH20e6j+xoU/XH9qkTU7mp+QTfYjlCadV9monpmcfwqwqqhOTMJIHURYfcRrt02J+VJ73ADlE84uOZ/q87q6Yad0gAIQkxjhLzhZedQz1Dot5svb4woon7DebE1bYLnnMFL3821JF8YflWlJx2Y+tc2I+ccdUB6IztCo9aP5Hqj+5WKAlu34vYrRVjvtLe5lXfhdXALlMWiL63TsHO6D46e94ViENTCnvoXqfxyqv0fYAyHZV/lIic8OdLoYpbKGnyMj+YTqYZqohOrfyc/FoTbajlugPIClQsOoq2Gb+pUCEZNQ0A76fM4OftUg5Bv2yvP0FxmPUshZrrrAXGAzx3LdkJ/kbSeA69FvzbKOvby7EMxlCWhOmWXT7Ay5jgm6AP9AzIvZ4A7j6h7jru0p6obBQZuf5q1YWvBO+1/D1qwRlBpqSEhJBApmA2wBHBnCecG/S8Gl7LgKMM9SRULGTKBIpSsc8LuGv/GRDMBsirmLREAIAe4cVTDwFTCXNhJyhQQwyqGRDKzDftBGQq6UABmjkQxm0D3aSMiVEWAQc59GMiZtzi3YUr2iioSMjQCsO++4HR1dNEoxMfGBKzZUtTj93nlEcC6cP2nBKLuvoTThNZI+OKj7rMC42TPaeTO4z78NORElSj5rnAAAAABJRU5ErkJggg==) no-repeat center;
    background-size:24px 10px;
  }
  .column.is-clearfix.collapse{
    padding-left:1.4rem;
    padding-right:1.3rem;
    font-family: @fontfamily;
  }
  .column.is-full.is-clearfix{
    .pull-right{
      padding:0.8rem 0;
    }
  }
  .confirmnum{
    width:100%;
    text-align: right;
    padding-right:20px;
    margin-top:6px;
  }

  .confirmation-onetype{
    background: #FF6565;
  }
  .confirmation-twotype{
    background: #FFC765;
  }
  .is-success{
    background: #03C592;
  }
  .confirmation-color{
    border-radius: 5px;
    width:132px;
    height:30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #FFFFFF;
  }
  .has-text-right{
    padding-right:1.2rem;
  }
  .columns.is-multiline.transaction-item{
    margin-top:40px;
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
  }
  @media screen and (max-width:500px) {
    .pull-no{
      float:none;
      border-left: 4px solid #568DEF;

    }
  }
</style>
