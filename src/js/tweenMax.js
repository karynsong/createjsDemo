import { TweenMax, TimelineLite } from "gsap";

var $box = document.querySelector('#box');
var $boxSmall = document.querySelector('.boxSmall');
var tl = new TweenMax.TimelineLite();
var aaa = { x: 100 }
tl.to(aaa, 1, {
    x: 300,
    // autoAlpha: 0
})
.to($box, 1, {
    x: '+=200px',
    // autoAlpha: 1
});
tl.pause();

var xxx = 0;
$box.addEventListener('click', () => {
    xxx += 0.01;
    console.log(xxx, aaa)
    tl.progress(xxx);
})