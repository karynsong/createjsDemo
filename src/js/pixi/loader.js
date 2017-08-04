const LoaderBox = PIXI.loaders.Loader;
var source = {
    Abg: '//fe.benmu-health.com/createjsDemo/images/pixi/bg.png',
    Ainner: '//fe.benmu-health.com/createjsDemo/images/pixi/inner.jpg',
    firstTextBg: '//fe.benmu-health.com/createjsDemo/images/pixi/textbg.png',
    first0: '//fe.benmu-health.com/createjsDemo/images/pixi/0.png',
    first1: '//fe.benmu-health.com/createjsDemo/images/pixi/1.png',
    first2: '//fe.benmu-health.com/createjsDemo/images/pixi/2.png',
    first3: '//fe.benmu-health.com/createjsDemo/images/pixi/3.png',
    first4: '//fe.benmu-health.com/createjsDemo/images/pixi/4.png',
    first5: '//fe.benmu-health.com/createjsDemo/images/pixi/5.png',
    first6: '//fe.benmu-health.com/createjsDemo/images/pixi/6.png',
    first7: '//fe.benmu-health.com/createjsDemo/images/pixi/7.png',
    first8: '//fe.benmu-health.com/createjsDemo/images/pixi/8.png',
    first9: '//fe.benmu-health.com/createjsDemo/images/pixi/9.png',
    first10: '//fe.benmu-health.com/createjsDemo/images/pixi/10.png',
    first11: '//fe.benmu-health.com/createjsDemo/images/pixi/11.png',
    first12: '//fe.benmu-health.com/createjsDemo/images/pixi/12.png',
    first13: '//fe.benmu-health.com/createjsDemo/images/pixi/13.png',
    first14: '//fe.benmu-health.com/createjsDemo/images/pixi/14.png',
    first15: '//fe.benmu-health.com/createjsDemo/images/pixi/15.png',
    first16: '//fe.benmu-health.com/createjsDemo/images/pixi/16.png',
    first17: '//fe.benmu-health.com/createjsDemo/images/pixi/17.png',
    first18: '//fe.benmu-health.com/createjsDemo/images/pixi/18.png',
    first19: '//fe.benmu-health.com/createjsDemo/images/pixi/19.png',
    first20: '//fe.benmu-health.com/createjsDemo/images/pixi/20.png',
    firstTextRect: '//fe.benmu-health.com/createjsDemo/images/pixi/rect.png',
    secondSky: '//fe.benmu-health.com/createjsDemo/images/pixi/sky.jpg',
    secondSchool: '//fe.benmu-health.com/createjsDemo/images/pixi/school.png',
    secondCover: '//fe.benmu-health.com/createjsDemo/images/pixi/cover.png',
    secondCloud: '//fe.benmu-health.com/createjsDemo/images/pixi/cloud.png',
    threeHand: '//fe.benmu-health.com/createjsDemo/images/pixi/second/hand.png',
    threeLine: '//fe.benmu-health.com/createjsDemo/images/pixi/second/line.png',
    threeTextCover: '//fe.benmu-health.com/createjsDemo/images/pixi/second/text_cover.png',
    threeText: '//fe.benmu-health.com/createjsDemo/images/pixi/second/text.png',
    threeFirstText: '//fe.benmu-health.com/createjsDemo/images/pixi/second/first_text.png',
    threeSlideRight: '//fe.benmu-health.com/createjsDemo/images/pixi/second/slide_right.png',
}

var firstText = {};
for(var i=0; i<21; i++){
    firstText[`first${i}`] = `//fe.benmu-health.com/createjsDemo/images/pixi/${i}.png`;
}
Object.assign(source, firstText);

var secondSchools = {};
for(var i=0; i<50; i++){
    secondSchools[`secondSchool${i}`] = `//fe.benmu-health.com/createjsDemo/images/pixi/school/${i}.jpg`;
}
Object.assign(source, secondSchools);

export default class Loader extends LoaderBox{
    constructor(){
        super();
        this.sourceLen = 0;
        this.loadedImg = 0;

        this.load1();
    }

    load1(){
        for(var i in source){
            ++this.sourceLen;
            this.add(i, source[i]);
        }
        this.on('progress', () => {
            ++this.loadedImg;
            console.log(this.loadedImg / this.sourceLen * 100 + '%');
        })
        // .load((loader, resources) => {
        //     this.resources = resources;
        // });
    }

    get(key){
        return this.resources[key]
    }
}