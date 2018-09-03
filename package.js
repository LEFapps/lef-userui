Package.describe({
  summary: 'Simple UI elements for user login/logout',
  version: '1.0.0',
  name: 'lef:userui',
  git: 'https://github.com/LEFapps/lef-userui'
})

Package.onUse(api => {
  api.use(['ecmascript', 'lef:translations', 'react-meteor-data'])
  api.mainModule('client.js', 'client')
})

Npm.depends({
  react: '16.3.0',
  reactstrap: '5.0.0',
  'prop-types': '15.6.1'
})
