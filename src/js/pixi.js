import 'pixi.js';
import 'gsap';
import ScrollMagic from 'scrollmagic';

import IScroll from 'iscroll/build/iscroll-probe'
import Loader from './pixi/loader';

import First from './pixi/first';
import Second from './pixi/second';
import Three from './pixi/three';

var app = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight);
app.rootContext.lineJoin = "round";
app.rootContext.lineCap = "round";

document.querySelector('.canvas-container').appendChild(app.view);

class Pixi {
    constructor() {
        this.container = new PIXI.Container();
        this.loaderFirst();
        this.initScroll();
    }

    loaderFirst() {
        this.loader = new Loader();
        this.loader.load(() => {
            this.initContainer();
            this.draw();
        })
    }

    initContainer() {
        this.first = new First(this.container, this.loader);
        this.second = new Second(this.container, this.loader);
        this.three = new Three(this.container, this.loader);
        this.updateStage();
    }

    changeScroll(isDirY, offsetX, offsetY) {
        if (isDirY) {
            this.scrollInfo.scroll.options.scrollX = false;
            this.scrollInfo.scroll.options.scrollY = true;
            this.scrollInfo.rangeY.map(item => {
                if (item.x === offsetX) {
                    this.scrollInfo.range = item.y;
                }
            });
        } else {
            this.scrollInfo.scroll.options.scrollX = true;
            this.scrollInfo.scroll.options.scrollY = false;
            this.scrollInfo.rangeX.map(item => {
                if (item.y === offsetY) {
                    this.scrollInfo.range = item.x;
                }
            });
        }
        this.scrollInfo.y = offsetY;
        this.scrollInfo.x = offsetX;
        this.scrollInfo.scroll.refresh();
        // 下面这种方式是因为 scrollStart 触发时滚动信息已经计算完毕了 
        this.scrollInfo.scroll.scrollTo(offsetX, offsetY);
        setTimeout(() => {
            this.scrollInfo.scroll.scrollTo(offsetX, offsetY);
        })
    }

    testScroll(scrollX, scrollY, timeDiff) {
        var distance,
            speed = 0;
        if (this.scrollInfo.directionY) {
            scrollX = this.scrollInfo.x;
            if (scrollY > this.scrollInfo.range[0]) {
                this.scrollInfo.scroll.scrollTo(0, this.scrollInfo.range[0]);
                scrollY = this.scrollInfo.range[0];
            } else if (scrollY < this.scrollInfo.range[1]) {
                this.scrollInfo.scroll.scrollTo(0, this.scrollInfo.range[1]);
                scrollY = this.scrollInfo.range[1];
            }
            distance = this.scrollInfo.scroll.distY
        } else {
            scrollY = this.scrollInfo.y;
            if (scrollX > this.scrollInfo.range[0]) {
                this.scrollInfo.scroll.scrollTo(this.scrollInfo.range[0], 0);
                scrollX = this.scrollInfo.range[0];
            } else if (scrollX < this.scrollInfo.range[1]) {
                this.scrollInfo.scroll.scrollTo(this.scrollInfo.range[1], 0);
                scrollX = this.scrollInfo.range[1];
            }
            distance = this.scrollInfo.scroll.distX
        }
        if (timeDiff) {
            speed = distance / timeDiff;
        }
        this.updateProcess(scrollX, scrollY, speed);
    }

    initScroll() {
        var changeScroll = false,
            scroll = new IScroll(document.querySelector('.scroll-container'), {
                probeType: 3,
                deceleration: 0.0035,
                bounce: false
            })
        this.scrollInfo = {
            scroll,
            directionY: true,
            x: 0,
            y: 0,
            range: [0, -5002],
            rangeY: [{
                x: 0,
                y: [0, -5002]
            }],
            rangeX: [{
                x: [0, -1500],
                y: -5002
            }],
            turnPoint: [{
                x: 0,
                y: -5002
            }]
        }
        scroll.on('scrollStart', () => {
            var directionY = this.scrollInfo.directionY,
                scrollX = scroll.x,
                scrollY = scroll.y;
            if (directionY) {
                scrollX += this.scrollInfo.x;
            } else {
                scrollY += this.scrollInfo.y;
            }
            this.scrollInfo.turnPoint.map(item => {
                if (item.x === scrollX && item.y === scrollY) {
                    this.scrollInfo.directionY = Math.abs(scroll.distX) > Math.abs(scroll.distY) ? false : true;
                }
            });
            if (directionY !== this.scrollInfo.directionY) {
                changeScroll = true;
                this.changeScroll(this.scrollInfo.directionY, scrollX, scrollY)
            }
        });

        scroll.on('scrollEnd', () => {
            this.testScroll(scroll.x, scroll.y, 0);
        });

        scroll.on('scroll', () => {
            var scrollX = scroll.x,
                scrollY = scroll.y,
                timeDiff = +new Date() - scroll.startTime,
                distance = '',
                speed = 0;
            if (changeScroll) {
                scrollX = this.scrollInfo.x;
                scrollY = this.scrollInfo.y;
                changeScroll = false;
            }
            this.testScroll(scrollX, scrollY, timeDiff);
        });
    }

    updateProcess(x, y, speed) {
        this.container.position.set(x, y);
        this.first.updateProcess(x, y, speed);
        this.second.updateProcess(x, y, speed);
        this.three.updateProcess(x, y, speed);
    }

    draw() {
        this.first.draw();
        this.second.draw();
        this.three.draw();
    }

    updateStage() {
        app.render(this.container);
        requestAnimationFrame(this.updateStage.bind(this));
    }
}
new Pixi();