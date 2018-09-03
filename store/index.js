import BtnorgAPI from '@/services/btnorg-api'
import {getLocale} from '@/plugins/i18n'

export const actions = {
  async nuxtServerInit({commit}, {req}) {
    let {data} = await BtnorgAPI.get('/info')
    commit('blockchain/height', data.height)
    commit('locale/language', getLocale(req))
  }
}
