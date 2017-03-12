# three-onEvent
Add  an EventListener for Mesh in your three.js project.

Here is a quick start example
### Step1 
Init onEvent 
```
//init your events container before render
THREE.onEvent(myScene,myCamera);
```
### Step2 
Add eventListener like mesh.on(method:string,callback:function)
```
var geo = new THREE.CubeGeometry(5,5,5);
var mat = new THREE.MeshBasicMaterial({color:0x00aadd});
var mesh = new THREE.Mesh(geo,mat);
mesh.on('click',function(m) {
  m.scale.set(2,2,2); // m is link to mesh
})
myScene.add(mesh);
```
Remove eventListener like mesh.off(method:string)
```
mesh.off('click');
```
### More Method
* method: click,hover,gaze,longGaze
```
// hover eventLisener 
mesh.on('hover',function(m) {
  // mouse enter the mesh
  m.scale.set(2,2,2); 
},function(m) {
  // mouse leave out the mesh
  m.scale.set(1,1,1);
});

// webvr gaze eventListener
mesh.on('gaze',function(m) {
  // mesh is gazed in
  m.material.color = 0x00ddaa;
},function(m) {
  m.material.color = 0x00aadd;
})
```
