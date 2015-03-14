it('Should create a tree', null, null, function(){
	var tree = new QTree();
});

it('Should have a single leaf', 'equal', 'leaf', function(){
	var tree = new QTree();
	return tree.root.status;
});

it('Should have a single leaf with lvl 0', 'equal', '0', function(){
	var tree = new QTree();
	return tree.root.lvl;
});

it('Should have a single leaf with breakPoint of [0.5,0.5]', 'equal', 0.5, function(){
	var tree = new QTree();
	return tree.root.breakPoint[0];
});

it('Should get SW', 'equal', 'SW', function(){
	var leaf = new QNode(0, [0.5,0.5]);
	return leaf.getQuad([0.1, 0.75]);
});

it('Should had an object in the root of the tree', 'equal', 'truc', function(){
	var tree = new QTree();
	tree.add('truc', [0.3,0.12]);
	return tree.root.content;
});

it('Should had an object in the NW quad of the tree', 'equal', 'truc', function(){
	var tree = new QTree();
	tree.add('truc', [0.3,0.12]);
	tree.add('michel', [0.6, 0.12]);
	return tree.root.NW.content;
});

it('Should had an object in the NE quad of the tree', 'equal', 'michel', function(){
	var tree = new QTree();
	tree.add('truc', [0.3,0.12]);
	tree.add('michel', [0.6, 0.12]);
	console.log(tree);
	return tree.root.NE.content;
});