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

QTree.prototype.findIn = function(left, top, right, bot){
	var output = [];
	var process = [this.root];
	var next = null;
	while(next = process.pop()){
		if(next.status == 'root'){ //Explore the tree to register new elements
			if(next.bpIn(left, top, right, bot)){
				next.content.map(function(c){
					process.push(c);
				});
			}
			else {
				var index = [next.getQuad([left, top]), next.getQuad([right, bot])];
				for(iii=index[0]; iii<= index[1]; iii++){
					process.push(next.content[iii]);
				}
			}
		}
		else {
			if(next.content && next.contentIn(left, top, right, bot)) output.push(next.content);
		}
	}
	
	return output;
};

QTree.prototype.deploy = function(){
	return this.root.deployContent();
};

function QNode(level, breakPoint){
	this.breakPoint = breakPoint;
	this.status = 'leaf';
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
		this.content[this.getQuad(contentLoc)].put(content, contentLoc);
	}
	else {
		this.content[this.getQuad(contentLoc)].put(content, contentLoc);
	}
};

QNode.prototype.expand = function(){
	var level = this.lvl + 1;
	var bp = this.breakPoint;
	
	this.status = 'root';
	this.content = [this.content];
	this.content.push(new QNode(level, [bp[0] - 0.25/level, bp[1] - 0.25/level]));
	this.content.push(new QNode(level, [bp[0] + 0.25/level, bp[1] - 0.25/level]));
	this.content.push(new QNode(level, [bp[0] - 0.25/level, bp[1] + 0.25/level]));
	this.content.push(new QNode(level, [bp[0] + 0.25/level, bp[1] + 0.25/level]));
	
	var cont = this.content.shift();
	this.content[this.getQuad(this.contentLoc)].put(cont, this.contentLoc);
	this.contentLoc = null;
};

QNode.prototype.getQuad = function(contentLoc){
	var bp = this.breakPoint;
	var loc = (contentLoc[1] <= bp[1]) ? 0 : 2;
	loc += (contentLoc[0] <= bp[0]) ? 0 : 1;
	return loc;
};

QNode.prototype.bpIn = function(left, top, right, bot){
	var bp = this.breakPoint;
	return bp[0] >= left && bp[0] <= right && bp[1] >= top && bp[1] <= bot; 
};

QNode.prototype.contentIn = function(left, top, right, bot){
	var bp = this.contentLoc;
	return bp[0] >= left && bp[0] <= right && bp[1] >= top && bp[1] <= bot; 
};

QNode.prototype.deployContent = function(){
	var output = [];
	var process = this.content;
	var next = null;
	while(next = process.pop()){
		if(next.status == 'root'){
			next.content.map(function(c){
				process.push(c);
			});
		}
		else {
			if(next.content) output.push(next.content);
		}
	}
	return output;
}