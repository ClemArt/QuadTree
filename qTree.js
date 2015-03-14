/*
Small library for the manipulation of Quadratic Trees, very useful for speed up and optimisation of finding algorithms
Used with a discriminant normal location between [0,1] to locate the different sub-trees
Copyright 2015, Clement Artaud 
Version : 1.0.0
*/

function QTree(){
	this.root = new QNode(0, [0.5, 0.5]);
}

QTree.prototype.add = function(content, contentLoc){
	this.root.put(content, contentLoc);
};

function QNode(level, breakPoint){
	this.breakPoint = breakPoint;
	this.status = 'leaf';
	this.NW = null;
	this.NE = null;
	this.SW = null;
	this.SE = null;
	this.content = null;
	this.contentLoc = null;
	this.lvl = level;
}

QNode.prototype.put = function(content, contentLoc){
	if(this.status == 'leaf' && ! this.content){
		this.content = content;
		this.contentLoc = contentLoc;
	}
	else if(this.status == 'leaf'){
		this.expand();
		this[this.getQuad(contentLoc)].put(content, contentLoc);
	}
	else {
		this[this.getQuad(contentLoc)].put(content, contentLoc);
	}
};

QNode.prototype.expand = function(){
	var level = this.lvl + 1;
	var bp = this.breakPoint;
	
	this.status = 'root';
	this.NW = new QNode(level, [bp[0] - 0.25/level, bp[1] - 0.25/level]);
	this.NE = new QNode(level, [bp[0] + 0.25/level, bp[1] - 0.25/level]);
	this.SW = new QNode(level, [bp[0] - 0.25/level, bp[1] + 0.25/level]);
	this.SE = new QNode(level, [bp[0] + 0.25/level, bp[1] + 0.25/level]);
	this[this.getQuad(this.contentLoc)].put(this.content, this.contentLoc);
	this.content = null;
	this.contentLoc = null;
};

QNode.prototype.getQuad = function(contentLoc){
	var bp = this.breakPoint;
	var loc = (contentLoc[1] <= bp[1]) ? 'N' : 'S';
	loc += (contentLoc[0] <= bp[0]) ? 'W' : 'E';
	return loc;
};