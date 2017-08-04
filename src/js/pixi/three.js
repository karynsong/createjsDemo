import { getProcess } from './utils';

export default class Three {
    constructor(container, loader){
        this.container = new PIXI.Graphics();
        this.container.beginFill(0xfffbee);
        this.container.drawRect(0, 0, window.innerWidth + 534, window.innerHeight);
        this.container.position.set(0, 5002);
        this.container.alpha = 0;
        container.addChild(this.container);
        this.loader = loader;
    }

    draw(){
        var text = new PIXI.Sprite(this.loader.get('threeText').texture),
            secondSchool49 = new PIXI.Sprite(this.loader.get('secondSchool49').texture),
            firstText = new PIXI.Sprite(this.loader.get('threeFirstText').texture),
            slideRight = new PIXI.Sprite(this.loader.get('threeSlideRight').texture);
        this.Hand = new PIXI.Sprite(this.loader.get('threeHand').texture),
        this.Line = new PIXI.Sprite(this.loader.get('threeLine').texture),
        this.TextCover = new PIXI.Sprite(this.loader.get('threeTextCover').texture);
        text.position.set(48, 120);
        this.Line.position.set(204, 620);
        this.Hand.position.set(604, 628);
        this.TextCover.height = window.innerHeight;
        this.TextCover.position.set(-163, 0);
        firstText.position.set(window.innerWidth, 154)
        slideRight.position.set(354, 700)
        this.container.addChild(secondSchool49, this.Hand, this.Line, this.TextCover, text, firstText, slideRight);
        TweenMax.to(this.Hand, 1.5, {
            x: 206,
            ease: Power0.easeNone,
            repeat: -1
        });
        
        // this.textCoverAnimate = TweenMax.to(this.TextCover, 1, {
        //     x: 508,
        //     ease: Power0.easeNone,
        // }).pause();
    }

    updateProcess(x, y){
        if(y === -5002){
            this.container.alpha = 1;
        }else{
            this.container.alpha = 0;
        }
        if(x > -640){
            this.container.position.set(-x, 5002);
        }
        if(x > -1281){
            this.TextCover.position.set(-163 - x, 0);
        }
    
        if(x < -245){
            this.Hand.alpha = 0;
            this.Line.alpha = 0;
        }else{
            this.Hand.alpha = 1;
            this.Line.alpha = 1;
        }
        // this.textCoverAnimate.progress(getProcess(x, 0, 330, 0));
    }
}