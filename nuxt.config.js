const webpack = require('webpack')

module.exports = {
  head: {
    titleTemplate: '%s - explorer.btn.ORG',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'}
    ]
  },
  css: [
    'bulma/css/bulma.css',
    'font-awesome/css/font-awesome.css',
    '@/styles/common.less',
    '@/styles/card.less',
    '@/styles/info-table.less',
    '@/icons/style.css',
    '@styles/base.less'
  ],
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => ['script', 'style', 'font'].includes(type)
    }
  },
  build: {
    extend(config, {isServer}) {
      config.module.rules.push({
        test: /\.ya?ml$/,
        use: ['json-loader', 'yaml-loader']
      })
      config.plugins.push(new webpack.DefinePlugin({
        'process.env.btnorgAPIBase': JSON.stringify(process.env.btnORG_API_BASE
          || process.env[isServer ? 'btnORG_API_BASE_SERVER' : 'btnORG_API_BASE_CLIENT']
          || 'http://localhost:3001/btn-api/'),
          //|| 'http://explorer.btn.org/api/'),
        'process.env.btnorgWSBase': JSON.stringify(process.env.btnORG_WS_BASE
          || process.env.btnORG_API_BASE_WS
          || '//localhost:3002/btn-ws/'),
          //|| '//explorer.btn.org/ws/'),
        'process.env.network': JSON.stringify(process.env.btn_NETWORK || 'mainnet')
      }))
    },
    extractCSS: true,
    postcss: {
      plugins: {
        'postcss-cssnext': {
          features: {
            customProperties: false
          }
        }
      }
    }
  },
  plugins: [
    '~/plugins/components.js',
    '~/plugins/i18n.js',
    '~/plugins/btn-utils.js',
    {src: '~/plugins/websocket.js', ssr: false}
  ]
};
