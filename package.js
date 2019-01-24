Package.describe({
  summary: 'Simple UI elements for user login/logout',
  version: '1.0.9',
  name: 'lef:userui',
  git: 'https://github.com/LEFapps/lef-userui'
})

Package.onUse(api => {
  api.use([
    'ecmascript',
    'lef:translations',
    'lef:alerts',
    'lef:systemmailing',
    'react-meteor-data'
  ])
  api.addFiles('server.js', 'server')
  api.addFiles('userui.css', 'client')
  api.mainModule('client.js', 'client')
})

Npm.depends({
  react: '16.5.0',
  reactstrap: '6.5.0',
  'prop-types': '15.6.1',
  '@fortawesome/fontawesome': '1.1.8',
  '@fortawesome/fontawesome-svg-core': '1.2.0',
  '@fortawesome/free-solid-svg-icons': '5.2.0',
  '@fortawesome/react-fontawesome': '0.1.0'
})
