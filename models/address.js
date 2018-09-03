import * as BtnorgAPI from '@/services/btnorg-api'

class Address {
  static get(hash) {
    return BtnorgAPI.get(`/address/${hash}`)
  }

  static getUtxo(hash) {
    return BtnorgAPI.get(`/address/${hash}/utxo`)
  }

  static getTransactions(hash, {from, to}) {
    return BtnorgAPI.get(`/address/${hash}/txs`, {params: {from, to}})
  }
}

export default Address
