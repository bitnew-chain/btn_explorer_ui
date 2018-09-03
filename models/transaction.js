import * as BtnorgAPI from '@/services/btnorg-api'

class Transaction {
  static get(id) {
    if (Array.isArray(id)) {
      if (id.length === 0) {
        return []
      } else {
        return BtnorgAPI.get('/txs/' + id.join(','))
      }
    } else {
      return BtnorgAPI.get(`/tx/${id}`)
    }
  }
}

export default Transaction
