/**
* @Author: songqi
* @Date:   2016-07-07
* @Email:  songqi@benmu-health.com
* @Last modified by:   songqi
* @Last modified time: 2017-03-30
*/

module.exports = {
    'server': {
        'path': '../',
        'port': 80
    },
    'proxy': [{
        'route': '/test',
        'target': '127.0.0.1:52077/test'
    },{
        'route': '/cardIssuers',
        'target': '127.0.0.1:52077/cardIssuers'
    }],
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    },
    'openPath': 'http://fe.benmu-health.com/createjsDemo/dist/html/index.html',
    'exports': [
        'css/index.scss',
        'js/index.js',
        'js/one.js',
        'js/tweenMax.js',
        'js/aframe.js',
        'js/flappy.js',
        'js/pixi.js'
    ],
    'alias': {
        'Config': 'js/config',
        'Components': 'js/components',
        'Views': 'js/views',
        'Common': 'js/common',
        'Widget': 'js/widget',
        'Utils': 'js/utils',
        'BaseLibs': 'js/baseLibs'
    }
};
