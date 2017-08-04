var THREE = require('three');
var Stats = require('stats-js');

import Base from './one/base';
import Loader from './one/loader';

var base = new Base();
var loader;

base.on('baseInfoReady', () => {
    loader = new Loader();
    loader.on('imgReady', (imgInfo) => {
        base.setImgInfo(imgInfo);
    });
});

document.querySelector('#canvas-frame').addEventListener('click', () => {
    base.startAnimate();
});