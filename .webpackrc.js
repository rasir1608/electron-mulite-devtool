const path = require('path');
const location = {
  target: 'http://localhost:8080',
  // changeOrigin: true,
  // pathRewrite: { '^/api': '' },
};
const sit = {
  target: 'http://xxxx.xxx.com',
};

const pathList = [
];
const dev = 0;

const proxyConf = {};

pathList.forEach(path => {
  proxyConf[path] = JSON.parse(JSON.stringify(dev ? sit : location));
});

function assetsPath(_path) {
  return path.posix.join('static', _path);
}

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      publicPath: '/',
    },

    production: {
      publicPath: './',
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    '@': path.resolve(__dirname, 'src'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  hash: true,
  proxy: {
    ...proxyConf,
  },
};
