import { getProcess } from './utils';

export default class Second {
    constructor(container, loader) {
        this.container = new PIXI.Graphics();
        this.container.beginFill(0xffffff);
        this.container.drawRect(0, 0, window.innerWidth, window.innerHeight + 1000);
        this.container.position.set(0, 4003);
        container.addChild(this.container);
        this.loader = loader;
    }

    draw() {
        var sky = new PIXI.Sprite(this.loader.get('secondSky').texture),
            school = new PIXI.Sprite(this.loader.get('secondSchool').texture),
            cover = new PIXI.Sprite(this.loader.get('secondCover').texture),
            cloud = new PIXI.Sprite(this.loader.get('secondCloud').texture);
        this.picContainer = new PIXI.Graphics();
        this.picContainer.drawRect(0, 0, 588, 406);
        this.picContainer.addChild(sky, school, cloud, cover);
        cover.position.set(-41, 0);
        cloud.position.set(-41, 100);
        this.picContainer.position.set(87, 196);
        this.container.addChild(this.picContainer);
        this.drawSchoolMask();
        this.hasChildren = true;
    }

    drawSchoolMask() {
        var imgAddress = [];
        for (var i = 0; i < 50; i++) {
            imgAddress.push(`secondSchool${i}`);
        }
        this.schoolMask = new PIXI.extras.AnimatedSprite.fromImages(imgAddress);
        this.schoolMask.position.set(0, 0);
        this.container.addChild(this.schoolMask);
    }

    updateProcess(x, y) {
        if (y < -4002 && y > -5002) {
            this.container.alpha = 1;
            this.picContainer.position.set(87, 196 - 4002 - y);
            this.schoolMask.position.set(0, -4002 - y);
        } else if (y === -5002) {
            this.container.alpha = 0;
        }
        this.schoolMask.gotoAndStop(parseInt(getProcess(0, y, 5002, 4003) * 49, 10));
    }
}