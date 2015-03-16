var bbox = {
	x: 0,
	y: 0,
	width: 500,
	height: 500,
};

it('Should create a tree', null, null, function(){
	var tree = new QTree(bbox);
});

it('Should return the depth (0) of the tree', 'equal', 0, function(){
	var tree = new QTree(bbox);
	return tree.depth;
});

it('Should add an object to a tree', 'equal', true, function(){
	var tree = new QTree(bbox);
	var objbox = {
		x: 12,
		y: 456,
		width: 12,
		height: 45,
	};
	
	return tree.add('trucMuche', objbox);
});

it('Should add an object to a subtree', 'equal', true, function(){
	var tree = new QTree(bbox, null, null, 1);
	var objbox1 = {
		x: Math.random()*500,
		y: Math.random()*500,
		width: Math.random()*10,
		height: Math.random()*10,
	};
	var objbox2 = {
		x: Math.random()*500,
		y: Math.random()*500,
		width: Math.random()*10,
		height: Math.random()*10,
	};
	
	tree.add('trucMuche', objbox1);
	return tree.add('frakgrak', objbox2);
});

it('Should throw an error because too many depths', null, null, function(){
	var tree = new QTree(bbox, null, 5, 2);
	
	for(iii=0; iii<2000; iii++){
		var objbox = {
			x: Math.random()*500,
			y: Math.random()*500,
			width: Math.random()*10,
			height: Math.random()*10,
		};
		tree.add('trucMuche'+iii, objbox);
	}
	console.log(tree);
});

it('Should add many objects to subtrees', null, null, function(){
	var tree = new QTree(bbox, null, null, 1);
	
	for(iii=0; iii<200; iii++){
		var objbox = {
			x: Math.random()*500,
			y: Math.random()*500,
			width: Math.random()*40,
			height: Math.random()*40,
		};
		tree.add('trucMuche'+iii, objbox);
	}
});

it('Should add many objects to subtrees and render it', null, null, function(){
	var tree = new QTree(bbox, null, 10, 1);
	
	for(iii=0; iii<2000; iii++){
		var objbox = {
			x: Math.random()*500,
			y: Math.random()*500,
			width: Math.random()*10,
			height: Math.random()*10,
		};
		tree.add('trucMuche'+iii, objbox);
	}
	console.log(tree);
});

it('Should add many objects to tree and return an array of objects in a box', null, null, function(){
	var tree = new QTree(bbox, null, null, 3);
	
	for(iii=0; iii<2000; iii++){
		var objbox = {
			x: Math.random()*500,
			y: Math.random()*500,
			width: Math.random()*1,
			height: Math.random()*1,
		};
		tree.add('trucMuche'+iii, objbox);
	}
	
	console.log(tree.find({
		x:50,
		y:150,
		width: 168,
		height: 148,
	}));
});
