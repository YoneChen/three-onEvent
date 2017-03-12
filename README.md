# three-onEvent
Add an EventListener for Mesh in your three.js project.

## Installation

    $ npm install three-onevent --save
    # or
    $ yarn add three-onevent
    # or add onEvent.js with '<script>' tag


## Get Started
It can be loaded as:

-   ``require ('three-onevent.js')`` or ``import 'three-onevent.js'`` as a module in webpack or rollup
-   use [onEvent.js]('https://github.com/yorkchan94/three-onEvent/onEvent.js') in browser ``<script src ='three-onevent/onEvent.js'>`` 

## Tutorial
* make sure you have import three.js 
1. Init onEvent 
```
// init your events container before render
// Require THREE.scene and THREE.camera as param
THREE.onEvent(myScene,myCamera);
```
2. Add eventListener with 'on'
> mesh.on(method:string,callback:function)
```
var geo = new THREE.CubeGeometry(5,5,5);
var mat = new THREE.MeshBasicMaterial({color:0x00aadd});
var mesh = new THREE.Mesh(geo,mat);
mesh.on('click',function(m) {
  m.scale.set(2,2,2); // m is link to mesh
})
myScene.add(mesh);
```
3. Remove event with 'off'
```
mesh.off('click');
```
## More Method
> method: string 'click','hover','gaze','longGaze'
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

## Need Help?

Ask questions [here](https://github.com/yorkchan94/three-onEvent/issues).

## Any advise?

PR welcome [here](https://github.com/yorkchan94/three-onEvent/pulls).

## Contributors

YorkChan <yorkchan94@gmail.com>

## License

MIT