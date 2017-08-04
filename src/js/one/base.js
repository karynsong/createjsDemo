import * as THREE from 'three';
import EventEmitter from 'smelly-event-emitter';
import { TweenMax } from "gsap";

export default class Base extends EventEmitter {
    constructor() {
        super();
        this.initBaseInfo();
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initLight();
        this.initBg();
    }

    initBaseInfo(){
        this.baseInfo = {};
        this.baseInfo['firstAnimate'] = false;
        this.baseInfo['animateStatus'] = 'waiting';
        this.baseInfo['tl'] = new TweenMax.TimelineLite();        
        this.baseInfo['container'] = document.querySelector('#canvas-frame');
        this.baseInfo['width'] = this.baseInfo['container'].clientWidth;
        this.baseInfo['height'] = this.baseInfo['container'].clientHeight;
        this.baseInfo['fov'] = 75;
        this.baseInfo['near'] = 1;
        this.baseInfo['far'] = 10000;
        this.baseInfo['aspect'] = this.baseInfo.width / this.baseInfo.height;
    }

    initThree(){
        var renderer;
        this.baseInfo['renderer'] = renderer = new THREE.WebGLRenderer({
            antialias : true
        });

        renderer.setSize(this.baseInfo.width, this.baseInfo.height);
        this.baseInfo['container'].appendChild(renderer.domElement);
        renderer.setClearColor(0xFFFFFF, 1.0);
    }

    initCamera(){
        var camera;
        this.baseInfo['camera'] = camera = new THREE.PerspectiveCamera(this.baseInfo.fov, this.baseInfo.aspect, this.baseInfo.near, this.baseInfo.far);
    }

    initScene(){
        this.baseInfo['scene'] = new THREE.Scene();
    }

    initLight(){
        this.baseInfo['light'] = new THREE.AmbientLight(0xFF0000);
        this.baseInfo.light.position.set(100, 100, 200);
        this.baseInfo.scene.add(this.baseInfo.light);
    }

    initBg(){
        new THREE.TextureLoader().load('//fe.benmu-health.com/createjsDemo/images/1.jpg', (texture) => {
            var geometry = new THREE.PlaneGeometry( this.baseInfo.width, this.baseInfo.height);
            var material = new THREE.MeshBasicMaterial({
                map: texture
            });
            this.baseInfo.camera.position.z = this.baseInfo.height / 2 / Math.tan(Math.PI * this.baseInfo.fov / 360);
            this.baseInfo.mesh = new THREE.Mesh( geometry, material );
            this.baseInfo.scene.add( this.baseInfo.mesh );
            this.baseInfo.renderer.render(this.baseInfo.scene, this.baseInfo.camera);
            this.emit('baseInfoReady');
        });
    }

    setImgInfo(imgInfo){
        var screenCenterX = this.baseInfo.width / 2;
        var screenCenterY = this.baseInfo.height / 2;
        var startCameraZ = this.baseInfo.height / 2 / Math.tan(Math.PI * this.baseInfo.fov / 360);
        var endPositon = {
            x: 0,
            y: 0,
            z: startCameraZ
        }
        this.animateInfo = imgInfo.map(item => {
            var startPositon = {};
            startPositon['x'] = screenCenterX - (item.center.width / 2 + item.center.x) / item.width * this.baseInfo.width;
            startPositon['y'] = (item.center.height / 2 + item.center.y) / item.height * this.baseInfo.height - screenCenterY;
            startPositon['z'] = Math.abs(item.center.height / item.height * this.baseInfo.height / 2 / Math.tan(Math.PI * this.baseInfo.fov / 360));
            return {
                startPositon,
                endPositon,
                texture: item.texture
            }
        });
    }

    setNextImg(nextImg, index){
        this.baseInfo.mesh.material.map = nextImg['texture'];
        this.baseInfo.mesh.material.needsUpdate = true;
        this.baseInfo.mesh.position.x = nextImg.startPositon.x;
        this.baseInfo.mesh.position.y = nextImg.startPositon.y;
        this.baseInfo.camera.position.z = nextImg.startPositon.z;
        this.baseInfo.animatePosition = {
            x: nextImg.startPositon.x,
            y: nextImg.startPositon.y,
            z: nextImg.startPositon.z
        }
        var self = this;
        this.baseInfo.tl.to(this.baseInfo.animatePosition, 10, {
            x: nextImg.endPositon.x,
            y: nextImg.endPositon.y,
            z: nextImg.endPositon.z,
            ease: Power0.easeNone,
            onUpdate(){
                if(!self.baseInfo.animatePosition){
                    return;
                }
                self.baseInfo.mesh.position.x = self.baseInfo.animatePosition.x;
                self.baseInfo.mesh.position.y = self.baseInfo.animatePosition.y;
                self.baseInfo.camera.position.z = self.baseInfo.animatePosition.z;
            },
            onComplete(){
                var nextImg = self.animateInfo[index + 1]
                if(nextImg){
                    self.setNextImg(nextImg, index + 1);
                }else{
                    self.stopAnimate();
                    self.baseInfo['animateStatus'] = 'ending';
                }
            }
        });
    }

    startAnimate(){
        if(this.baseInfo.animateStatus === 'working' || this.baseInfo.animateStatus === 'ending'){
            return;
        }
        if(!this.baseInfo.firstAnimate){
            this.baseInfo.firstAnimate = true;
            this.setNextImg(this.animateInfo[0], 0);
            this.baseInfo.tl.pause();
        }
        this.baseInfo['animateStatus'] = 'working';
        this.baseInfo.tl.play();
        this.animate();
    }

    stopAnimate(){
        if(this.baseInfo.animateStatus === 'pauseing' || this.baseInfo.animateStatus === 'ending'){
            return;
        }
        this.baseInfo['animateStatus'] = 'pauseing';
        this.baseInfo.tl.pause();
    }

    animate(){
        if(this.baseInfo.animateStatus === 'working'){
            this.baseInfo.renderer.render(this.baseInfo.scene, this.baseInfo.camera);
            requestAnimationFrame(this.animate.bind(this));
        }
    }
}