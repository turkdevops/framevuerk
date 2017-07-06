var pkg = require('../package.json');
var path = require('path');
var webpack = require('webpack');

const CONFIG = {};
CONFIG.NODE_ENV = process.env.NODE_ENV || 'production';
CONFIG.THEME_COLOR = process.env.THEME_COLOR || '#1f89dd';
CONFIG.DIRECTION = process.env.DIRECTION || 'rtl';
CONFIG.LOCALE = process.env.LOCALE || 'fa';
console.log(CONFIG);

const scssLoader = [
  'style-loader',
  'css-loader',
  {
    loader: 'sass-loader',
    options: {
      data: '\
        $env:'+CONFIG.NODE_ENV+';\
        $direction:'+CONFIG.DIRECTION+';\
        $theme-color:'+CONFIG.THEME_COLOR+';\
        $locale:'+CONFIG.LOCALE+';\
      ',
      outputStyle: CONFIG.NODE_ENV !== 'development'? 'compressed': 'normal'
    }
  }
];

const plugins = [
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(CONFIG)
    }),
    new webpack.BannerPlugin(
      pkg.name + ' ' + pkg.version + "\n"+
      pkg.description + "\n" +
      'Author: ' + pkg.author + "\n" +
      'Homepage: ' + pkg.homepage + "\n" +
      'CONFIG: {' + "\n"+
      '\tTHEME_COLOR: ' + CONFIG.THEME_COLOR + "\n"+
      '\tDIRECTION: ' + CONFIG.DIRECTION + "\n"+
      '\tLOCALE: ' + CONFIG.LOCALE + "\n"+
      '}' + "\n"
    )
];
if( CONFIG.NODE_ENV !== 'development' ){
  plugins.push( new webpack.optimize.UglifyJsPlugin({
      minimize: true
  }));
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: pkg.name+'.js',
    library: pkg.name,
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      locale: path.resolve(__dirname, `../src/locale/${CONFIG.LOCALE}.js`),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          loaders: {
            scss: scssLoader
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
          test: /\.scss$/,
          use: scssLoader
      }
    ]
  },
  plugins: plugins
}