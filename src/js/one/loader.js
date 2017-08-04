import * as THREE from 'three';
import { TweenMax } from "gsap";
import { imgPositon } from './imgPositionConfig';
import EventEmitter from 'smelly-event-emitter';

const imgs = {
    2: '//fe.benmu-health.com/createjsDemo/images/2.jpg',
    3: '//fe.benmu-health.com/createjsDemo/images/3.jpg',
    4: '//fe.benmu-health.com/createjsDemo/images/4.jpg',
    5: '//fe.benmu-health.com/createjsDemo/images/5.jpg',
    6: '//fe.benmu-health.com/createjsDemo/images/6.jpg',
    7: '//fe.benmu-health.com/createjsDemo/images/6_5.jpg',
    8: '//fe.benmu-health.com/createjsDemo/images/7.jpg',
    9: '//fe.benmu-health.com/createjsDemo/images/7_5.jpg',
    10: '//fe.benmu-health.com/createjsDemo/images/8.jpg',
    11: '//fe.benmu-health.com/createjsDemo/images/8_5.jpg',
    12: '//fe.benmu-health.com/createjsDemo/images/9.jpg',
    13: '//fe.benmu-health.com/createjsDemo/images/9_5.jpg',
    14: '//fe.benmu-health.com/createjsDemo/images/10.jpg',
    15: '//fe.benmu-health.com/createjsDemo/images/10_5.jpg',
    16: '//fe.benmu-health.com/createjsDemo/images/11.jpg',
    17: '//fe.benmu-health.com/createjsDemo/images/11_5.jpg',
    18: '//fe.benmu-health.com/createjsDemo/images/12.jpg',
    19: '//fe.benmu-health.com/createjsDemo/images/12_5.jpg',
    20: '//fe.benmu-health.com/createjsDemo/images/13.jpg',
    21: '//fe.benmu-health.com/createjsDemo/images/13_5.jpg',
    22: '//fe.benmu-health.com/createjsDemo/images/14.jpg',
    23: '//fe.benmu-health.com/createjsDemo/images/15.jpg'
}

export default class Loader extends EventEmitter {
    constructor() {
        super();
        this.precent = {
            value: 0
        };
        this.loaded = 0;
        this.total = 22;
        this.textureLoader = new THREE.TextureLoader();
        this.textureMap = {};
        this.setPrecentAnimate();
        this.loadImg();
    }

    getTexture(key){
        return this.textureMap[key];
    }

    setPrecentAnimate() {
        var self = this;
        this.tl = new TweenMax.TimelineLite({
            onUpdate(){
                // console.log((self.precent.value * 100 ).toFixed(2))
            },
            onComplete(){
                self.getImgPositon();
            }
        });
    }

    getPrecent(){
        this.tl.add(TweenMax.to(this.precent, 0.1, {
            value: this.loaded / this.total
        }, '+=0.01'));
    }

    getImgPositon(){
        var imgInfo = Object.keys(imgPositon).map(item => {
            return Object.assign({
                texture: this.textureMap[item]
            }, imgPositon[item]);
        });
        this.emit('imgReady', imgInfo);
    }

    async loadImg(){
        await this.loadAll();
    }

    loadAll(){
        var _promiseAll = [];
        Object.keys(imgs).map(key => {
            _promiseAll.push(new Promise((resolve, reject) => {
                this.textureMap[key] = this.textureLoader.load(imgs[key], () => {
                    ++this.loaded;
                    this.getPrecent();
                    resolve();
                });
            }));
        })
        return Promise.all(_promiseAll)
    }
}