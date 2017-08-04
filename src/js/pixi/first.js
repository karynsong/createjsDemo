import { getProcess } from './utils';

const textInfo = [{
    name: 'first0'
}, {
    name: 'first1',
    speed: .5,
    repeat: true
}, {
    name: 'first2',
    move: true
}, {
    name: 'first3',
    move: true
}, {
    name: 'first4',
    move: true
}, {
    name: 'first5',
    speed: 4,
    repeat: true
}, {
    name: 'first6',
    move: true
}, {
    name: 'first7',
    move: true
}, {
    name: 'first8',
    speed: .5,
    repeat: true
}, {
    name: 'first9',
    move: true
}, {
    name: 'first10',
    move: true
}, {
    name: 'first11',
    move: true
}, {
    name: 'first12',
    speed: .9,
    repeat: true
}, {
    name: 'first13',
    move: true
}, {
    name: 'first14',
    move: true
}, {
    name: 'first15',
    move: true
}, {
    name: 'first16',
    speed: .6,
    repeat: true
}, {
    name: 'first17'
}, {
    name: 'first18',
    move: true
}, {
    name: 'first20',
    move: true
}];

export default class First {
    constructor(container, loader) {
        this.container = new PIXI.Graphics();
        this.container.beginFill(0xfffbee);
        this.container.drawRect(0, 0, window.innerWidth, 4003);
        container.addChild(this.container);
        this.loader = loader;
    }

    draw() {
        this.Abg = new PIXI.Sprite(this.loader.get('Abg').texture);
        this.Abg.position.set(87, 0);
        this.Ainner = new PIXI.Sprite(this.loader.get('Ainner').texture);
        this.Ainner.position.set(136.5, 0);
        this.textContainer = new PIXI.Graphics();
        this.textContainer.beginFill(0xfffbee)
        this.textContainer.drawRect(0, 0, window.innerWidth, 3203);
        this.textContainer.position.set(0, 800);
        this.container.addChild(this.Ainner, this.Abg, this.textContainer);
        this.addText();
        this.addRedRect();
        this.initAnimate();
    }

    addRedRect() {
        for (var i = 0; i < 120; i++) {
            var rt = new PIXI.Sprite(this.loader.get('firstTextRect').texture);
            rt.position.set(7 * (i - 5), 2720);
            rt.alpha = 0;
            this.textAnimteArr.push({
                min: 2240 + i * 5,
                max: 2245 + i * 5,
                data: TweenMax.to(rt, 1, {
                    alpha: 1,
                    ease: Power0.easeNone
                }).pause()
            })
            this.textContainer.addChild(rt);
        }
    }

    addText() {
        this.textAnimteArr = [];
        this.textScaleArr = [];
        textInfo.map((item, index) => {
            var _texture = new PIXI.Sprite(this.loader.get(item.name).texture),
                _textBgture = new PIXI.Sprite(this.loader.get('firstTextBg').texture),
                y = (160 - _texture.height) / 2,
                offsetY = 160 * index;
            if (item.repeat) {
                var _repeatContainer = new PIXI.Container(),
                    _textureCopy = new PIXI.Sprite(this.loader.get(item.name).texture);
                _repeatContainer.position.set(0, y + offsetY);
                _textureCopy.position.x = _texture.width;
                _repeatContainer.addChild(_texture, _textureCopy);
                _textBgture.position.set(0, 160 + offsetY);
                this.textContainer.addChild(_repeatContainer, _textBgture);
                TweenMax.to(_repeatContainer.position, 80 * item.speed * _texture.width / 5000, {
                    x: -_texture.width,
                    ease: Power0.easeNone,
                    repeat: -1
                });
            } else {
                _texture.position.set(index % 2 === 0 ? 0 : 50, y + offsetY);
                _textBgture.position.set(0, 160 + offsetY);
                this.textContainer.addChild(_texture, _textBgture);
                if (item.move) {
                    this.textAnimteArr.push({
                        min: -270 + offsetY,
                        max: 640 + offsetY,
                        data: TweenMax.to(_texture.position, 1, {
                            x: -_texture.width + window.innerWidth,
                            ease: Power0.easeNone
                        }).pause()
                    })
                }
                if (index !== 0) {
                    this.textScaleArr.push(_texture)
                }
            }
        });
    }

    initAnimate() {
        this.picAnimate = TweenMax.to(this.Ainner.position, 1, {
            y: 360,
            ease: Power0.easeNone
        }).pause();
        this.textScaleAnimate = [];
    }

    updateProcess(x, y, speed) {
        var self = this,
            scale = Math.abs(speed) + 1;

        this.picAnimate.progress(getProcess(0, y, 530, 0));
        this.textAnimteArr.map(item => {
            item.data.progress(getProcess(0, y, item.max, item.min));
        });
        if (y > -1 || y < -4010) {
            speed = 0;
        }
        if (this.textSkew) {
            this.textSkew.kill();
        }
        var textSkew = speed / 10;
        textSkew = textSkew > 0.05 ? 0.05 : textSkew;
        textSkew = textSkew < -0.05 ? -0.05 : textSkew;
        this.textSkew = TweenMax.to(this.textContainer.skew, .2, {
            y: textSkew,
            x: textSkew,
            ease: Power0.easeNone,
        })
        this.textScaleAnimate.map(item => {
            item && item.kill && item.kill();
        })
        var textScale = Math.abs(speed) > 1.5 ? 1.5 : Math.abs(speed);
        textScale = textScale < 1 ? 1 : textScale;

        this.textScaleAnimate = this.textScaleArr.map(item => {
            return TweenMax.to(item.scale, .2, {
                x: textScale,
                y: textScale,
                ease: Power0.easeNone,
            })
        })
    }
}