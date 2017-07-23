# three-onEvent
Add an EventListener for Object3d (Mesh,Group) in your three.js project.

## Installation

    $ npm install three-onevent --save
    # or
    $ yarn add three-onevent
    # or add onEvent.js with '<script>' tag


## Get Started
It can be loaded as:

-   ``require ('three-onevent.js')`` or ``import 'three-onevent.js'`` as a module in webpack or rollup
-   use [onEvent.js]('https://github.com/YoneChen/three-onEvent/blob/master/onEvent.js') in browser ``<script src ='three-onevent/onEvent.js'>`` 

## Tutorial
* make sure you have import three.js.  See [examples](https://yonechen.github.io/three-onEvent/example.html)
1. Init onEvent 
```
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(fov,window.innerWidth/window.innerHeight,0.1,10000);
camera.position.set( 0, 0, 0 );
scene.add(camera);
var renderer = new THREE.WebGLRenderer({ antialias: true } );
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// init your events container before renderer.render()
// Require THREE.scene and THREE.camera as param
var threeOnEvent = new THREE.onEvent(scene,camera);

...

function animate() {
  requestAnimationFrame(render);
  renderer.render();
}
animate();
```
2. Add eventListener with 'on'

> object3d.on(method:string,callback:function)

```
var geo = new THREE.CubeGeometry(5,5,5);
var mat = new THREE.MeshBasicMaterial({color:0x00aadd});
var mesh = new THREE.Mesh(geo,mat);
scene.add(mesh);
mesh.on('click',function(m) {
  m.scale.set(2,2,2); // m is link to mesh
})
```
3. Remove event with 'off' from Object3d
```
mesh.off('click'); // remove click event from mesh
mesh.off(); // remove all events from mesh
```
4. Remove all events
```
//remove all events from all Object3d
threeOnEvent.removeAll();
```
## More Method

> method: string 'click','hover',['gaze'](https://yonechen.github.io/webvr-webpack2-boilerplate/dist/)

```
// hover eventLisener 
mesh.on('hover',function(m) {
  // mouse enter the mesh
  m.scale.set(2,2,2); 
},function(m) {
  // mouse leave out the mesh
  m.scale.set(1,1,1);
});
```

```
// webvr gaze eventListener
mesh.on('gaze',function(m) {
  // mesh is gazed in
  m.material.color = 0x00ddaa;
},function(m) {
  // mesh is gazed out
  m.material.color = 0x00aadd;
});
// render loop
function animate() {
  requestAnimationFrame(render);
  renderer.render();
  // update gaze loop 
  threeOnEvent.update(); 
}
animate();
```
## Need Help?

Ask questions [here](https://github.com/yonechen/three-onEvent/issues).

## Any advise?

PR welcome [here](https://github.com/yonechen/three-onEvent/pulls).

## Contributors

YoneChen <yorkchan94@gmail.com>

## License

MIT

Please Star this Project if you like it! Following would also be appreciated!


# three-onEvent中文文档
一款实用的three.js监听事件插件，支持3d物体（mesh,group）点击、悬停、凝视事件绑定。

## 安装

    $ npm install three-onevent --save
    # 或者
    $ yarn add three-onevent
    # 或者在页面引入 '<script type="javascript "src="onEvent.js">'


## 开始

### 引用方式

-   1.node：webpack或者rollup模块引入：``require ('three-onevent.js')`` 或者 ``import 'three-onevent.js'``
-   2.浏览器：在html引入[onEvent.js]('https://github.com/YoneChen/three-onEvent/blob/master/onEvent.js') ``<script src ='three-onevent/onEvent.js'>`` 

### 初始化
* 请确保已经引用three.js.  See [examples](https://yonechen.github.io/three-onEvent/example.html)
> 使用方法：THREE.onEvent(scene:THREE.Scene,camera:THREE.Camera);
```
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(fov,window.innerWidth/window.innerHeight,0.1,10000);
camera.position.set( 0, 0, 0 );
scene.add(camera);
var renderer = new THREE.WebGLRenderer({ antialias: true } );
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 在render渲染之前初始化
// 传入场景和相机
var threeOnEvent = new THREE.onEvent(scene,camera);

// 动画渲染
function animate() {
  requestAnimationFrame(render);
  renderer.render();
}
animate();
```
### 绑定事件 "on"

> object3d.on(method:string,callback:function) 这里的object3d指的是THREE.Object3d的实例
```
// 给一个立方体绑定点击事件
var geo = new THREE.CubeGeometry(5,5,5);
var mat = new THREE.MeshBasicMaterial({color:0x00aadd});
var mesh = new THREE.Mesh(geo,mat);
mesh.on('click',function(m) {
  m.scale.set(2,2,2); // m指向mesh
})
scene.add(mesh);
```
### 移除事件 "off"

> 使用方法: mesh.off(method:stiring)
```
//移除点击事件
mesh.off('click');
//参数为空则移除所有绑定事件
mesh.off();
```
### 移除所有物体监听器 
```
//移除已绑定的所有事件
threeOnEvent.removeAll();
```
### method可选参数

> method: string 'click','hover','gaze'

```
// hover鼠标悬停监听 
mesh.on('hover',function(m) {
  // mouse enter the mesh
  m.scale.set(2,2,2); 
},function(m) {
  // mouse leave out the mesh
  m.scale.set(1,1,1);
});
```

```
// webvr gaze凝视监听
mesh.on('gaze',function(m) {
  // mesh is gazed in
  m.material.color = 0x00ddaa;
},function(m) {
  // mesh is gazed out
  m.material.color = 0x00aadd;
});
// 动画渲染
function animate() {
  requestAnimationFrame(render);
  renderer.render();
  // 更新gaze凝视流 
  threeOnEvent.update(); 
}
animate();
```
