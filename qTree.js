/*
Small library for the manipulation of Quadratic Trees, very useful for speed up and optimisation of finding algorithms
Copyright 2015, Clement Artaud 
Version : 2.0.0
*/

/* QTree object, created with a bounding box object, a depth, an optional max depth and max objects
@param Object bbox : {x, y, width, height} bounding box of the tree
@param (optional) Number depth, maxDepth, maxObjects
@param (optional) Object QTree parent : reference to the parent node, default null
*/
function QTree(bbox, depth, maxDepth, maxObjects, parent){
	this.x = bbox.x;
	this.y = bbox.y;
	this.width = bbox.width;
	this.height = bbox.height;
	this.depth = (typeof depth !== 'number') ? 0 : depth;
	
	this.maxDepth = (typeof maxDepth !== 'number') ? 10 : maxDepth;
	this.maxObjects = (typeof maxObjects !== 'number') ? 10 : maxObjects;
	
	this.nodes = [];
	this.objects = [];
	this.parent = (typeof parent === 'undefined') ? undefined : parent;
};

/* Finds all objects which can collide a given bounding box
@return [Object] : array of objects in the tree around the bounding box
*/
QTree.prototype.find = function(bbox){
	var output = this.objects;
	
	/*
	for(iii=0; iii<this.objects.length; iii++){
		var obj = this.objects[iii];
		if(this.cross(bbox, obj.bbox)){
			output.push(obj.object);
		}
	}
	*/
	
	//If there are subtrees
	if(this.nodes.length === 4){
		//Test node index for bbox, and add the node, or all of them if no fitting
		var index = this.getIndex(bbox);
		if(index === -1){
			for(iii=0; iii<4; iii++){
				output.concat(this.nodes[iii].find(bbox));
			}
		}
		else {
			output.concat(this.nodes[index].find(bbox));
		}
	}
	
	return output;
};

/* Is the object crossing the bounding box
@return Boolean : true if the object is crossing
*/
QTree.prototype.cross = function(bbox, objbox){
	//Horizontal Crossing
	if( ! (objbox.x > bbox.x+bbox.width || objbox.x+objbox.width < bbox.x)){
		//Vertical Crossing
		if( ! (objbox.y > bbox.y+bbox.height || objbox.y+objbox.height < bbox.y)){
			//Effectively crossing !
			return true;
		}
	}
	return false;
};

/* Adds an object with his bounding box in the tree
@return Boolean : true if object is added
*/
QTree.prototype.add = function(object, bbox){
	//Add the object to the current tree, if there is no subtree
	if(this.nodes.length === 0){
		//If we don't overwhelm the current node, add to it
		if(this.objects.length < this.maxObjects){
			this.objects.push({object: object, bbox: bbox});
			return true;
		}
		//Else split the node if not max depth
		if(this.depth < this.maxDepth){
			this.divide();
		}
		//If not possible throw an error for max depth reached
		else {
			throw new Error('Max depth reached, tree is full !');
		}
	}
	//Push the content to the next tree, or put it there if there is no fitting inside a subtree
	var index = this.getIndex(bbox);
	if(index === -1){ //No fit in a subtree
		this.objects.push({object: object, bbox: bbox});
		return true;
	}
	//Lastly push to the adequate subtree
	return this.nodes[index].add(object, bbox);
};

/* Divides a node in 4 sub-nodes and pushes down the content of the node */
QTree.prototype.divide = function(){
	var subWidth = this.width/2;
	var subHeight = this.height/2;
	
	//TopLeft
	this.nodes[0] = new QTree({
		x: this.x,
		y: this.y,
		width: subWidth,
		height: subHeight,
	}, this.depth+1, this.maxDepth, this.maxObjects, this);
	
	//TopRight
	this.nodes[1] = new QTree({
		x: this.x+subWidth,
		y: this.y,
		width: subWidth,
		height: subHeight,
	}, this.depth+1, this.maxDepth, this.maxObjects, this);
	
	//BotLeft
	this.nodes[2] = new QTree({
		x: this.x,
		y: this.y+subHeight,
		width: subWidth,
		height: subHeight,
	}, this.depth+1, this.maxDepth, this.maxObjects, this);
	
	//BotRight
	this.nodes[3] = new QTree({
		x: this.x+subWidth,
		y: this.y+subHeight,
		width: subWidth,
		height: subHeight,
	}, this.depth+1, this.maxDepth, this.maxObjects, this);
	
	//Throw down the content of the tree, except if there is no fitting
	var stayHere = [], next = null;
	while(next = this.objects.pop()){
		//Push the content to the next tree, or put it there if there is no fitting inside a subtree
		var index = this.getIndex(next.bbox);
		if(index === -1){ //No fit in a subtree
			stayHere.push(next);
		}
		//Lastly push to the adequate subtree
		else this.nodes[index].add(next.object, next.bbox);
	}
	this.objects = stayHere;
};

/* Gets the subtree index of a given bounding box
@return Number index : index of the node, -1 if the content does not fit in a subtree
*/
QTree.prototype.getIndex = function(bbox){
	var verticalMid = this.x+this.width/2;
	var horizontalMid = this.y+this.height/2;
	
	var index = -1;
	
	//Top section
	if(bbox.y+bbox.height < horizontalMid){
		//Top Left
		if(bbox.x+bbox.width < verticalMid){
			index = 0;
		}
		//Top Right
		else if(bbox.x >= verticalMid){
			index = 1;
		}
	}
	//Bot section
	else if(bbox.y >= horizontalMid){
		//Bot Left
		if(bbox.x+bbox.width < verticalMid){
			index = 2;
		}
		//Bot Right
		else if(bbox.x >= verticalMid){
			index = 3;
		}
	}
	
	return index;
};