it('Should create a tree', null, null, function(){
	var tree = new QTree(0,0,500,500);
});

it('Should return the depth (0) of the tree', 'equal', 0, function(){
	var tree = new QTree(0,0,500,500);
	return tree.depth;
});

it('Should add an object to a tree', 'equal', true, function(){
	var tree = new QTree(0,0,500,500);	
	return tree.add('trucMuche', 12, 456);
});

it('Should add an object to a subtree', 'equal', true, function(){
	var tree = new QTree(0,0,500,500);
	
	tree.add('trucMuche', 12,456);
	return tree.add('frakgrak', 78,65);
});

it('Should throw an error because too many depths', null, null, function(){
	var tree = new QTree(0,0,500,500, 2);
	
	for(iii=0; iii<2000; iii++){
		var x = Math.random()*500,
			 y = Math.random()*500;
			 
		tree.add('trucMuche'+iii, x, y);
	}
	console.log(tree);
});

it('Should add many objects to subtrees', null, null, function(){
	var tree = new QTree(0,0,500,500);
	
	for(iii=0; iii<2000; iii++){
		var x = Math.random()*500,
			 y = Math.random()*500;
			 
		tree.add('trucMuche'+iii, x, y);
	}
	console.log(tree);
});

it('Should add many objects to tree and return an array of objects in a box', null, null, function(){
	var tree = new QTree(0,0,500,500);
	
	for(iii=0; iii<200; iii++){
		var x = Math.random()*500,
			 y = Math.random()*500;
			 
		tree.add('trucMuche'+iii, x, y);
	}
	
	console.log(tree);
	console.log(tree.find(50,50,450,450));
});

it('Should add many objects to tree and visit it', null, null, function(){
	var tree = new QTree(0,0,500,500);
	
	for(iii=0; iii<50; iii++){
		var x = Math.random()*500,
			 y = Math.random()*500;
			 
		tree.add('trucMuche'+iii, x, y);
	}
	
	tree.visit(function(x1, y1, x2, y2, obj, x, y){
		if(obj) console.log(obj+'  '+x+'  '+y);
		return (x1 > y1 && x2>y2);
	});
});