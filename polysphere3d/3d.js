import {
Group,
} from './three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor( 0x000000, 0 );
var group = new Group();
renderer.setSize( 175, 175 );
document.getElementById("displays").prepend( renderer.domElement );

var n = 0;
var level = 1;
var radius = 1;
var geometry, material, sphere;
var spheres = [];
while(n<data.length){
	for(var i = 0; i<level; i++){
		for(var j = 0; j<level; j++){
			geometry = new THREE.SphereGeometry( radius, 32, 16 );
			material = new THREE.MeshBasicMaterial( { color: parseInt("0x"+colours[data[n]],16) } );
			sphere = new THREE.Mesh( geometry, material );
			sphere.position.x = ((radius)*(level-1))-(i*radius*2);
			sphere.position.y = 0-(radius*(level-1)*2);
			sphere.position.z = (j*radius*2)-((radius)*(level-1));
			spheres.push(sphere);
			group.add( sphere );
			n++;
			console.log(n+","+sphere.position.x+","+sphere.position.y+","+sphere.position.z);
		}
	}
	level++;
	
}
var oldData=data;
scene.add(group);
camera.position.z = level*radius*2.5;
camera.position.y = -level*radius;
function animate() {
	group.rotation.y += 0.01;
	if(oldData!=data){
		for(var i=0; i<spheres.length; i++){
			spheres[i].material.color.setHex(parseInt("0x"+colours[data[i]],16));
			console.log(colours[data[i]]);
		}
		oldData=data;
	}
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();