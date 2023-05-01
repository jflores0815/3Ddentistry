import * as THREE from "three";
import $ from "jquery";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { radToDeg } from "three/src/math/MathUtils";

var container, stats;
var camera, cameraTarget, scene, renderer, mesh;
var loaded = false;

var BACKGROUND_COLOR = 0xf1f1f1; 

init();
animate();

function init() {
  container = document.getElementById("container");

  camera = new THREE.PerspectiveCamera( 
    5,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set( 0, 0.10, 3 );

  cameraTarget = new THREE.Vector3(0, -0.1, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  scene.fog = new THREE.Fog(BACKGROUND_COLOR, 1, 10);

  // Ground
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry( 5000, 5000, 1, 1 ),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;
  scene.add(plane);

  plane.receiveShadow = true;

  // PLY file
  const loader = new PLYLoader();
  loader.load("/src/models/ply/label/labelmaxi1.ply", function ( geometry ) {

    geometry.computeVertexNormals();

    const material = new THREE.MeshMatcapMaterial({vertexColors: true});
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = -0.1;
    mesh.position.z = 0.4;
    mesh.rotation.x = 0;
    mesh.scale.multiplyScalar(0.002);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add( mesh );
  });

  // Lights
  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  // stats
  stats = Stats();
  container.appendChild(stats.dom);

  // resize
  window.addEventListener("resize", onWindowResize);
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();

  if (mesh != null && loaded == false) {
    initialRotation();
  }
}

function render() {

  camera.lookAt(cameraTarget);
  renderer.render(scene, camera);

}

  // controls
  var isDragging = false;
  var previousMousePosition = {
      x: 0,
      y: 0
  };
  $(renderer.domElement).on('mousedown', function() {
      isDragging = true;
  })
  .on('mousemove', function(e) {
      //console.log(e);
      var deltaMove = {
          x: e.offsetX-previousMousePosition.x,
          y: e.offsetY-previousMousePosition.y
      };
  
      if(isDragging) {
              
          var deltaRotationQuaternion = new THREE.Quaternion()
              .setFromEuler(new THREE.Euler(
                  radToDeg(deltaMove.y * 0.00005),
                  radToDeg(deltaMove.x * 0.00005),
                  0,
                  'XYZ'
              ));
          
          mesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, mesh.quaternion);
      }
      
      previousMousePosition = {
          x: e.offsetX,
          y: e.offsetY
      };
  });
  /* */
  
  $(document).on('mouseup', function() {
      isDragging = false;
  });

// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    mesh.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}
  
