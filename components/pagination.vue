<template>
  <nav class="pagination is-centered" :class="showFull ? '' : 'is-small'">
    <ul class="pagination-list">
      <template v-if="showFull">
        <li v-if="currentPage > 3">
          <nuxt-link :to="getLink(1)" class="pagination-link">1</nuxt-link>
        </li>
        <li v-if="currentPage > 4">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage > 2">
          <nuxt-link :to="getLink(currentPage - 2)" class="pagination-link">
            {{ currentPage - 2 }}
          </nuxt-link>
        </li>
      </template>
      <template v-else>
        <li v-if="currentPage > 2">
          <nuxt-link :to="getLink(1)" class="pagination-link">1</nuxt-link>
        </li>
        <li v-if="currentPage > 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
      </template>
      <li v-if="currentPage > 1">
        <nuxt-link :to="getLink(currentPage - 1)" class="pagination-link">
          {{ currentPage - 1 }}
        </nuxt-link>
      </li>
      <li>
        <a href="#" class="pagination-link is-current" @click.prevent>
          {{ currentPage }}
        </a>
      </li>
      <li v-if="currentPage < pages">
        <nuxt-link :to="getLink(currentPage + 1)" class="pagination-link">
          {{ currentPage + 1 }}
        </nuxt-link>
      </li>
      <template v-if="showFull">
        <li v-if="currentPage < pages - 1">
          <nuxt-link :to="getLink(currentPage + 2)" class="pagination-link">
            {{ currentPage + 2 }}
          </nuxt-link>
        </li>
        <li v-if="currentPage < pages - 3">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage < pages - 2">
          <nuxt-link :to="getLink(pages)" class="pagination-link">
            {{ pages }}
          </nuxt-link>
        </li>
      </template>
      <template v-else>
        <li v-if="currentPage < pages - 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="currentPage < pages - 1">
          <nuxt-link :to="getLink(pages)" class="pagination-link">
            {{ pages }}
          </nuxt-link>
        </li>
      </template>
      <li>
        <form class="pagination-form" @submit.prevent="submit">
          <label class="label">{{ $t('pagination.go_to') }}</label>
          <div class="control">
            <input type="text" class="input has-text-centered" :class="{'is-small': !showFull}"
              v-model="inputValue" ref="input">
          </div>
        </form>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        showFull: true,
        inputValue: ''
      }
    },
    props: {
      pages: {type: Number, required: true},
      currentPage: {type: Number, required: true},
      getLink: {type: Function, required: true}
    },
    methods: {
      resize() {
        this.showFull = document.documentElement.clientWidth > 768
      },
      submit() {
        let input = this.inputValue.trim()
        if (/^[1-9]\d*$/.test(input)) {
          let page = Number.parseInt(input)
          if (page <= this.pages && page !== this.currentPage) {
            this.$router.push(this.getLink(page))
          }
        }
      }
    },
    watch: {
      currentPage() {
        this.inputValue = ''
        this.$refs.input.blur()
      }
    },
    mounted() {
      this.resize()
      window.addEventListener('resize', this.resize, false)
    },
    beforeDestory() {
      window.removeEventListener('resize', this.resize)
    }
  }
</script>

<style lang="less" scoped>
  @fontfamily:'黑体',PingFangSC-Regular,pingfangsc;
  input{
    outline: none;
    border:none;
    -webkit-appearance: none;
    box-shadow: none;
    &:focus {
      outline: none;
    }
    border: 1px solid #D5DBE5;
    border-radius: 2px;
  }
  .pagination-form {
    margin-left: 2em;
    .label {
      display: inline-block;
      margin-bottom: 0;
      margin-right: 0.5em;
      @media (min-width: 769px) {
        line-height: 2;
      }
    }
    .control {
      display: inline-block;
      width: 3.5em;
      vertical-align: middle;
      @media (max-width: 768px) {
        width: 3em;
      }
    }
  }
  .pagination-link,.has-text-centered,.pagination-form .label{
    font-family: @fontfamily;
  }
  .pagination-link.is-current {
    background-color: #657EFF;
    border-color: #657EFF;
    color: #fff;
  }
  @media screen and (min-width: 769px) {
    .pagination:first-child{
      justify-content: flex-end;
      position: relative;
      top:40px;
    }
  }
  @media screen and (min-width: 769px) {
    .pagination-list:first-child{
      flex-grow:0;
    }
  }
  @media screen and (min-width: 769px) {
    .pagination:last-child{
      .pagination-list:first-child{
        flex-grow:1;
      }
    }
  }
  .label{
    font-weight:normal;
    font-size: 15px;
    color: #0B224B;
  }
  .pagination-link{
    font-size: 14px;
    color: #0B224B;
  }
  .pagination-previous, .pagination-next, .pagination-link{
    min-width:2.10em;
  }
  .pagination-previous, .pagination-next, .pagination-link, .pagination-ellipsis{
    height:2.10em;
  }
</style>
