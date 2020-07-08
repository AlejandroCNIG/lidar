Potree.VectorLoader = {};

Potree.VectorLoader.GeoJSON = function(url, params, scene) {

	$.ajax({
		url : url,
		dataType : 'json',
		success : function(geojson) {

			var pointMaterial, lineMaterial, polyMaterial;
			if (params.pointMaterial) {
				pointMaterial = params.pointMaterial;
			} else {
				pointMaterial = new THREE.PointsMaterial({
					size : 3,
					color : 0Xff0000,
					sizeAttenuation : false
				});
			}

			if (params.lineMaterial) {
				lineMaterial = params.lineMaterial;
			} else {
				lineMaterial = new THREE.LineBasicMaterial({
					color : 0x00ffff,
					linewidth : 5
				});
			}

			for (var i = 0; i < geojson.features.length; i++) {

				var coord = geojson.features[i].geometry.coordinates;
				var geotype = geojson.features[i].geometry.type;

				if (geotype.toLowerCase() == 'point') {
					var pointGeometry = new THREE.Geometry();
					pointGeometry.vertices.push(new THREE.Vector3(coord[0],
							coord[1], coord[2]));
					var point = new THREE.PointCloud(pointGeometry,
							pointMaterial);
					scene.add(point);
				} else if (geotype.toLowerCase() == 'linestring') {

					var lineGeometry = new THREE.Geometry();
					for (var j = 0; j < coord.length; j++) {
						lineGeometry.vertices.push(new THREE.Vector3(
								coord[j][0], coord[j][1], coord[j][2]));
					}

					var line = new THREE.Line(lineGeometry, lineMaterial);
					scene.add(line);
				} else if (geotype.toLowerCase() == 'polygon') {

					var lineGeometry = new THREE.Geometry();
					for (var j = 0; j < coord.length; j++) {
						lineGeometry.vertices.push(new THREE.Vector3(
								coord[j][0], coord[j][1], coord[j][2]));
					}

					var line = new THREE.Line(lineGeometry, lineMaterial);
					scene.add(line);
				} else {
					console.log(geojson.features[i].geometry.type
							+ 'Geometry type not (yet) supported');
				}
			}
		},
		error : function(req, status, err) {
			console.log('Potree: error loading geojson', status, err);
		}
	});

}