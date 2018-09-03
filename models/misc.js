import * as BtnorgAPI from '@/services/btnorg-api'

class Misc {
  static richList({from, to}) {
    return BtnorgAPI.get(`/misc/rich-list`, {params: {from, to}})
  }

  static biggestMiners({from, to}) {
    return BtnorgAPI.get(`/misc/biggest-miners`, {params: {from, to}})
  }

  //获取实时算力
    static getDescriptions() {
        return BtnorgAPI.get(`/misc/description`)
    }
}

export default Misc
