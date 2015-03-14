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

it('Should get SW', 'equal', 2, function(){
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
	return tree.root.content[0].content;
});

it('Should had an object in the NE quad of the tree', 'equal', 'michel', function(){
	var tree = new QTree();
	tree.add('truc', [0.3,0.12]);
	tree.add('michel', [0.6, 0.12]);
	return tree.root.content[1].content;
});

it('Should return true', 'equal', true, function(){
	var leaf = new QNode(0, [0.2,0.6]);
	return leaf.bpIn(0.1,0.5,0.5,0.7);
});

it('Should return false', 'equal', false, function(){
	var leaf = new QNode(0, [0.31,0.6]);
	return leaf.bpIn(0.5, 0.1, 0.7, 0.3);
});

it('Should deploy two objects', 'equal', 2, function(){
	var tree = new QTree();
	tree.add('truc', [0.3,0.12]);
	tree.add('michel', [0.6, 0.12]);
	return tree.root.deployContent().length;
});

it('Should deploy three objects', 'equal', 3, function(){
	var tree = new QTree();
	tree.add('truc', [0.3, 0.12]);
	tree.add('michel', [0.6, 0.12]);
	tree.add('kawai', [0.59, 0.13]);
	tree.add('jean', [0.45, 0.5]);
	tree.add('chose', [0.35, 0.25]);
	return tree.findIn(0.4, 0.1, 0.65, 0.6).length;
});