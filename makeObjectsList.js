
//turns vec1 and vec2 into one big vec with vec1 followed by vec2 
makeList = function(vec1, vec2, indices1, indices2)
{
	var vec = [];

	indices1.forEach(function(d,i)
	{
		x =  (parseFloat(vec1[d*3]));
		y =  (parseFloat(vec1[d*3] + 1));
		z =  (parseFloat(vec1[d*3] + 2));

		vec.push(x,y,z);
	});

	indices2.forEach(function(d,i)
	{
		x =  (parseFloat(vec2[d*3]));
		y =  (parseFloat(vec2[d*3] + 1));
		z =  (parseFloat(vec2[d*3] + 2));

		vec.push(x,y,z);
	});

	return vec;
}


//Adds vec2 to the end of the given vector1

addToList = function(vec1, vec2, indices2)
{

	indices2.forEach(function(d,i)
	{
		x =  (parseFloat(vec2[d*3]));
		y =  (parseFloat(vec2[d*3] + 1));
		z =  (parseFloat(vec2[d*3] + 2));

		vec1.push(x,y,z);
	});

	return vec1;
}


//Adds vec2 to the end of the given vector1

addToListB = function(vec1, vec2, size)
{

	for(var i = 0; i < size; i++ )
	{

		u = vec2[i*2];
		v = vec2[i*2 + 1];

		vec1.push(u,v);
	}

	return vec1;
}



//creates a 3d copy of the given vector

createList4 = function(vec1, indices)
{
	var rvec = [];


	indices.forEach(function(d,i)
	{
		x =  (parseFloat(vec1[d*3]));
		y =  (parseFloat(vec1[d*3] + 1));
		z =  (parseFloat(vec1[d*3] + 2));

		rvec.push(x,y,z);
	});

	return rvec;
}


//creates a 2d copy of the given vector
createList2 = function(vec1, indices)
{
	var rvec = [];


	indices.forEach(function(d,i)
	{
		x =  (parseFloat(vec1[d*3]));
		y =  (parseFloat(vec1[d*3] + 1));

		rvec.push(x,y);
	});

	return rvec;
}

setUpTex = function(m, name, texPos)
{
	m.texBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, m.texBuffer);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( name ) );

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( texPos ), gl.STATIC_DRAW);

	gl.activeTexture( gl.TEXTURE0);
}

setvertAttrib = function(buffer, attrib, data, num)
{
	//set current buffer to given, then load given 
	//data into buffer
	//gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	//load data into attribute in shader
	gl.vertexAttribPointer(attrib, num, gl.FLOAT, false, 0, 0);

}

getMin = function( vert )
{
	min = [-90000, -90000, -90000];

	for( var i = 0; i < vert.length ; i +=3)
	{
		vx = vert[i*3];
		vy = vert[i*3+1];
		vz = vert[i*3+2];

		if(vx < min[0]) min[0] = vx;
		if(vy < min[1]) min[1] = vy;
		if(vz < min[2]) min[2] = vz;
	}

	return min;
}



getMax = function( vert )
{
	max = [90000, 90000, 90000];

	for( var i = 0; i < vert.length ; i +=3)
	{
		vx = vert[i*3];
		vy = vert[i*3+1];
		vz = vert[i*3+2];

		if(vx > max[0]) max[0] = vx;
		if(vy > max[1]) max[1] = vy;
		if(vz > max[2]) max[2] = vz;
	}

	return max;
}

