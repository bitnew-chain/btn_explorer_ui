import * as BtnorgAPI from '@/services/btnorg-api'

class Contract {
  static get(hash) {
    return BtnorgAPI.get(`/contract/${hash}`)
  }

  static getUtxo(hash) {
    return BtnorgAPI.get(`/contract/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return BtnorgAPI.get(`/contract/${hash}/txs`, {params: {from, to}})
  }

  static listTokens({from, to}) {
    return BtnorgAPI.get(`/contract/tokens`, {params: {from, to}})
  }
}

export default Contract
