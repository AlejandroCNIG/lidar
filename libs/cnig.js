function loadPointCloudList() {
	let elScene = $("#menu_scene");
	let elObjects = elScene.next().find("#scene_objects");
	let tree = $(`<div id="jstree_scene_list"></div>`);
	elObjects.prepend(tree);

	tree.jstree({
		'plugins': ["checkbox", "state"],
		'core': {
			"dblclick_toggle": false,
			"state": {
				"checked": true
			},
			'check_callback': true,
			"expand_selected_onload": true
		},
		"checkbox": {
			"keep_selected_style": true,
			"three_state": false,
			"whole_node": false,
			"tie_selection": false,
		},
	});

	let pclID = tree.jstree('create_node', "#", { "text": "<b>Point Clouds List</b>", "id": "pointcloudslist" }, "first", false, false);

	let pclData = JSON.parse(pclDataJson);

	pclData.forEach(function(pc) {
		let sourcePointCloud = new SourcePointCloud(pc.path, pc.name);
		let nodeID = tree.jstree('create_node', pclID, {
			"text": pc.name,
			"data": sourcePointCloud
		},
			"first", false, false);
	});
	
	tree.jstree(true).open_node('pointcloudslist');


	tree.on("check_node.jstree", function(e, data) {


		if (data.node.parent == "#") {
			// var pcListId = data.node.children;
			// checkAllNodesById(pcListId)
		} else {
			let pc = data.node.data;
			if (pc) {
				loadPointCloudFromList(pc);
				tree.jstree("delete_node", data.node.id);
			}

			if (tree[0].childNodes[0].childNodes[0].childNodes.length == 2) {
				tree.jstree("delete_node", data.node.parent);
			}
		}

	});

}

function checkAllNodesById(list) {
	var listId = list;
	for (children of listId) {
		tree.jstree("check_node", children);
	}
}


function loadPointCloudFromList(pc) {
	Potree.loadPointCloud(pc.path, pc.name, e => {
		let pointcloud = e.pointcloud;
		let material = pointcloud.material;
		viewer.scene.addPointCloud(pointcloud);
		material.pointColorType = Potree.PointColorType.ELEVATION; // any
																	// Potree.Po$
		material.size = 1;
		material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
		material.shape = Potree.PointShape.SQUARE;
		viewer.fitToScreen();
	});
}

function setCnigGui(){
	//$('#jstree_scene_list').jstree(true).open_node('pointcloudslist');
}

class SourcePointCloud {

	constructor(path, name) {
		this.path = path;
		this.name = name;
	}
}


