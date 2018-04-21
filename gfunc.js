
Prntr = function(strg)
{
	console.log(strg);
}


UpdateRotation = function(mesh)
{
	var currentTime = Date.now();

	if (mesh.lastRotationTime) {
		var delta = currentTime - mesh.lastRotationTime;

		if( (mesh.angle + (30 * delta)/1000.0) > 360.0) mesh.angle = 0.0;
		else mesh.angle += (30 * delta) / 1000.0;
	}

	mesh.lastRotationTime = currentTime;
}


function getMinMaxC(mesh)
{
	var m = mesh.model;
	var min = [90000,90000,90000];    //used for bounding box calculations
	var max = [-90000,-90000,-90000]; //used for bounding box calculations

	m.indices.forEach(function(d,i){
			vx = (parseFloat(m.vertices[d*3]));
			vy = (parseFloat(m.vertices[d*3+1]));
			vz = (parseFloat(m.vertices[d*3+2]));

			if(vx < min[0]) min[0] = vx;
			if(vy < min[1]) min[1] = vy;
			if(vz < min[2]) min[2] = vz;
			if(vx > max[0]) max[0] = vx;
			if(vy > max[1]) max[1] = vy;
			if(vz > max[2]) max[2] = vz;

			});


	m.minX = min[0]; m.minY = min[1]; m.minZ = min[2];
	m.maxX = max[0]; m.maxY = max[1]; m.maxZ = max[2];

	var s = Math.max( Math.abs(min[0]-max[0]),
			Math.abs(min[1]-max[1]),
			Math.abs(min[2]-max[2]))

		var d = (s/2.0)/Math.tan(45/2.0);


	var cx = (min[0] + max[0])/2;
	var cy = (min[1] + max[1])/2;
	var cz = (min[2] + max[2])/2;

	var cent = [cx, cy, cz];

	m.camdist = d;
	m.centroid= cent;
	m.min = min;
	m.max = max;

	return m;

}


function getMeshNormals(mesh)
{
	var m = mesh.model;

	var n = [];

	for( var i = 0; i < m.indices.length ; i += 3)
	{

		var i1 = m.indices[i+0];
		var i2 = m.indices[i+1];
		var i3 = m.indices[i+2];

		var rv = CalcNorm( i1,i2,i3,m.vertices);
		var l = Vector3fLength(rv);

		rv[0] = rv[0];
		rv[1] = rv[1];
		rv[2] = rv[2];

		m.norml[ i1*3+0 ] += rv[0];
		m.norml[ i1*3+1 ] += rv[1];
		m.norml[ i1*3+2 ] += rv[2];

		m.norml[ i2*3+0 ] += rv[0];
		m.norml[ i2*3+1 ] += rv[1];
		m.norml[ i2*3+2 ] += rv[2];

		m.norml[ i3*3+0 ] += rv[0];
		m.norml[ i3*3+1 ] += rv[1];
		m.norml[ i3*3+2 ] += rv[2];
	}

	return m;
}








function SetUpMesh(mesh)
{
	var m = mesh.model;

	var verts = getverts(m.vertices, m.indices);
	var nrms = getverts(m.norml, m.indices);
	var texPos2 = gettex(m2.texPos, m2.indices);
	var length = m.indices.length;

	m.VS = verts;
	m.NS = nrms;
	m.TP = texPos2;
	m.length = length;

	return m;

}



DrawWprogram = function(GC, shaderProgram, mesh , dArray, attrAry, arttrNum)
{
	gl.useProgram(shaderProgram);

	var m = mesh.model;

	var hasTex = mesh.hasTex;

	var verts = [];
	var nrms = [];
	var texpos2 = [];
	var length = m.indices.length;

	verts = m.VS;
	nrms = m.NS;;
	texPos2 = m.TP;;
	length =  m.length;;

	var dataArray = [verts, nrms, texPos2, length];

	var i = 0; 

	for(i = 0; i < dataArray.length; i++)
	{
		setvertAttrib(gl.createBuffer(), attrAry[i], dataArray[i],attrNum[i],shaderProgram); 
	}

	if(m.hasCubeTex)
	{
		 var cubeside = ['right','left','top','bottom','front','back'];
		 //setUpTex(m, 'fskull', texPos2);
		 setUpCubeTex(m, cubeside, verts, 1);
	}

	if(m.hasTex)
	{
		setUpTex(m, m.texName, m.TP);
	}

	if(m.hasFB)
	{
		gl.activeTexture(gl.TEXTURE0 + 0);
		gl.bindTexture(gl.TEXTURE_2D, GC.framebuffer.texture);
	}
 

	if(mesh.needsPush) 
	{
		mvPushMatrix(GC);

		mvRotate(mesh.angle1, mesh.RV, GC);
		mvTranslate(mesh.TV,GC);
	}
	
	//setMatrixUniforms(GC);
	setMatrixUniforms(GC, shaderProgram);
	gl.drawArrays(gl.TRIANGLES,0,length);
	
	if(mesh.needsPush) mvPushMatrix(GC);

}












drawToFrameBuffer = function(GC, framebuffer){
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var m = GC.mesh.model;

	GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");

	GC.perspectiveMatrix = makePerspective(45, GC.width/GC.height, 0.1, Math.max(2000.0,m.maxZ));
	var lookAtMatrix = makeLookAt(camera.position[0],camera.position[1],camera.position[2],
			camera.lookAt[0],camera.lookAt[1],camera.lookAt[2],
			0,1,0);
	GC.mIVMatrix =(lookAtMatrix.inv() );
	GC.mIVMatrix.inv( lookAtMatrix);;

	mvLoadIdentity(GC);

	mvMultMatrix(lookAtMatrix,GC);

	mvTranslate([(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0],GC);

	mvMultMatrix(camera.Transform,GC);//multiply by the transformation

	mvTranslate([-(m.minX+m.maxX)/2.0,-(m.minY+m.maxY)/2.0,-(m.minZ+m.maxZ)/2.0],GC);


	gl.uniform3fv( GC.shaderProgram.picker, [0.0,2.0, 0.0]);

	var verts = [];
	var nrms = [];
	var texpos2 = [];
	var length = m.indices.length;


	verts = GC.mesh.model.VS;
	nrms = GC.mesh.model.NS;;
	texPos2 = GC.mesh.model.TP;;
	length = GC.mesh.model.length;;


	setvertAttrib(m.vertexBuffer,"vPos", verts, 3, GC.shaderProgram);
	setvertAttrib(GC.barycentricBuffer,"bary", nrms, 3, GC.shaderProgram);
	setvertAttrib(m.normlBuffer, "normals", nrms, 3, GC.shaderProgram);
	setvertAttrib(m.texbuff, "texPos", texPos2, 2, GC.shaderProgram);

	var cubeside = ['right','left','top','bottom','front','back'];

	setUpCubeTex(m, cubeside, verts, 1);

	setMatrixUniforms(GC);
	gl.drawArrays(gl.TRIANGLES,0,length);







	//draw sphere
	/*
	gl.uniform3fv( GC.shaderProgram.picker, [1.0,1.0, 1.0]);

	var m2 = GC.mesh2.model;


	verts = GC.mesh2.model.VS;
	nrms = GC.mesh2.model.NS;;
	texPos2 = GC.mesh2.model.TP;;
	length = GC.mesh2.model.length;;

	setvertAttrib(m.vertexBuffer,"vPos", verts, 3, GC.shaderProgram);
	setvertAttrib(GC.barycentricBuffer,"bary", nrms, 3, GC.shaderProgram);
	setvertAttrib(m.normlBuffer, "normals", nrms, 3, GC.shaderProgram);
	setvertAttrib(m.texbuff, "texPos", texPos2, 2, GC.shaderProgram);

	mvPushMatrix(0,GC) ;

	var v1 = [0.0,0.0,-0.0];

	mvTranslate(v1,GC);

	setMatrixUniforms(GC);
	gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);

	gl.uniform3fv( GC.shaderProgram.picker, [2.0,1.0, 1.0]);



	verts = GC.drawArray3[0];
	nrms = GC.drawArray3[1];
	texPos2 = GC.drawArray3[2];
	length = GC.drawArray3[3];

	setvertAttrib(m.vertexBuffer, GC.vertexPositionAttribute, verts, 3);
	setvertAttrib(GC.barycentricBuffer, GC.barycentricAttribute, nrms, 3);
	setvertAttrib(m.normlBuffer, GC.normlAttribute, nrms, 3);
	setvertAttrib(m.texbuff, GC.texAttribute, texPos2, 2);


	mvPushMatrix(0,GC) ;

	var v = [1.5, 0.0, -0.0];
	var VR = [0.0, 1.0, 0.0];


	mvRotate(GC.angle1, VR, GC);
	mvTranslate(v,GC);

	setMatrixUniforms(GC);
	gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);

	var currentTime = Date.now();

	if (GC.lastRotationTime) {
		var delta = currentTime - GC.lastRotationTime;

		if( (GC.angle1 + (30 * delta)/1000.0) > 360.0) GC.angle1 = 0.0;
		else GC.angle1 += (30 * delta) / 1000.0;
	}

	GC.lastRotationTime = currentTime;
	*/
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}














sphere2 = function( rad,GC )
{

	var vert = [];
	var indces = [];
	var nrm = [];
	var tex = [];
	var pi = Math.PI;

	var latitudeBands = 30;
	var longitudeBands = 30;
	var radius = rad;


	var cnt = 0;

	for(latNum = 0; latNum  <= latitudeBands; latNum++)
	{
		var theta = latNum*pi/latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for( var longNum = 0; longNum <= longitudeBands; longNum++)
		{
			var phi = longNum*2*pi/longitudeBands;
			var sinphi = Math.sin(phi);
			var cosphi = Math.cos(phi);

			var x = cosphi*sinTheta;
			var y = cosTheta;
			var z = sinphi*sinTheta;

			var u = 1 - (longNum/longitudeBands);
			var v = 1 - (latNum/latitudeBands);




			nrm.push(x);
			nrm.push(y);
			nrm.push(z);

			tex.push(u);
			tex.push(v);


			vert.push(radius*x);
			vert.push(radius*y);
			vert.push(radius*z);
		}

	}
	for(var latNum = 0; latNum  < latitudeBands; latNum++)
	{
		for( var longNum = 0; longNum < longitudeBands; longNum++)
		{

			var first = (latNum*(longitudeBands+1)) + longNum;
			var second = first + longitudeBands + 1;
			indces.push(first);
			indces.push(second);
			indces.push(first + 1);

			indces.push(second);
			indces.push(second + 1);
			indces.push(first + 1);
		}

	}

	GC.verticesB = vert;
	GC.indicesB = indces;
	GC.normalsB = nrm;
	GC.texPosB = tex;
}

