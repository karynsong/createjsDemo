var THREE = require('three');
var Stats = require('stats-js');
var OrbitControls = require('three-orbitcontrols')
require('three-fly-controls')(THREE);
var PointerLockControls = require('three-pointerlock');
var TrackballControls = require('three-trackballcontrols');
var TransformControls = require('three-transformcontrols');

var renderer;
var stats;
var width;
var height;

function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias : true
    });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('canvas-frame').appendChild(stats.domElement);
}

var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 100;
    camera.position.y = 200;
    camera.position.z = 800;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt({
        x : 0,
        y : 0,
        z : 0
    });
    // camera = new THREE.OrthographicCamera(-300, 300, 300, -300, 1, 1000);
    // camera.position.set(0, 200, 800);
    // camera.lookAt({
    //     x : 0,
    //     y : 0,
    //     z : 0
    // });
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

var light;
function initLight() {
    light = new THREE.AmbientLight(0xFF0000);
    light.position.set(100, 100, 200);
    
    scene.add(light);
}

var cube;
var mesh;
function initObject() {
    
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {

        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );

    }
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors} );
    mesh = new THREE.Mesh( geometry,material);


    // mesh.position = new THREE.Vector3(0,0,0);
    scene.add(mesh);

    // 天空
    var skyGeometry = new THREE.CubeGeometry( 9000, 9000, 9000 );	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('http://fe.benmu-health.com/createjsDemo/images/15.jpg'),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );
    
    
}

function initGrid(){
    var helper = new THREE.GridHelper( 1000, 50, 0x0000ff, 0x808080 );
    scene.add( helper );
}

function initActor(){
    var aaa = new THREE.CubeGeometry(100, 100, 100);
    var bbb = new THREE.MeshBasicMaterial({
        map: texture
    }); 
    var cube = new THREE.Mesh( aaa, bbb );
    
    cube.position.x = -200
    scene.add( cube );
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();


    initObject();
    initGrid();
    initActor();
    renderer.render(scene, camera);

    // 旋转控制器 类似按照某一个舞台进行旋转
    // controls = new OrbitControls(camera, renderer.domElement)
    // controls.enableDamping = true
    // controls.dampingFactor = 1
    // 飞行控制器 飞行游戏
    // controls = new THREE.FlyControls(camera, renderer.domElement);
    // 指针控制器 https://threejs.org/examples/misc_controls_pointerlock.html
    controls = new PointerLockControls(camera)
    scene.add( controls.getObject() );
    move();
    // 轨迹球控制器
    // controls = new TrackballControls( camera, renderer.domElement );
    // 变换物体控制器
    // controls = new TransformControls( camera, renderer.domElement );
    // controls.attach( mesh );
    // scene.add( controls );
    // window.addEventListener( 'keydown', function ( event ) {
    //     switch ( event.keyCode ) {
    //         case 81: // Q
    //             controls.setSpace( controls.space === "local" ? "world" : "local" );
    //             break;
    //         case 17: // Ctrl
    //             controls.setTranslationSnap( 100 );
    //             controls.setRotationSnap( THREE.Math.degToRad( 15 ) );
    //             break;
    //         case 87: // W
    //             controls.setMode( "translate" );
    //             break;
    //         case 69: // E
    //             controls.setMode( "rotate" );
    //             break;
    //         case 82: // R
    //             controls.setMode( "scale" );
    //             break;
    //         case 187:
    //         case 107: // +, =, num+
    //             controls.setSize( controls.size + 0.1 );
    //             break;
    //         case 189:
    //         case 109: // -, _, num-
    //             controls.setSize( Math.max( controls.size - 0.1, 0.1 ) );
    //             break;
    //     }
    // });
    animation();

}
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var raycaster;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
function move(){
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);

    function changeCallback(){
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controls.enabled = true;
        } else {
            controls.enabled = false;
        }
    }
    var element = document.body;
    element.addEventListener('click', () => {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
    })
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
}

var controls;
var xxx = 1
// 帧循环、游戏循环
function animation()
{
    // mesh.rotation.x +=0.01;
    // scene.rotation.x += 0.01;
    // scene.rotation.y += 0.01;
    // scene.rotation.z += 0.01;
    // mesh.rotation.y +=0.01;
    // mesh.rotation.z +=0.01;
    // if(mesh.position.x > 100){
    //     xxx = -1;
    // }
    // if(mesh.position.x < 0){
    //     xxx = 1;
    // }
    // mesh.position.x += xxx;
    // camera.position.y += xxx;
    // camera.position.x += xxx;
    // camera.position.z += xxx;

    // 指针控制器
    // raycaster.ray.origin.copy( controls.getObject().position );
	// raycaster.ray.origin.y -= 10;

    // var time = performance.now();
    // var delta = ( time - prevTime ) / 1000;

    // velocity.x -= velocity.x * 10.0 * delta;
    // velocity.z -= velocity.z * 10.0 * delta;

    // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    // if ( moveForward ) velocity.z -= 400.0 * delta;
    // if ( moveBackward ) velocity.z += 400.0 * delta;

    // if ( moveLeft ) velocity.x -= 400.0 * delta;
    // if ( moveRight ) velocity.x += 400.0 * delta;

    // controls.getObject().translateX( velocity.x * delta );
    // controls.getObject().translateY( velocity.y * delta );
    // controls.getObject().translateZ( velocity.z * delta );

    // if ( controls.getObject().position.y < 10 ) {
    //     velocity.y = 0;
    //     controls.getObject().position.y = 10;
    //     canJump = true;
    // }

    // prevTime = time;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);

}
var texture;
// var loader = new THREE.gITFLoader();
// loader.load('http://fe.benmu-health.com/benmu-health-img/app-benmu-health/apploading.gif', (obj) => {
//     texture = obj;
//     debugger
//     threeStart()
// })

var texture = THREE.ImageUtils.loadTexture('http://fe.benmu-health.com/benmu-health-img/app-benmu-health/apploading.gif', {}, function() {
    threeStart()
});

