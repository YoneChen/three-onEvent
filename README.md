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
-   use [onEvent.js]('https://github.com/YorkChan94/three-onEvent/blob/master/onEvent.js') in browser ``<script src ='three-onevent/onEvent.js'>`` 

## Tutorial
* make sure you have import three.js.  See [examples](https://yorkchan94.github.io/three-onEvent/example.html)
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
  // mesh is gazed out
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

Please Star this Project if you like it! Following would also be appreciated!


# three-onEvent中文文档
一款实用的three.js监听事件插件
## 安装

    $ npm install three-onevent --save
    # 或者
    $ yarn add three-onevent
    # 或直接在页面 '<script>' 中引用onEvent.js



## 开始
### 引用方式

-   1.node：webpack或者rollup模块引入：``require ('three-onevent.js')`` 或者 ``import 'three-onevent.js'``
-   2.浏览器：在html引入[onEvent.js]('https://github.com/YorkChan94/three-onEvent/blob/master/onEvent.js') ``<script src ='three-onevent/onEvent.js'>`` 

### 初始化
* 请确保已经引用three.js.  See [examples](https://yorkchan94.github.io/three-onEvent/example.html)
> 使用方法：THREE.onEvent(scene:THREE.Scene,camera:THREE.Camera);
```
// 在render渲染之前初始化
// 传入场景和相机
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(fov,window.innerWidth/window.innerHeight,0.1,10000);
camera.position.set( 0, 0, 0 );
scene.add(WebVR.Camera);
THREE.onEvent(scene,camera);
...Render渲染...
```
### 添加监听器 "on"

> 使用方法：mesh.on(method:string,callback:function) 这里的mesh指的是THREE.Mesh的实例
```
// 给一个立方体绑定点击事件
var geo = new THREE.CubeGeometry(5,5,5);
var mat = new THREE.MeshBasicMaterial({color:0x00aadd});
var mesh = new THREE.Mesh(geo,mat);
mesh.on('click',function(m) {
  m.scale.set(2,2,2); // m指向mesh
})
myScene.add(mesh);
```
### 移除监听器 "off"

> 使用方法: mesh.off(method:stiring)
```
//移除点击事件
mesh.off('click');
```

### method可选参数

> method: string 'click','hover','gaze','longGaze'

```
// hover鼠标悬停监听 
mesh.on('hover',function(m) {
  // mouse enter the mesh
  m.scale.set(2,2,2); 
},function(m) {
  // mouse leave out the mesh
  m.scale.set(1,1,1);
});

// webvr gaze凝视监听
mesh.on('gaze',function(m) {
  // mesh is gazed in
  m.material.color = 0x00ddaa;
},function(m) {
  // mesh is gazed out
  m.material.color = 0x00aadd;
})
```
