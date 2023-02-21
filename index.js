import * as THREE from 'three';
import { Detector } from './js/Detector.js';
import OrbitControls from './js/OrbitControls.js';

// Checks that your browser supports WebGL. 
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer = null;
var scene    = null;
var camera   = null;
var sun      = null;
var earth = null;
var moon = null;
var curTime  = Date.now();
var earthOrbit = new THREE.Group();
var earthGroup = new THREE.Group();
var sunGroup = new THREE.Group();
var moonGroup = new THREE.Group();
var cameraAngle = 0;
var controls = null;

// This function is called whenever the document is loaded
function init() {
    // Get display canvas
    var canvas = document.getElementById("webglcanvas");
    console.log( canvas );

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas,
                    antialias: true } );
    // Set the viewport size
    renderer.setSize( canvas.width, canvas.height );
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height,
        1, 4000);
    
    // SUN 
    var material = new THREE.MeshPhongMaterial();
    var geometry = new THREE.SphereGeometry(1);
    sun = new THREE.Mesh(geometry);
    sun.position.x = 0;
    sun.position.y = 0;
    sun.position.z = -8;
    sun.rotation.x = Math.PI / 5;
    sun.rotation.y = Math.PI / 5;

    // EARTH
    var mapUrl = "images/earth_atmos_2048.jpg";
    var map    = new THREE.TextureLoader().load( mapUrl );
    var material = new THREE.MeshPhongMaterial({ map: map });
    var geometry = new THREE.SphereGeometry(0.4);
    earth = new THREE.Mesh(geometry, material);
    earth.position.z = 2;
    earth.position.x = 1;

    // MOON
    var mapUrl = "images/moon_1024.jpg";
    var map    = new THREE.TextureLoader().load( mapUrl );
    var material = new THREE.MeshPhongMaterial({ map: map });
    var geometry = new THREE.SphereGeometry(0.1);
    moon = new THREE.Mesh(geometry, material);
    moon.position.z = 0.6;

    var light = new THREE.PointLight( 0xffffff, 1.5);
    light.position.x = sun.position.x;
    light.position.y = sun.position.y;
    light.position.z = sun.position.z;
    scene.add(light);

    earthOrbit.position.x = 0;
    earthOrbit.position.y = 0;
    earthOrbit.position.z = -8;

    moonGroup.position.x = earth.position.x;
    moonGroup.position.y = earth.position.y;
    moonGroup.position.z = earth.position.z;

    moonGroup.add(moon);

    earthGroup.add(earth);
    earthGroup.add(moonGroup);

    earthOrbit.add(earthGroup);

    sunGroup.add(sun);
    sunGroup.add(earthOrbit);

    scene.add(sunGroup);

    //camera.lookAt(new THREE.Vector3().setFromMatrixPosition(sun.matrixWorld));
    controls = new OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 20;


    }

    // This function is called regularly to update the canvas webgl.
    function run() {
    // Ask to call again run 
    requestAnimationFrame( run );

    // Render the scene
    render();

    // Calls the animate function if objects or camera should move
    animate();
}

// This function is called regularly to take care of the rendering.
function render() {
    // Render the scene
    renderer.render( scene, camera );
}

// This function is called regularly to update objects.
function animate() {
    // Computes how time has changed since last display
    var now       = Date.now();
    var deltaTime = now - curTime;
    curTime       = now;
    var fracTime  = deltaTime / 1000; // in seconds
    // Now we can move objects, camera, etc.
    // Example: rotation sun
    var angle = 0.1 * Math.PI * 2 * fracTime; // one turn per 10 second.
    sun.rotation.y += angle;
    angle = fracTime * Math.PI * 2;
    earthOrbit.rotation.y += angle / 10; // la terre tourne en 365 jours
    earth.rotation.y += angle; // et en un jour sur elle-même
    moonGroup.rotation.y  += angle / 5; // la lune tourne en 28 jours autour de la terre
    moon.rotation.y += angle / 28; // et en 28 jours aussi sur elle-même pour faire face à la terre
    
    // Avec un grand demi-axe de 5 et un petit demi-axe de 3
    // cameraAngle += 0.01;
    // camera.position.x = 5 * Math.cos( cameraAngle );
    // camera.position.y = 3 * Math.sin( cameraAngle );

    controls.update();
    controls.target = new THREE.Vector3().setFromMatrixPosition(earth.matrixWorld)

}

init();
run();