import * as THREE from "./three/three.module.js";
import { OrbitControls } from "./js/OrbitControls.js";

var container;

var camera, scene, renderer, controls, points;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );

  // scene
  scene = new THREE.Scene();


  var ambientLight = new THREE.AmbientLight(0xcccccc, 1);
  scene.add(ambientLight);
  var pointLight = new THREE.PointLight(0xffffff, 1);
  
  camera.add(pointLight);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xb5aaaa, 1);

  container.appendChild(renderer.domElement);

  // Grid
  var grid = new THREE.GridHelper(50, 50);
  scene.add(grid);

  //ADD AXIS
  var axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  //Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(50, 20, 100);
  controls.update();

  drawBezierCurve();

  window.addEventListener("resize", onWindowResize, false);
}

function drawBezierCurve() {
  var bezierCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3( -10, 0, 10 ),
    new THREE.Vector3( 5, 30, 10 ),
    new THREE.Vector3( 5, 15, 10 ),
    new THREE.Vector3( 10, 0, -10 )
  );

  points = bezierCurve.getPoints( 50 );
  var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
  var geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  // // Create the final object to add to the scene
  var curveObject = new THREE.Line( geometry, material );
  scene.add(curveObject);

  points = bezierCurve.getSpacedPoints(50);
  let pointOnes = points;

  for(var i = 0; i < points.length; i++)
  {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(points[i]);
    var dotMaterial = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false } );
    var dot = new THREE.Points( dotGeometry, dotMaterial );
    scene.add( dot );
  }

  const frames = bezierCurve.computeFrenetFrames(50, false);
  points = bezierCurve.getSpacedPoints(50);

  console.log(frames);

  const scalar = 1;
  let pointOne, pointTwo, tempPoint;
  for(var i = 0; i < frames.tangents.length; i++)
  {
    pointOne = points[i];
    tempPoint = pointOnes[i];
    pointTwo = frames.tangents[i].multiplyScalar(2);
    pointTwo = pointOne.add(pointTwo);

    var linePoints = [tempPoint, pointTwo];
    var mat = new THREE.LineBasicMaterial( { color : 0x0000ff } );
    var geo = new THREE.BufferGeometry().setFromPoints(linePoints);
    
    var tangent = new THREE.Line(geo, mat);
    scene.add(tangent)
  }  
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}