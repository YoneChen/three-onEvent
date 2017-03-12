
var TargetList = {
	'gaze': {},
	'longGaze': {},
	'click': {},
	'hover': {}
};
var EventListeners = {},listenerList = {};
Object.keys(TargetList).forEach(function(v,i) {
	EventListeners[v] = {
		flag: false,
		listener: function(targetList) {
			listenerList[v](targetList,option.camera);
		}
	}
});
var option = {};

THREE.onEvent = function(scene,camera) {
	option.scene = scene || {};
	option.camera = camera || {};
}
Object.assign(THREE.Mesh.prototype,{
	on: function(method,callback1,callback2) {
		if (EventListeners.hasOwnProperty(method)) {
			TargetList[method][this.id] = {
				mesh : this,
				callback: Array.from(arguments).slice(1)
			};
			var eventlistener = EventListeners[method];
			if(!eventlistener.flag){
				eventlistener.flag = true;
				eventlistener.listener(TargetList[method]);
			}
		} else {
			console.warn("There is no method called '" + method + "';");
		}
		return this;
	},
	off: function(method) {
		if (EventListeners.hasOwnProperty(method)) {
			delete TargetList[method][this.id];
		} else {
			console.warn("There is no method called '" + method + "';");
		}
	}
});
// WebVR mesh gazer 凝视监听器
listenerList.gaze = function (targetList,camera) {
	var Gazing = false,targetMesh,obj;
	var Eye = new THREE.Raycaster();
	var gazeListener = function() {
		//创建凝视器
		if (!!targetList) {
			var list = [];
		    Eye.setFromCamera(new THREE.Vector2(),camera);
		    Object.values(targetList).forEach(function(v,i){
		    	list.push(v.mesh);
		    })
		    var intersects = Eye.intersectObjects(list);
		    
		    if (intersects.length > 0) { //凝视触发
		    	if(!Gazing) { //只触发一次
			    	Gazing = true;
			      	targetMesh = intersects[0].object;
			      	obj = targetList[targetMesh.id];
			      	if(!!obj.callback[0]) obj.callback[0]();
		      	}
		    } else{ 
		    	if(Gazing && !!obj.callback[1]) {
		      		obj.callback[1]();
		    	}
		    	Gazing = false;
		    }
		}
		requestAnimationFrame(gazeListener);
	}
	gazeListener();
}
// WebVR long gazer 长凝视监听器
listenerList.longGaze = function (targetList,camera) {
	var Gazing = false,targetMesh,obj;
	var Eye = new THREE.Raycaster();
	var start = null;
	var gazeListener = function(timestamp) {
		//创建凝视器
		if (!!targetList) {
			var list = [];
		    Eye.setFromCamera(new THREE.Vector2(),camera);
		    Object.values(targetList).forEach(function(v,i){
		    	list.push(v.mesh);
		    })
		    var intersects = Eye.intersectObjects(list);
		    
		    if (intersects.length > 0) { //凝视触发
		    	if(!Gazing) { //只触发一次
					if (!start) start = timestamp;
		  			var delay = timestamp - start;
			    	if( delay > 1200) { // 2 seconds
			    		Gazing = true;
				      	targetMesh = intersects[0].object;
				      	obj = targetList[targetMesh.id];
				      	if(!!obj.callback[0]) obj.callback[0]();
			      	}
		      	}
		    } else{ 
		    	start = null;
		    	if(Gazing && !!obj.callback[1]) {
		      		obj.callback[1]();
		    	}
		    	Gazing = false;
		    }
		}
		requestAnimationFrame(gazeListener);
	}
	gazeListener();
}
// mesh onclick 鼠标点击监听器
listenerList.click = function (targetList,camera) {
	var targetMesh,obj,Click = false;
	var Mouse = new THREE.Raycaster();
	window.addEventListener('click',function(event) {
		event.preventDefault();
		if (!targetList) return;
		var list = [];
		Mouse.setFromCamera(new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1), camera);
	    Object.values(targetList).forEach(function(v,i){
	    	list.push(v.mesh);
	    })
	    var intersects = Mouse.intersectObjects(list);
	    
	    if (intersects.length > 0) { //凝视触发
	    	if (Click) return;
	    	Click = true;
	      	targetMesh = intersects[0].object;
	      	obj = targetList[targetMesh.id];
	      	if(!!obj.callback[0]) obj.callback[0]();
	    } else {
	    	if(Click && !!obj.callback[1]) {
	    		obj.callback[1]();
	    	}
	    	Click = false;
	    }
	}, false)
}
// mesh hover 鼠标悬停监听器
listenerList.hover = function (targetList,camera) {
	var targetMesh,obj,Hover = false;
	var Mouse = new THREE.Raycaster();
	window.addEventListener('mousemove',function(event) {
		event.preventDefault();
		if (!targetList) return;
		var list = [];
		Mouse.setFromCamera(new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1), camera);
	    Object.values(targetList).forEach(function(v,i){
	    	list.push(v.mesh);
	    })
	    var intersects = Mouse.intersectObjects(list);
	    
	    if (intersects.length > 0) {
	    	if (Hover) return;
	    	Hover = true;
	      	targetMesh = intersects[0].object;
	      	obj = targetList[targetMesh.id];
	      	if(!!obj.callback[0]) obj.callback[0]();
	    } else {
	    	if(Hover && !!obj.callback[1]) {
	    		obj.callback[1]();
	    	}
	    	Hover = false;
	    }
	}, false)
}
