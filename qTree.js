/*
Small library for the manipulation of Quadratic Trees, very useful for speed up and optimisation of finding algorithms
Copyright 2015, Clement Artaud 
Version : 2.0.0
*/

/* QTree object, created with a bounding box object, a depth, an optional max depth and parent
@param Number x1, y1, x2, y2 : bounds of the tree
@param (optional) Number depth, maxDepth
@param (optional) Object QTree parent : reference to the parent node, default null
*/
function QTree(x1, y1, x2, y2, maxDepth, parent, depth){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	
	this.depth = (typeof depth !== 'number') ? 0 : depth;
	
	this.maxDepth = (typeof maxDepth !== 'number') ? 50 : maxDepth;
	
	this.nodes = [];
	
	this.object = null;
	this.objX = null;
	this.objY = null;
	
	this.parent = (typeof parent === 'undefined') ? undefined : parent;
};

/* Visits the nodes recursively and apply a callback function on the node.
@param Function : callback f(x1,y1,x2,y2,object, x, y)
Visit the children if the callback returns true
*/
QTree.prototype.visit = function(callback){
	var next = callback.call(this, this.x1, this.y1, this.x2, this.y2, this.object, this.objX, this.objY);
	if(next){
		if(this.nodes.length > 0){
			this.nodes.forEach(function(node){
				node.visit(callback);
			});
		}
	}
};

/* Finds all objects which can collide a given bounding box
@return [Object] : array of objects in the tree around the bounding box
*/
QTree.prototype.find = function(x1, y1, x2, y2){
	var output = [];
	
	//If the object is in the box
	if(this.objX >= x1 && this.objX <= x2 && this.objY >= y1 && this.objY <= y2){
		output.push(this.object);
	}
	
	//If there are subtrees
	if(this.nodes.length > 0){
		//Test node index for bbox, and add the node, or all of them if no fitting
		var index = this.getIndex(x1, y1, x2, y2);
		var self = this;
		index.forEach(function(iii){
			output = output.concat(self.nodes[iii].find(x1, y1, x2, y2));
		});
	}
	
	return output;
};

/* Adds an object with his position in the tree
@return Boolean : true if object is added
*/
QTree.prototype.add = function(object, x, y){
	//Add the object to the next tree if it exists
	if(this.nodes.length > 0){
		var index = this.getIndex(x, y, x, y)[0]; // The index can only be one precise subtree (point object)
		return this.nodes[index].add(object, x, y);
	}
	//If the object is not empty
	if(this.object){
		this.divide();
		//Push down the object
		var index = this.getIndex(this.objX, this.objY, this.objX, this.objY);
		this.nodes[index].add(this.object, this.objX, this.objY);
		
		this.object = null;
		this.objX = null;
		this.objY = null;
		
		var index = this.getIndex(x, y, x, y)[0];
		return this.nodes[index].add(object, x, y);
	}
	//Add the object to the curent node
	this.object = object;
	this.objX = x;
	this.objY = y;
	
	return true;
};

/* Divides a node in 4 sub-nodes */
QTree.prototype.divide = function(){
	var subx = (this.x1 + this.x2)/2;
	var suby = (this.y1 + this.y2)/2;
	
	//TopLeft
	this.nodes[0] = new QTree(this.x1, this.y1, subx, suby, this.maxDepth, this, this.depth+1);
	
	//TopRight
	this.nodes[1] = new QTree(subx, this.y1, this.x2, suby, this.maxDepth, this, this.depth+1);
	
	//BotLeft
	this.nodes[2] = new QTree(this.x1, suby, subx, this.y2, this.maxDepth, this, this.depth+1);
	
	//BotRight
	this.nodes[3] = new QTree(subx, suby, this.x2, this.y2, this.maxDepth, this, this.depth+1);
};

/* Gets the subtree index of a given bounding box
@return [Number] index : index of the nodes which cover the box
*/
QTree.prototype.getIndex = function(x1, y1, x2, y2){
	var verticalMid = (this.x1+this.x2)/2;
	var horizontalMid = (this.y1+this.y2)/2;
	
	//Discriminate section fitting
	var top = (y2 < horizontalMid);
	var bot = (y1 >= horizontalMid);
	var left = (x2 < verticalMid);
	var right = (x1 >= verticalMid);
	
	//Top Left
	if(top && left){
		return [0];
	}
	//Top Right
	else if(top && right){
		return [1];
	}
	//Bot Left
	else if(bot && left){
		return [2];
	}
	//Bot Right
	else if(bot && right){
		return [3];
	}
	//Just Top
	else if(top){
		return [0,1];
	}
	//Just Bot
	else if(bot){
		return [2,3];
	}
	//Just Left
	else if(left){
		return [0,2];
	}
	//Just Right
	else if(right){
		return [1,3];
	}
	
	return [0,1,2,3];
};