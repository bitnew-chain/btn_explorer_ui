<template>
  <section class="container container-blockmore" ref="list">
    <!--<div>{{date}}</div>-->
    <div class="card-header">
      <div class="card-header-icon">
        <span class="fa fa-cubes fa-fw"></span>
      </div>
      <h3 class="card-header-title">{{ $tc('blockchain.block',2) }}</h3>
    </div>
    <form action="/block" method="GET" @submit.prevent="submit" class="blockindex-form">
      <div class="control">
        <datePickers/>
        <!--<input type="date" class="input blockinput" name="date" v-model="date">-->
        <button type="submit" class="button is-btn"></button>
      </div>
    </form>
    <table class="table is-fullwidth is-bordered is-striped">
      <thead>
        <tr>
          <th class="tr-blockheight">{{ $t('block.list.height') }}</th>
          <th class="is-hidden-touch">{{ $t('block.list.mined_by') }}</th>
          <th>{{ $t('block.list.time') }}</th>
          <th class="is-hidden-touch tr-blockreward">{{ $t('block.list.reward') }}</th>
          <th class="is-hidden-touch tr-blocksize">{{ $t('block.list.size') }}</th>
          <th class="is-hidden-touch tr-difficulty">{{ $t('block.list.difficulty') }}</th>
          <th class="tr-transactionnum">{{ $t('block.list.transactions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{height, timestamp, size, reward, minedBy, txLength,duration} of list">
          <td class="tr-blockheight">
           <BlocklinkIndex :block="height" :clipboard="false" />
          </td>
          <td class="is-hidden-touch">
            <AddressLink :address="minedBy" />
          </td>
          <!--<td>{{ timestamp | timestamp() }}</td>-->
          <td><FromNow :timestamp="timestamp" /></td>
          <td class="is-hidden-touch monospace tr-blockreward">{{ reward | btn(2) }} BTN</td>

          <td class="is-hidden-touch monospace tr-blocksize">{{ size.toLocaleString() }}</td>
          <td class="is-hidden-touch monospace tr-difficulty">{{duration}}</td>
          <td class="tr-transactionnum">{{ txLength }}</td>
        </tr>
      </tbody>
    </table>
    <!--<form action="/block" method="GET" @submit.prevent="submit" class="blockindex-form">-->
      <!--<div class="control">-->
        <!--<input type="date" class="input blockinput" name="date" v-model="date">-->
        <!--<button type="submit" class="button is-btn"></button>-->
      <!--</div>-->
    <!--</form>-->
  </section>
</template>

<script>
  import Block from '@/models/block'
  import {RequestError} from '@/services/btnorg-api'
  import {scrollIntoView} from '@/utils/dom'

  function formatTimestamp(date) {
    let yyyy = date.getFullYear().toString()
    let mm = (date.getMonth() + 1).toString().padStart(2, '0')
    let dd = date.getDate().toString().padStart(2, '0')
    return yyyy + '-' + mm + '-' + dd
  }

  function formatUTCTimestamp(date) {
    let yyyy = date.getUTCFullYear().toString()
    let mm = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    let dd = date.getUTCDate().toString().padStart(2, '0')
    return yyyy + '-' + mm + '-' + dd
  }

  export default {
    head() {
      return {
        title: this.$t('block.list.block_list')
      }
    },
    data() {
      return {
        list: [],
        date: ''
      }
    },
    async asyncData({query, redirect, error}) {
      let date = query.date && new Date(query.date)
      if (date && (
        date.toString() === 'Invalid Date'
        || date.getTime() < Date.parse('2017/09/06')
        || date.getTime() >= Date.now() + 1000 * 60 * 60 * 24
      )) {
        redirect('/block')
      }
      try {
        let list = await Block.getBlocksByDate(date)
        return {list, date: formatTimestamp(date ? new Date(date) : new Date())}
      } catch (err) {
        if (err instanceof RequestError) {
          error({statusCode: err.code, message: err.message})
        } else {
          throw err
        }
      }
    },
    methods: {
      submit() {
          var currentDate = document.getElementById('datePickers').value;
        // let date = new Date(this.date);
          let date  = new Date(currentDate)
        if (date.toString() === 'Invalid Date') {
            alert('日期不可用')
          return
        } else if (date.getTime() < Date.parse('2017-09-06')) {
            alert('日期不可小于' + '2017-09-06')
          return
        } else if (date.getTime() >= Date.now() + 1000 * 60 * 60 * 24) {
            alert('日期不可大于明天')
          return
        }
        this.$router.push({name: 'block', query: {date: formatTimestamp(date)}})
      }
    },
      created(){

      },
    mounted() {
        var currentDateObj = document.getElementById('datePickers');
        currentDateObj.value = this.date
      this.$websocket.subscribe('block')
      this.$websocket.on('block', block => {
        block.txLength = block.tx.length
        let todayTimestamp = Date.parse(this.date + 'T00:00:00') / 1000
        if (block.timestamp >= todayTimestamp && block.timestamp < todayTimestamp + 60 * 60 * 24) {
          this.list.unshift(block)
        }
      })

      setTimeout(()=>{
          scrollTo(0,0);
      },20)
    },
    beforeDestroy() {
      this.$websocket.unsubscribe('block')
    },
    async beforeRouteUpdate(to, from, next) {
      let date = to.query.date && new Date(to.query.date)
      if (date && (
        date.toString() === 'Invalid Date'
        || date.getTime() < Date.parse('2017-09-06')
        || date.getTime() >= Date.now() + 1000 * 60 * 60 * 24
      )) {
        this.$router.push({name: 'block'})
        return
      }
      this.list = await Block.getBlocksByDate(date)
      this.date = formatTimestamp(date)
      next()
      scrollIntoView(this.$refs.list)
    }
  }
</script>

<style lang="less" scoped>
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  .table {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .blockindex-form {
    display: flex;
    .control {
      display: flex;
      margin-left: auto;
      margin-right: auto;
      > button {
        margin-left: 0.5em;
      }
    }
  }
  .container-blockmore{
    box-shadow:0px 0px  10px 3px rgba(140,147,200,0.19);
    margin:14px auto;
    background-color:#fff;
    padding-bottom:40px;
  }
  @media screen and (min-width: 1300px) {
    .container-blockmore {
      max-width: 1300px;
      width: 1300px;
    }
  }
  .card-header{
    box-shadow: none;
  }
  .fa-cubes{
    width:16px;
    height: 16px;
    content: '';
    background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAMhJREFUOBFjDEhoEGBgYDAAYqxAjE3yKEji1a/n1lgVQAQvsABpg3///+7Hpej977diIDl8apgYmR2ZcBlAqvgwNggU2ASBIKvwB2CsOeJRCI41PPIQqVmz0n8DWQfwKSTKRYHZbcJ/v36/jssgRkbmAJb/jAy/gApe41L0h4vhH8s3Bqa//xlEcalhZGBgA2LCIDSxTfTnv++vcKkEJUgWYrIIMHXjMgMuTnQWgevAwRjGKZtqXgMF9gVQ9OEIQwZQ9gDJEcoiAMiNPo6trFGiAAAAAElFTkSuQmCC) no-repeat center;
    background-size:100%  100%;
  }
  .fa-cubes:before{
    content: '';
  }
  .card-header-icon{
    padding-left:3.2rem;
    padding-right:0;
  }
  .card-header-title{
    font-weight:normal;
    font-size: 16px;
    color: #0B224B;
    font-family:@fontfamily;
  }
  form .control > button.is-btn{
    margin-left:0;
    border-radius:0;
  }
  form .control > .blockinput{
    border: 1px solid #D5DBE5;
    border-right:0;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    text-align: center;
  }
  .control{
    margin:0 auto;
  }
  @media screen and (min-width: 356px) {
    .control {
      max-width: 356px;
      width: 356px;
    }
  }
  @media screen and (min-width: 356px) {
    .blockinput {
      max-width: 276px;
      width: 276px;
    }
  }
  @media screen and (min-width: 356px) {
    button.is-btn {
      max-width: 80px;
      width: 80px;
    }
  }
  button.is-btn{
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAtCAYAAADydghMAAAAAXNSR0IArs4c6QAAAp1JREFUaAXdmj9IlVEYxjX7g1IaiFSakEoRGELQEDkZOTS6iA4NNjQoUVCLDUHocJcQRYImoSmaosladLJFKqRACSUQ0QgVM5DIuv4ONIS87wnklfO934EH733ee877/O6n3u873y0pycgoFotlaBitoXnUlZFo+xMDwNto97i7P90ysCqkY7tp/z5/kIF49hGA61SAgz1o3zEDKwL2MAL9OAMR7SMAfC8C/YRaqX3XxCsC1Yv+KOBj+AcSR7RvD1QP+o2k8RzzoH3XxCsC1Y1+ScR4L9HhxBHt2wPVgX4iaYxjltt3TbwiUNfRlkSMN4GOJo5o3x6oNvQDSWMKs8q+a+IVgbqCNiRivGlUnTiifXugLqFVJI0ZzBP2XROvCFQL+ioR482iusQR7dsDdR4tIWksYJ6x75p4RaCa0BeJGG8RnU0c0b49UPXoM5LGMmazfdfEKwJ1Cn2SiPG+oYuJI9q3B6oGvUfSWMe8HLqW8qCWn6OoFXk/Nw35K5A0NjHbA/Cb8EB6RQ69DwH4O2DHcggnIW2FC+kJqZJTbyYc4XD+WUB5+BuuhKNGOVir+G1KzZ/NgYt9Hq9Qv+CPSkkMTCOKnXGdU6b6swH93zl1gz8qJTGwsaumOeqnlan+bGBi18UfqZ/0R6UkBqYVaTsf76jlZ+cDmKtI29t6S+248j75s4GJ7V5OUs/P7iUwsf3p19Tzsz8NTDfS7kC8onbE3++rkhiYm0i7x/SC2iFlqj8bmD6k3UV8Rq3MH5WSGJj7SBtPKeTnPjEwsW8CDCnvkU8b2IJ2WPEHfFIJqYEJ1+YjEdh+YZpfC9BHEdg7fsmU5MBKW6zhP/QtZYpvG7DwMfPv2ObJDd9UkfTAhY308L2NTRSO9rXIy/dc2gH0Wg8plALZIwAAAABJRU5ErkJggg==") no-repeat center;
    background-size:20px 16px;
    background-color: #657EFF;
    &:hover{
      border:none;
    }
  }
  .table thead td, .table thead th{
    border:none;
    text-align: center;
    font-family: @fontfamily;
  }
  table,tr,td,thead,tbody{
    border:none;
  }
  table td, table th{
    text-align:center;
    border:none;
    vertical-align: middle;
  }
  thead tr{
    background-color: #F9FAFC;
    font-family:@fontfamily;
    font-size: 15px;
    color: #6B708D;

  }
  thead tr th,tbody tr td{
    font-weight:normal;
    padding:14px 0;

  }
  tbody tr td a,tbody tr td span,tbody tr td{
    font-family:@fontfamily;
    font-size: 15px;
  }
  tbody tr td span{
    color: #0B224B;
  }
  .table{
    margin-top:1.5rem;
  }
  .tr-blockheight{
    padding:0 1.8rem 0 1.8rem;
  }
  .tr-transactionnum{
    padding-right:1.5rem;
  }
  @media screen and (min-width: 1300px) {
    .tr-difficulty {
      max-width: 204px;
      width: 204px;
    }
  }
  @media screen and (min-width: 1300px) {
    .tr-transactionnum {
      max-width: 130px;
      width: 130px;
    }
  }
  @media screen and (min-width: 1300px) {
    .tr-blockreward {
      max-width: 156px;
      width: 156px;
    }
  }
  @media screen and (min-width: 1300px) {
    .tr-blocksize {
      max-width: 156px;
      width: 156px;
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
    .transaction-link > .clipboard{
      top:77%;
    }
    .card-body{
      margin:0 auto;
    }
    .columns.is-multiline.transaction-item{
      margin-top:18px;
    }
    .address-link > .clipboard:hover, .block-link > .clipboard:hover, .transaction-link > .clipboard:hover{
      transform: translateY(-50%) scale(1.0) !important
    }
  }
</style>
