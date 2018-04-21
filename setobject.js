

//LOOKS FOR A POINTER TO THE GIVEN NAME IN THE STATED SHADER PROGRAM
//AND SETS IT AS A VECTOR ATTRIBUTE TO BE  PASSED TO VERTEX SHADER


findbindDataPass = function(GC, data,attrib, num, type, tf)
{
	//grab a pointer to the given attribute in the stated shader program
	//
	//GC.vertexAttrib = gl.getAttribLocation(GC.shaderProgram, "test");
	//gl.enableVertexAttribArray(GC.vertexAttrib);
	
	//create the buffer that will hold the data
	GC.newBuff = gl.createBuffer();

	//set the curretn working buffer to the created buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, GC.newBuff);

	//put the dat in the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	//pass the data/buffer to the vertex shader
	//gl.vertexAttribPointer( GC.vertexAttrib,num, gl.FLOAT, false, 0,0); 
	gl.vertexAttribPointer( attrib,num, type, tf, 0,0); 
}

bindTexture2D = function(name, m, data, texNum)
{
	m.texBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, m.texBuffer);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage2d(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
				document.getElementById(name) );
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( data ), gl.STATIC_DRAW);

	gl.bindTexture(gl.TEXTURE_2D, m.texBuffer);
	gl.activeTexture( texNum );

}



