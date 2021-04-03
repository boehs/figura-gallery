import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// add ambient light
// subtle blue
var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

var renderer = new THREE.WebGLRenderer();

const loader = new GLTFLoader();

var texture = new THREE.TextureLoader().load('/texture.png');
texture.encoding = THREE.sRGBEncoding;
texture.flipY = false;

var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    // flatShading: true
});

var Player;

// Load a glTF resource
loader.load(
    // resource URL
    '/models/steve.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        Player = gltf.scene

        scene.add( gltf.scene );

        Player.traverse((o) => {
            if (o.isMesh) {
                //o.material.map = texture;
                // console.log(o.material.map);
            }
        });

        gltf.scene.children.material = material

        gltf.scene.rotation.y = 3.14

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

const G_head = new THREE.BoxGeometry( 8, 8, 8 );
const G_torso = new THREE.BoxGeometry( 8, 12, 4 );
const G_limbs = new THREE.BoxGeometry( 4, 12, 4 );
// const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

/* const body = new THREE.Group();

const head = new THREE.Mesh( G_head, material );
head.position.set( 0, 10, 0 );

const torso = new THREE.Mesh( G_torso, material );
torso.position.set( 0, 0, 0 );

const L_hand = new THREE.Mesh( G_limbs, material );
const R_hand = new THREE.Mesh( G_limbs, material );
const L_foot = new THREE.Mesh( G_limbs, material );
const R_foot = new THREE.Mesh( G_limbs, material );

L_hand.position.set( 6, 0, 0 );
R_hand.position.set( -6, 0, 0 );
L_foot.position.set( 2, -12, 0 );
R_foot.position.set( -2, -12, 0 );

body.add( head );
body.add( torso );

body.add( L_hand );
body.add( R_hand );
body.add( L_foot );
body.add( R_foot );

scene.add( body ); */

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// camera.position.z = 30;
camera.position.y = 1;
camera.position.z = 2;

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
}

var mouseDown = false,
mouseX = 0,
mouseY = 0;

function onMouseMove(evt) {
    if (!mouseDown) {
        return;
    }

    evt.preventDefault();

    var deltaX = evt.clientX - mouseX,
        deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

function onMouseUp(evt) {
    evt.preventDefault();

    mouseDown = false;
}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
}

function rotateScene(deltaX, deltaY) {
    //body.rotation.y += deltaX / 200;
    Player.rotation.y += deltaX / 200;
    // body.rotation.x += deltaY / 100;
}

addMouseHandler(document)

animate();

console.log(scene)