(function (definition) {
    "use strict";
    if (!(window.THREE || THREE)) {
    	throw new Error("This module is dependent from 'three.js,add this file first.");
    }
    // CommonJS
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition(window.THREE || THREE);

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        definition(window.THREE || THREE);

    } else {
        throw new Error("This environment was not anticipated by three-onEvent. Please file a bug.");
    }

})(function (THREE) {
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
	},
	off: function(method) {
		if (EventListeners.hasOwnProperty(method)) {
			delete TargetList[method][this.id];
		} else {
			console.warn("There is no method called '" + method + "';");
		}
	}
});
// WebVR mesh on gazer
listenerList.gaze = function (targetList,camera) {
	var Gazing = false,targetMesh,obj;
	var Eye = new THREE.Raycaster();
	var gazeListener = function() {
		// create a gazeListener loop
		if (!!targetList) {
			var list = [],objList = [];
		    Eye.setFromCamera(new THREE.Vector2(),camera);
		    for(var key in targetList) {
		    	objList.push(targetList[key])
		    }
		    objList.forEach(function(v,i){
		    	list.push(v.mesh);
		    })
		    var intersects = Eye.intersectObjects(list);
		    
		    if (intersects.length > 0) {
		    	if(!Gazing) { //trigger once when gaze in
			    	Gazing = true;
			      	targetMesh = intersects[0].object;
			      	obj = targetList[targetMesh.id];
			      	if(!!obj.callback[0]) obj.callback[0](targetMesh);
		      	}
		    } else{ 
		    	if(Gazing && !!obj.callback[1]) {
		      		obj.callback[1](targetMesh);
		    	}
		    	Gazing = false;
		    }
		}
		requestAnimationFrame(gazeListener);
	}
	gazeListener();
}
// WebVR mesh on long gaze
listenerList.longGaze = function (targetList,camera) {
	var Gazing = false,targetMesh,obj;
	var DELAY_TIME = 1200;
	var Eye = new THREE.Raycaster();
	var start = null;
	var gazeListener = function(timestamp) {
		if (!!targetList) {
			var list = [],objList = [];
		    Eye.setFromCamera(new THREE.Vector2(),camera);
		    for(var key in targetList) {
		    	objList.push(targetList[key])
		    }
		    objList.forEach(function(v,i){
		    	list.push(v.mesh);
		    })
		    var intersects = Eye.intersectObjects(list);
		    
		    if (intersects.length > 0) { 
		    	if(!Gazing) { // gaze event trigger
					if (!start) start = timestamp;
		  			var delay = timestamp - start;
			    	if( delay > DELAY_TIME) { // 2 seconds
			    		Gazing = true;
				      	targetMesh = intersects[0].object;
				      	obj = targetList[targetMesh.id];
				      	if(!!obj.callback[0]) obj.callback[0](targetMesh);
			      	}
		      	}
		    } else{ 
		    	start = null;
		    	if(Gazing && !!obj.callback[1]) {
		      		obj.callback[1](targetMesh);
		    	}
		    	Gazing = false;
		    }
		}
		requestAnimationFrame(gazeListener);
	}
	gazeListener();
}
// mesh on mouse click 
listenerList.click = function (targetList,camera) {
	var targetMesh,obj,Click = false,Down = false;
	var Mouse = new THREE.Raycaster();
	function down(event) {
		event.preventDefault();
		if (!targetList) return;
		var list = [],objList = [];
		Mouse.setFromCamera(new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1), camera);
	    for(var key in targetList) {
	    	objList.push(targetList[key])
	    }
		objList.forEach(function(v,i){
	    	list.push(v.mesh);
	    })
	    var intersects = Mouse.intersectObjects(list);
	    
	    if (intersects.length > 0) { // mouse down trigger
	    	if (Click) return;
	    	Click = true;
	      	targetMesh = intersects[0].object;
	      	obj = targetList[targetMesh.id];
	    } else {
	    	Click = false;
	    }
	}
	function move(event) {
		event.preventDefault();
		// disable click trigger when mouse moving
		if (Click) Click = false;
	}
	function up(event) {
		event.preventDefault();
		if (Click && !!obj.callback[0]) obj.callback[0](targetMesh);
		Click = false;
	}
		window.addEventListener('mousedown',down,false);
		window.addEventListener('mousemove',move,false);
		window.addEventListener('mouseup',up,false);
}
// mesh on mouse hover
listenerList.hover = function (targetList,camera) {
	var targetMesh,obj,Hover = false;
	var Mouse = new THREE.Raycaster();
	window.addEventListener('mousemove',function(event) {
		event.preventDefault();
		if (!targetList) return;
		var list = [],objList = [];
		Mouse.setFromCamera(new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1), camera);
	    
	    for(var key in targetList) {
	    	objList.push(targetList[key])
	    }
	    objList.forEach(function(v,i){
	    	list.push(v.mesh);
	    })
	    var intersects = Mouse.intersectObjects(list);
	    
	    if (intersects.length > 0) {
	    	if (Hover) return;
	    	Hover = true;
	      	targetMesh = intersects[0].object;
	      	obj = targetList[targetMesh.id];
	      	if(!!obj.callback[0]) obj.callback[0](targetMesh);
	    } else {
	    	if(Hover && !!obj.callback[1]) {
	    		obj.callback[1](targetMesh);
	    	}
	    	Hover = false;
	    }
	}, false)
}
});
