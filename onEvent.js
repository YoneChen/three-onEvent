(function (definition) {
    "use strict";
    if (!THREE) {
    	throw new Error("This module is dependent from 'three.js,add this file first.");
    }
    // CommonJS
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition(THREE);

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        definition(THREE);

    } else {
        throw new Error("This environment was not anticipated by three-onEvent. Please file a bug.");
    }

})(function (THREE) {
var TargetList = {
	'gaze': {},
	'click': {},
	'hover': {}
};
var updateCallbackList = [];
var EventListeners = {},listenerList = {};
Object.keys(TargetList).forEach(function(v,i) {
	EventListeners[v] = {
		flag: false,
		listener: function(targetList) {
			listenerList[v](targetList,option.camera);
		}
	};
});
var option = {};

THREE.onEvent = function(scene,camera) {
	option.scene = scene || {};
	option.camera = camera || {};
}
THREE.onEvent.prototype.removeAll = function() {
	for(var key in TargetList) {
		for(var id in TargetList[key]) {
			delete TargetList[key][id];
		}
	}
}
THREE.onEvent.prototype.update = function() {
	for(var key in updateCallbackList) {
		updateCallbackList[key]();
	}
}
Object.assign(THREE.Object3D.prototype,{
	on: function(method,callback1,callback2) {
		if (EventListeners.hasOwnProperty(method)) {
			TargetList[method][this.id] = {
				object3d : this,
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
		if (!!method) {
			if (EventListeners.hasOwnProperty(method)) {
				delete TargetList[method][this.id];
			} else {
				console.warn("There is no method called '" + method + "';");
			}
		} else {
			for(var key in TargetList) {
				delete TargetList[key][this.id];
			}
		}
	}
});
function getObjList(targetList) {
	var list = [];
	for(var key in targetList) {
		var target = targetList[key].object3d;
		list.push(target);
	}
	return group2meshlist(list);
}
function group2meshlist(list) {
	var l = [];
	for (var i in list) {
		if (list[i].type === 'Group') {
			l = l.concat(group2meshlist(list[i].children));
		} else {
			l.push(list[i])
		}
	}
	return l;
}
function getEventObj(targetList,object3d) {
	return object2group(targetList,object3d);
}
function object2group(targetList,object3d) {
	if(targetList[object3d.id]) {
		return targetList[object3d.id];
	} else {
		return object2group(targetList,object3d.parent)
	}
}
// WebVR object3d on gazer
listenerList.gaze = function (targetList,camera) {
	var Gazing = false,targetObject,obj;
	var Eye = new THREE.Raycaster();
	var gazeListener = function() {
		// create a gazeListener loop
		if (!!targetList ) {
			var list = [];
		    Eye.setFromCamera(new THREE.Vector2(),camera);
		    list = getObjList(targetList);
		    var intersects = Eye.intersectObjects(list);
		    
		    if (intersects.length > 0) {
		    	if(!Gazing) { //trigger once when gaze in
			    	Gazing = true;
			      	targetObject = intersects[0].object;
			      	obj = getEventObj(targetList,targetObject);
			      	if(!!obj.callback[0]) obj.callback[0](targetObject);
		      	}
		    } else{ 
		    	if(Gazing && !!obj.callback[1]) {
		      		obj.callback[1](targetObject);
		    	}
		    	Gazing = false;
		    }
		}
	}
	updateCallbackList.push(gazeListener);
}
// object3d on mouse click 
listenerList.click = function (targetList,camera) {
	var targetObject,obj,Click = false,Down = false;
	var Mouse = new THREE.Raycaster();
	function down(event) {
		event.preventDefault();
		if (!targetList) return;
		var list = [];
		Mouse.setFromCamera(new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1), camera);
	    list = getObjList(targetList);
	    var intersects = Mouse.intersectObjects(list);
	    
	    if (intersects.length > 0) { // mouse down trigger
	    	if (Click) return;
	    	Click = true;
	      	targetObject = intersects[0].object;
	      	obj = getEventObj(targetList,targetObject);
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
		if (Click && !!obj.callback[0]) obj.callback[0](targetObject);
		Click = false;
	}
		window.addEventListener('mousedown',down,false);
		window.addEventListener('mousemove',move,false);
		window.addEventListener('mouseup',up,false);
}
// object3d on mouse hover
listenerList.hover = function (targetList,camera) {
	var targetObject,obj,Hover = false;
	var Mouse = new THREE.Raycaster();
	window.addEventListener('mousemove',function(event) {
		event.preventDefault();
		if (!targetList) return;
		var list = [];
		Mouse.setFromCamera(new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1,- ( event.clientY / window.innerHeight ) * 2 + 1), camera);
	    
	    list = getObjList(targetList);
	    var intersects = Mouse.intersectObjects(list);
	    
	    if (intersects.length > 0) {
	    	if (Hover) return;
	    	Hover = true;
	      	targetObject = intersects[0].object;
	      	obj = getEventObj(targetList,targetObject);
	      	if(!!obj.callback[0]) obj.callback[0](targetObject);
	    } else {
	    	if(Hover && !!obj.callback[1]) {
	    		obj.callback[1](targetObject);
	    	}
	    	Hover = false;
	    }
	}, false)
}
});
