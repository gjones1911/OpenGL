var gl = null; //our OpenGL handler

var GC = {};   //the graphics context

//initialize the graphics context variables
GC.shaderProgram = null;          //our GLSL program
GC.shaderProgram2 = null;          //our GLSL program
GC.shaderProgram3 = null;          //our GLSL program
GC.shaderProgramSp = null;          //our GLSL program
GC.shaderProgramM = null;          //our GLSL program
GC.shaderProgramS = []

GC.vertexPositionAttribute = null;//location of vertex positions in GLSL program
GC.barycentricBuffer = null;      //array passed to shader to create wireframe display
GC.barycentricAttribute = null;   //location of barycentric coordinate array in GLSL program
GC.normlAttribute;                  //render area height
GC.AttribLocations = [];

GC.perspectiveMatrix = null;      //the Perspective matrix
GC.mvMatrix = null;               //the ModelView matrix
GC.mIVMatrix = null;            //the ModelView matrix stack
GC.mvMatrixStack = [];            //the ModelView matrix stack

GC.mesh = null;                   //the current mesh
GC.Hmesh = null;                   //the current mesh
GC.mesh2 = null;                   //the current mesh
GC.mesh3 = null;                   //the current mesh
GC.mouseDown = null;              //boolean check for mouseDown
GC.width = 640;                   //render area width
GC.height = 480;                  //render area height
GC.widthoff = 256;                   //render area width
GC.heightoff = 256;                  //render area height
GC.white;                  //render area height
GC.verticesC = [];
GC.indicesC= [];
GC.normalsC = [];
GC.texPosC = [];
GC.verticesB = [];
GC.indicesB = [];
GC.normalsB = [];
GC.texPosB = [];
GC.texPosA = [];
GC.verticesA = [];
GC.indicesA = [];
GC.normalsA = [];
GC.lastRotationTime;
GC.MeshArray = [];

GC.color1 = [1.0, 0.0, 0.0];
GC.color2 = [.78, .244, .9147];
GC.color3 = [];
GC.drawArray = [];
GC.drawArray2 = [];
GC.drawArray3 = [];

GC.lightColor = [1.0, 1.0, 1.0];


GC.lightColorR = [1.0, 0.0, 0.0];
GC.lightColorG = [0.0, 1.0, 0.0];
GC.lightColorB = [0.0, 0.0, 1.0];


GC.light1 = [4.5, -1.5, -1.8];
GC.lightLocation1;


GC.light2 = [-4.5, -1.5, -1.8];
GC.lightLocation2;

GC.data;
GC.angle1 = 0.0;;
GC.angle2 = 0.0;

GC.frameBuffer;
//GC.mesh3.drawArray = [];

GC.programCount = 0.0;

GC.lightWorldPosition = [];
GC.CameraPosition = [];

GC.AttribArray = ["vPos","bary","normals","texPos"];
GC.attribNum = [3, 3, 3, 2];
//GC.lightposAttribute;                  //render area height


Prntr("What up Yo!!!");


var camera = new ArcBall();              //create a new arcball camera
camera.setBounds(GC.width,GC.height);    //initialize camera with screen space dimensions


//demo constructor
function demo(canvasName,MeshArray) {
//function demo(canvasName,Mesh, Mesh2) {
    this.canvasName = canvasName;
    GC.mesh = MeshArray[0];
    GC.mesh3 = MeshArray[1];
    GC.MeshArray = MeshArray;;
	GC.mesh2 =  {model: new modelLoader.sphere(.25)};
}

//initialize webgl, populate all buffers, load shader programs, and start drawing
demo.prototype.init = function(){
    this.canvas = document.getElementById(this.canvasName);
    this.canvas.width = GC.width;
    this.canvas.height = GC.height;

    //Here we check to see if WebGL is supported 
    this.initWebGL(this.canvas);



  //  gl.clearColor(GC.white);     //background to black
    gl.clearColor(0.1,0.1,0.3,1.0);     //background to black
    gl.clearDepth(1.0);                 //set depth to yon plane
	gl.enable(gl.DEPTH_TEST);           //enable depth test
    gl.depthFunc(gl.LEQUAL);            //change depth test to use LEQUAL
    //gl.depthFunc(gl.GREATER);            //change depth test to use LEQUAL
    //gl.depthFunc(gl.LESS);            //change depth test to use LEQUAL
   // gl.depthFunc(gl.ALWAYS);            //change depth test to use LEQUAL

    //set mouse event callbacks
    this.setMouseEventCallbacks();

    //set keyboard event callbacks
    this.setKeyboardEventCallbacks();

    //Get opengl derivative extension -- enables using fwidth in shader
    gl.getExtension("OES_standard_derivatives");
    
    //init the shader programs
    this.initShaders();

    //init the vertex buffer
    this.initGeometryBuffers();

	initFrameBuffer();

	this.setEmUp();
}

function animate()
{
	drawScene();

	requestAnimationFrame(animate);
}


var lasttime = Date.now();

demo.prototype.MainLoop = function(){
	//while(1)
	//{
		//if( (Date.now() - lasttime) > 5000)
		//{   lasttime = Date.now();
			//drawScene();
			
			animate();
	//	}	
	//}
}

function initFrameBuffer()
{
	var framebuffer, texture, depthBuffer;


	var error = function()
	{
		if(framebuffer) gl.deleteFramebuffer(framebuffer);
		if(texture) gl.deleteTexture(texture);
		if(depthBuffer) gl.deleteRenderbuffer(depthBuffer);
		return null;
	}


	framebuffer = gl.createFramebuffer();

	if(!framebuffer) 
	{
		console.log("problem with FB");
		return error();
	}
	

	texture = gl.createTexture();

	if(!texture)
	{
		console.log("problem with texture");
		return error();
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GC.widthoff, GC.heightoff, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	framebuffer.texture = texture;

	depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
	if (!depthBuffer) {
		console.log('Failed to create renderbuffer object');
		return error();
	}
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer); // Bind the object to target
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, GC.widthoff, GC.heightoff);


	//put the texture and the render buffer with the framebuffer
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

	var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	
	if (gl.FRAMEBUFFER_COMPLETE !== e) 
	{
		console.log('Frame buffer object is incomplete: ' + e.toString());
				         return error();
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	
	GC.frameBuffer = framebuffer;

}


demo.prototype.setMouseEventCallbacks = function(){
    //-------- set callback functions
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmousewheel = this.mouseWheel;

        //--Why set these to callbacks for the document object?
    document.onmouseup = this.mouseUp;          
    document.onmousemove = this.mouseMove;
    
        //--touch event callbacks
    this.canvas.ontouchstart = this.touchDown;
    this.canvas.ontouchend = this.touchUp;
    this.canvas.ontouchmove = this.touchMove;
    //-------- end set callback functions
}

demo.prototype.setKeyboardEventCallbacks = function(){
        //--Why set these to callbacks for the document object?
    document.onkeydown = this.keyDown;          
}

loadvertUniforms3f = function(uniformArry, shaderProgram, dataVec)
{
	for( var i = 0; i < uniformArry.length; i++)
	{
		uniformVert3f = gl.getUniformLocation(shaderProgram, uniformArry[i]);
		gl.uniform3fv( uniformVert3f, [dataVec[0], dataVec[1], dataVec[2]]);
	}
}

loadvertUniforms4f = function(uniformArry, shaderProgram, dataVec)
{
	for( var i = 0; i < uniformArry.length; i++)
	{
		uniformVert4f = gl.getUniformLocation(shaderProgram, uniformArry[i]);
		gl.uniform3fv( uniformVert3f, [dataVec[0], dataVec[1], dataVec[2]]);
	}
}
loadUniforms1f = function(uniform, num, shaderProgram)
{

	uniformf = gl.getUniformLocation(shaderProgram, uniform);
	gl.uniformf( uniformf, num);
}


loadAttribs = function(attribArry)
{
	var attribLocations = [];

	for( var i = 0; i < attribArry.length; i++)
	{
		attribLocations[i] = grabVertAttrib( attribArry[i] );
	}

	return attribLocations;
}


grabVertAttrib = function(shaderProgram, attrib_name)
{
	var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, attrib_name);
	gl.enableVertexAttribArray(vertexPositionAttribute);
	return vertexPositionAttribute;
}

//will create suplemental shader programs
demo.prototype.MakeProgram = function(Fragname, Vertname)
{
	var fragmentShader = this.getShader(Fragname);
	var vertexShader = this.getShader(Vertname);

//var fragmentShader = this.getShader("FragmentShader1");
//    var vertexShader = this.getShader("Gshader");


	var shaderprogram = gl.createProgram();
	gl.attachShader(shaderprogram, vertexShader);
	gl.attachShader(shaderprogram, fragmentShader);

	gl.linkProgram(shaderprogram);
	
	if(!gl.getProgramParameter(shaderprogram, gl.LINK_STATUS)){
		console.log("unable to init shader program");
	}
	
	return shaderprogram;
}

setUpProgram = function(AtrbAry, Frag, Vert  )
{
	GC.AttribLocations = loadAttribs(AtrbAry);
	GC.shaderProgramS[GC.programCount] = makeShaderProgram( Frag, Vert );
	GC.programCount += 1;
}


//initialize the shaders and grab the shader variable attributes for 
//base object
demo.prototype.initShaders = function(){
/*
    //Load the shaders
    var fragmentShader = this.getShader("FragmentShader1");
    var vertexShader = this.getShader("Gshader");
    //var vertexShader = this.getShader("VertexShader2");
    //var fragmentShader = this.getShader("ExtraFragShader1");
    //var vertexShader = this.getShader("ExtraVertexShader1");

    this.shaderProgram = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)){
        console.log("unable to init shader program");
    }
*/

	this.shaderProgram = this.MakeProgram("FragmentShader1", "Gshader");
    gl.useProgram(this.shaderProgram);

    //GC.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vPos2d");
    //GC.vertexPositionAttribute = grabVertAttrib(this.shaderProgram, "vPos");
    GC.vertexPositionAttribute = grabVertAttrib(this.shaderProgram, GC.AttribArray[0]);
    //GC.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vPos");
    //gl.enableVertexAttribArray(GC.vertexPositionAttribute);

	

    GC.barycentricAttribute = gl.getAttribLocation(this.shaderProgram, "bary");
    gl.enableVertexAttribArray(GC.barycentricAttribute);

    GC.normlAttribute = gl.getAttribLocation(this.shaderProgram, "normals");
	gl.enableVertexAttribArray(GC.normlAttribute);


    GC.texAttribute = gl.getAttribLocation(this.shaderProgram, "texPos");
	gl.enableVertexAttribArray(GC.texAttribute);


	GC.lightLocation1 = gl.getUniformLocation(this.shaderProgram, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array( GC.light1 ) );
    
	GC.lightLocation2 = gl.getUniformLocation(this.shaderProgram, "light2");
	gl.uniform3fv( GC.lightLocation2, new Float32Array( GC.light2 ) );

	GC.shaderProgram = this.shaderProgram;

/*
	setvertAttrib(gl.createBuffer(), "vPos", verts, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "bary", nrms, 3,  GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram);
*/
/*
    var fragmentShader = this.getShader("FragmentShader2");
    var vertexShader = this.getShader("Gshader2");



    this.shaderProgram2 = gl.createProgram();
    gl.attachShader(this.shaderProgram, vertexShader);
    gl.attachShader(this.shaderProgram, fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)){
        console.log("unable to init shader program");
    }
*/

	this.shaderProgram2 = this.MakeProgram("FragmentShader2", "Gshader2");
    //gl.useProgram(this.shaderProgram);
	gl.useProgram(this.shaderProgram2);

	GC.lightLocation1 = gl.getUniformLocation(this.shaderProgram2, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array( GC.light1 ) );

	GC.lightLocation2 = gl.getUniformLocation(this.shaderProgram2, "light2");
	gl.uniform3fv( GC.lightLocation2, new Float32Array( GC.light2 ) );


	this.shaderProgram3 = this.MakeProgram("TexFragmentShader","TVshader2");


    gl.useProgram(this.shaderProgram3);
	GC.lightLocation1 = gl.getUniformLocation(this.shaderProgram3, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array( GC.light1 ) );

	GC.lightLocation2 = gl.getUniformLocation(this.shaderProgram3, "light2");
	gl.uniform3fv( GC.lightLocation2, new Float32Array( GC.light2 ) );



	GC.shaderProgram = this.shaderProgram;
	GC.shaderProgram2 = this.shaderProgram2;
	GC.shaderProgram3 = this.shaderProgram3;
	GC.shaderProgramS[0] = this.shaderProgram;

    gl.useProgram(GC.shaderProgram);
}

var cnt = 0;


//will create the vector array,  normal array, indices array
//and the texture array of a sphere. It takes as a parameter
//the disired radius of the sphere
sphere = function( rad)
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

demo.prototype.initGeomP = function(mesh)
{
	var m = mesh.model;


}


//initialize the buffers for drawing and the edge highlights
//for the base objects
demo.prototype.initGeometryBuffers = function(){
	var m = GC.mesh.model;


	//create an OpenGL buffer
  GC.barycentricBuffer = gl.createBuffer();
  
  var verts = [];                   //array to hold vertices laid out according to indices
  var nrms = [];                   //array to hold vertices laid out according to indices
  var bary = [];                    //array of 1s and 0s passed to GLSL to draw wireframe
  var min = [90000,90000,90000];    //used for bounding box calculations
  var max = [-90000,-90000,-90000]; //used for bounding box calculations

  //texture positions of full cube
  var texPos =
	  [
	  
	  //front
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,

      //top
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,

      //back
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,

      //bottom
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,

      //right
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,

      //left
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0
	];

	
   //texture positions of cube with no face
	var texPos2 = 
	[
			
      //right
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,
	
	
      //top
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,
	
      //back
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,


      //bottom
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0,

      //left
	  0.0, 1.0,
	  1.0, 1.0,
	  0.0, 0.0,

	  0.0, 0.0,
	  1.0, 1.0,
	  1.0, 0.0

	];
	
	//GC.texPosA = texPos2;
	GC.texPosA = texPos;
	GC.mesh.model.texP = texPos;
	
	
	// Loop through the indices array and create a vertices array (this means
    //     duplicating data) from the listed indices
    m.indices.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
        vx = (parseFloat(m.vertices[d*3]));
        vy = (parseFloat(m.vertices[d*3+1]));
        vz = (parseFloat(m.vertices[d*3+2]));

        nx = (parseFloat(m.norml[d*3]));
        ny = (parseFloat(m.norml[d*3+1]));
        nz = (parseFloat(m.norml[d*3+2]));
        
		//add this vertex to our array
        verts.push(vx,vy,vz);
		nrms.push( nx,ny,nz);


        //check to see if we need to update the min/max
        if(vx < min[0]) min[0] = vx;
        if(vy < min[1]) min[1] = vy;
        if(vz < min[2]) min[2] = vz;
        if(vx > max[0]) max[0] = vx;
        if(vy > max[1]) max[1] = vy;
        if(vz > max[2]) max[2] = vz;

        //What does this do?
        if(i%3 == 0){
            bary.push(1,0,0);
        } else if(i % 3 == 1){
            bary.push(0,1,0);
        } else if(i % 3 == 2){
            bary.push(0,0,1);
        }
    });

    //set the min/max variables
  m.minX = min[0]; m.minY = min[1]; m.minZ = min[2];
  m.maxX = max[0]; m.maxY = max[1]; m.maxZ = max[2];

  //calculate the largest range in x,y,z
  var s = Math.max( Math.abs(min[0]-max[0]),
                    Math.abs(min[1]-max[1]),
                    Math.abs(min[2]-max[2]))
  
  //calculate the distance to place camera from model
  var d = (s/2.0)/Math.tan(45/2.0);

  //place the camera at the calculated position
  camera.position[2] = d+.9;


  var cx = (m.minX+m.maxX)/2.0;
  var cy = (m.minY+m.maxY)/2.0;
  var cz = d;
	
  GC.lightWorldPosition = [cx, cy, cz-0.5];
  GC.CameraPosition = [cx, cy, cz];

  
  gl.useProgram(GC.shaderProgram);

  
  GC.shaderProgram.min = gl.getUniformLocation(GC.shaderProgram, "Umin");
  gl.uniform3fv( GC.shaderProgram.min, min);

  GC.shaderProgram.max = gl.getUniformLocation(GC.shaderProgram, "Umax");
  gl.uniform3fv( GC.shaderProgram.max, max);

  GC.shaderProgram.lightWorldPos = gl.getUniformLocation(GC.shaderProgram, "lWP");
  gl.uniform3fv( GC.shaderProgram.lightWorldPos, [cx,cy, cz-0.5]);

  GC.shaderProgram.campos = gl.getUniformLocation(GC.shaderProgram, "camPos");
  gl.uniform3fv( GC.shaderProgram.campos, [cx,cy, cz]);

  GC.shaderProgram.color3 = gl.getUniformLocation(GC.shaderProgram, "color3");
  gl.uniform3fv( GC.shaderProgram.campos, [.5, .6, .2]);

	
	
	gl.useProgram(GC.shaderProgram2);


	 GC.shaderProgram2.min = gl.getUniformLocation(GC.shaderProgram2, "Umin");
	 gl.uniform3fv( GC.shaderProgram2.min, min);

	 GC.shaderProgram2.max = gl.getUniformLocation(GC.shaderProgram2, "Umax");
	 gl.uniform3fv( GC.shaderProgram2.max, max);


	 GC.shaderProgram2.lightWorldPos = gl.getUniformLocation(GC.shaderProgram2, "lWP");
	 gl.uniform3fv( GC.shaderProgram2.lightWorldPos, [cx,cy, cz-0.5]);

	 GC.shaderProgram2.campos = gl.getUniformLocation(GC.shaderProgram2, "camPos");
	 gl.uniform3fv( GC.shaderProgram2.campos, [cx,cy, cz]);

	 GC.shaderProgram2.color3 = gl.getUniformLocation(GC.shaderProgram2, "color3");
	 gl.uniform3fv( GC.shaderProgram2.campos, [.5, .6, .2]);


	
	 gl.useProgram(GC.shaderProgram3);


	 GC.shaderProgram3.min = gl.getUniformLocation(GC.shaderProgram3, "Umin");
	 gl.uniform3fv( GC.shaderProgram3.min, min);

	 GC.shaderProgram3.max = gl.getUniformLocation(GC.shaderProgram3, "Umax");
	 gl.uniform3fv( GC.shaderProgram3.max, max);


	 GC.shaderProgram3.lightWorldPos = gl.getUniformLocation(GC.shaderProgram3, "lWP");
	 gl.uniform3fv( GC.shaderProgram3.lightWorldPos, [cx,cy, cz-0.5]);

	 GC.shaderProgram3.campos = gl.getUniformLocation(GC.shaderProgram3, "camPos");
	 gl.uniform3fv( GC.shaderProgram3.campos, [cx,cy, cz]);

	 GC.shaderProgram3.color3 = gl.getUniformLocation(GC.shaderProgram3, "color3");
	 gl.uniform3fv( GC.shaderProgram3.campos, [.5, .6, .2]);


	 gl.useProgram(GC.shaderProgram);

	 //	sphere(2.0);

	 //verts = addToList(verts, GC.vertices, GC.indices);
	 //nrms = addToList(nrms, GC.normals, GC.indices);
	 //texPos2 = addToListB( texPos2, GC.texPosB, GC.indices.length);


/*
  m.camposbuff = gl.createBuffer();
  //bind the data we placed in the norm array to an OpenGL buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, m.camposbuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(camera.position), gl.STATIC_DRAW);
*/
  //orient the camera to look at the center of the model
  camera.lookAt = [(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0];

  //bind the data we placed in the bary array to an OpenGL buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nrms), gl.STATIC_DRAW);

  m.vertexBuffer = gl.createBuffer();
  //bind the data we placed in the verts array to an OpenGL buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);


  m.normlBuffer = gl.createBuffer();
  //bind the data we placed in the norm array to an OpenGL buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, m.normlBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nrms), gl.STATIC_DRAW);


  m.texbuff = gl.createBuffer();
  //bind the data we placed in the norm array to an OpenGL buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, m.texbuff);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texPos2), gl.STATIC_DRAW);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texPos), gl.STATIC_DRAW);


  m.texBuffer = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, m.texBuffer);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
	//	  document.getElementById('ut logo'));
  //gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
	//	  document.getElementById('wall2'));
  gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		  document.getElementById('skull'));
  //gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
	//	  document.getElementById('powerT logo'));
  //gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
	//	  document.getElementById('UT transparent logo'));
  //////////gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texPos ), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texPos2 ), gl.STATIC_DRAW);

  GC.drawArray = setDrawArray(GC.mesh);
  //setDrawArray(GC.mesh2);

}

//will return an array containing the vertices in the order described 
//by indices
getverts = function(vertices, indices)
{
	var verts = [];

	indices.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
        vx = (parseFloat(vertices[d*3]));
        vy = (parseFloat(vertices[d*3+1]));
        vz = (parseFloat(vertices[d*3+2]));

        verts.push(vx,vy,vz);
    });

	return verts
}

setDrawArray = function(mesh)
//setDrawArray = function(mesh)
{
    var m = mesh.model;
    //var m = mesh.model
	
	var vert = getverts(m.vertices, m.indices);;
	var normal = getverts(m.norml, m.indices);;
	var texturecords= GC.mesh.texP;


	GC.drawArray.push( vert, normal, texturecords);;
	//verts = getverts(m.vertices, m.indices);
	//nrms = getverts(m.norml, m.indices);
	//texPos2 = gettex(GC.texPosB, m.indices);
	//texPos2 = GC.texPosA;
	return GC.drawArray;
}

getnrms = function()
{
	var verts = [];

    GC.indicesB.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
        vx = (parseFloat(GC.normalsB[d*3]));
        vy = (parseFloat(GC.normalsB[d*3+1]));
        vz = (parseFloat(GC.normalsB[d*3+2]));

        verts.push(vx,vy,vz);
    });

	return verts
}




gettex = function(texPos, indices)
{
	var tex = [];

    indices.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
        tu = (parseFloat(texPos[d*2]));
        tv = (parseFloat(texPos[d*2+1]));

        tex.push(tu,tv);
    });

	return tex
}


setvertAttrib = function(buffer, name, data, num, program)
{

	var attrib = gl.getAttribLocation(program, name);
	gl.enableVertexAttribArray(attrib);
	//set current buffer to given, then load given
	//data into buffer
	//gl.bindBuffer(gl.ARRAY_BUFFER, GC.barycentricBuffer);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	//load data into attribute in shader
	gl.vertexAttribPointer(attrib, num, gl.FLOAT, false, 0, 0);

}


setUpTex = function(m, name, texPos, num)
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

	gl.activeTexture( gl.TEXTURE0 + num);

	//gl.bindTexture(gl.TEXTURE_2D, null);
}


setUpCubeTex = function(m, nameArray, texPos, num)
{
	m.texBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, m.texBuffer);

	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

	gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( nameArray[0] ) );

	gl.texImage2D( gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( nameArray[1] ) );

	gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( nameArray[2] ) );

	gl.texImage2D( gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( nameArray[3] ) );

	gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( nameArray[4] ) );

	gl.texImage2D( gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( nameArray[5] ) );


	//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( texPos ), gl.STATIC_DRAW);

	//gl.activeTexture( gl.CUBE_TEXTURE0 + 0.0);
	gl.activeTexture( gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}



demo.prototype.setEmUp = function()
{
	GC.drawArray = [];
	GC.drawArray2 = [];
    
	var m = GC.mesh.model;
    var m2 = GC.mesh2.model;
    var m3 = GC.mesh3.model;
	//var m2 = GC.mesh2.model;
	console.log( "the indices length is " + m.vertices.length);
	console.log( "the indices length is " + m2.verticesC.length);
	console.log( "the indices length is " + m3.vertices.length);
	
	var	verts = getverts(m.vertices, m.indices);
	var nrms = getverts(m.norml, m.indices);
	var texPos2 = GC.texPosA;
	var length = m.indices.length;
	
	GC.mesh.model.VS = verts;
    GC.mesh.model.NS = nrms;
    GC.mesh.model.TP = texPos2;
    GC.mesh.model.length = length;
	
	m.VS = verts;
	m.NS = nrms;
	m.TP = texPos2;
	m.length = length
	
	GC.drawArray.push( verts, nrms, texPos2, length);

	verts = getverts(m2.verticesC, m2.indicesC);
	nrms = getverts(m2.normalsC, m2.indicesC);
	texPos2 = gettex(m2.texPosC, m2.indicesC);
	length = m2.indicesC.length;

	GC.mesh2.model.VS = verts;
    GC.mesh2.model.NS = nrms;
    GC.mesh2.model.TP = texPos2;
    GC.mesh2.model.length = length;
	
	GC.drawArray2.push( verts, nrms, texPos2, length);

	//console.log( "the indices length is " + m3.vertices.length);
	verts = getverts(m3.vertices, m3.indices);
	nrms = getverts(m3.norml, m3.indices);
	//texPos2 = gettex(m3.texPos, m3.indices);
	//texPos2 = GC.texPosA;
	texPos2= gettex(m3.norml, m3.indices);
	length = m3.indices.length;
	
	GC.drawArray3.push( verts, nrms, texPos2, length);
}



function drawToFrameBuffer(framebuffer){

	gl.useProgram(GC.shaderProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.clearColor(0.9,0.1,0.5,1.0);     //background to black

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, GC.widthoff, GC.heightoff);

	var m = GC.mesh.model;

	GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");

	GC.perspectiveMatrix = makePerspective(45, GC.widthoff/GC.heightoff, 0.1, Math.max(2000.0,m.maxZ));
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


	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram);

	var cubeside = ['right','left','top','bottom','front','back'];
	var cubeside2 = ['Pright','Pleft','Ptop','Pbottom','Pfront','Pback'];
	var cubeside3 = ['Tright','Tleft','Ttop','Tbottom','Tfront','Tback'];

	//setUpTex(m, 'skull', texPos2, 0);

	//setUpCubeTex(m, cubeside, verts, 1);
	setUpCubeTex(m, cubeside3, verts, 0);

	setMatrixUniformsB(GC, GC.shaderProgram);
	gl.drawArrays(gl.TRIANGLES,0,length);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.clearColor(0.1,0.1,0.3,1.0);     //background to black
}






//the drawing function
function drawScene(){
	//draw to frame  buffer
	drawToFrameBuffer(GC.frameBuffer);

	 gl.useProgram(GC.shaderProgram);
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, GC.width, GC.height);

	var m = GC.mesh.model;
	//var m3 = GC.mesh3.model

	GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");

	//setup perspective and lookat matrices
	GC.perspectiveMatrix = makePerspective(45, GC.width/GC.height, 0.1, Math.max(2000.0,m.maxZ));
	var lookAtMatrix = makeLookAt(camera.position[0],camera.position[1],camera.position[2],
			camera.lookAt[0],camera.lookAt[1],camera.lookAt[2],
			0,1,0);
	GC.mIVMatrix =(lookAtMatrix.inv() );
	GC.mIVMatrix.inv( lookAtMatrix);;
	//GC.mIVMatrix =(lookAtMatrix);
	//var s = GC.mIVMatrix;
	
//	console.log("hi"+lookAtMatrix[0][0]);


	//var IV = GC.mIVMatrix.inv();

    //set initial camera lookat matrix
    mvLoadIdentity(GC);

    //multiply by our lookAt matrix
    mvMultMatrix(lookAtMatrix,GC);

//--------- camera rotation matrix multiplicaton
    //translate to origin of model for rotation
    mvTranslate([(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0],GC);

    mvMultMatrix(camera.Transform,GC);//multiply by the transformation

    //translate back to original origin
    mvTranslate([-(m.minX+m.maxX)/2.0,-(m.minY+m.maxY)/2.0,-(m.minZ+m.maxZ)/2.0],GC);
//---------

    //passes modelview and projection and inverse view matrices to the vertex shader

	//GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");
     gl.uniform3fv( GC.shaderProgram.picker, [0.0,0.0, 0.0]);


	//var picked  = gl.getUniformLocation(GC.shaderProgram, "picked");
     //gl.uniform1f( GC.shaderProgram.picker, 0.0);


	//initiate the rendering of the base object
	var verts = [];
	var nrms = [];
	var texpos2 = [];
	var length = m.indices.length;

	verts = GC.mesh.model.VS;
	nrms = GC.mesh.model.NS;;
	texPos2 = GC.mesh.model.TP;;
	length = GC.mesh.model.length;;


	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram);


	//setUpTex(m, 'skull', texPos2);
	//setUpTex(m, 'skull', texPos2);
	
	var cubeside = ['right','left','top','bottom','front','back'];
	var cubeside2 = ['Pright','Pleft','Ptop','Pbottom','Pfront','Pback'];
	var cubeside3 = ['Tright','Tleft','Ttop','Tbottom','Tfront','Tback'];



	//setUpTex(m, 'skull', texPos2,0);
	//setUpTex(m, 'front', texPos2);
	//setUpTex(m, 'back', texPos2);
	//setUpTex(m, 'fskull', texPos2);
	setUpCubeTex(m, cubeside3, verts, 0);
	//setUpCubeTex(m, cubeside3, verts, 1);

	//gl.activeTexture(gl.TEXTURE2);
	//gl.bindTexture(gl.TEXTURE_2D, GC.frameBuffer.texture);
	//gl.bindTexture(gl.TEXTURE_2D, null);


	//mvPushMatrix(GC) ;
	//draw everything
    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram);
    gl.drawArrays(gl.TRIANGLES,0,length);
    //gl.drawArrays(gl.TRIANGLES,0,(m.indices.length+GC.indices.length));


	//CREATE THE OTHER OBJECTS
	//This uniform will be used to select with operations in the shaders are done
     gl.uniform3fv( GC.shaderProgram.picker, [1.0,1.0, 1.0]);
	 //sphere(.25);

	gl.useProgram(GC.shaderProgram3);

	var m2 = GC.mesh2.model;


	verts = GC.mesh2.model.VS;
	nrms = GC.mesh2.model.NS;;
	texPos2 = GC.mesh2.model.TP;;
	length = GC.mesh2.model.length;;


	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram2);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram2);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram2);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram2);
	//give this a mesh model, the name of the tag you gave to the 
	//image file, and the texture coordinates
	//setUpTex(m, 'ut logo', texPos2);
	//setUpCubeTex(m, cubeside, verts, 1);
//		setUpTex(m, 'ut logo', texPos2, 0);
	gl.bindTexture(gl.TEXTURE_2D, GC.frameBuffer.texture);
	gl.activeTexture(gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_2D, null);

	mvPushMatrix(0,GC) ;

	var v1 = [0.0,0.0,-0.0];

	mvTranslate(v1,GC);

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram3);
    //gl.drawArrays(gl.TRIANGLES,0,GC.indicesB.length);
    gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);
/*
	gl.uniform3fv( GC.shaderProgram.picker, [2.0,1.0, 1.0]);
	
	//verts = getverts(GC.verticesB, GC.indicesB);
	//nrms = getverts(GC.normalsB, GC.indicesB);
	//texPos2 = GC.texPosA;
	//texPos2 = gettex(GC.texPosB, GC.indicesB);


	verts = GC.drawArray3[0];
	nrms = GC.drawArray3[1];
	texPos2 = GC.drawArray3[2];
	//texPos2 = GC.texPosA;
	length = GC.drawArray3[3];

	setvertAttrib(m.vertexBuffer, GC.vertexPositionAttribute, verts, 3);
	setvertAttrib(GC.barycentricBuffer, GC.barycentricAttribute, nrms, 3);
	setvertAttrib(m.normlBuffer, GC.normlAttribute, nrms, 3);
	setvertAttrib(m.texbuff, GC.texAttribute, texPos2, 2);
    
	//setUpTex(m, 'ut logo', texPos2);
	
	mvPushMatrix(0,GC) ;

	//var v = [-10.5,10.0,10.0];
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
}

//initialize webgl
demo.prototype.initWebGL = function(){
    gl = null;

    try {
        gl = this.canvas.getContext("experimental-webgl");
    }
    catch(e) {
        //pass through
    }

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
}

//compile shader located within a script tag
demo.prototype.getShader = function(id){
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);
    if(!shaderScript){
        return null;
    }

    //init the source code variable
    theSource = "";

    //begin reading the shader source from the beginning
    currentChild = shaderScript.firstChild;

    //read the shader source as text
    while(currentChild){
        if(currentChild.nodeType == currentChild.TEXT_NODE){
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    //check type of shader to give openGL the correct hint
    if(shaderScript.type == "x-shader/x-fragment"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if(shaderScript.type == "x-shader/x-vertex"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    
    //add the shader source code to the created shader object
    gl.shaderSource(shader, theSource);

    //compile the shader
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log("error compiling shaders -- " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


//handle mousedown
demo.prototype.mouseDown = function(event){
    GC.mouseDown = true;

    //update the base rotation so model doesn't jerk around upon new clicks
    camera.LastRot = camera.ThisRot;
    camera.click(event.clientX,event.clientY);

    return false;
}

//handle mouseup
demo.prototype.mouseUp = function(event){
    GC.mouseDown = false;
    return false;
}

//handle mouse movement
demo.prototype.mouseMove = function(event){
    if(GC.mouseDown == true){
       X = event.clientX;
       Y = event.clientY;

       //call camera function for handling mouse movement
       camera.move(X,Y)

       drawScene();
    }
    return false;
}

//handle mouse scroll event
demo.prototype.mouseWheel = function(event){
    camera.zoomScale -= event.wheelDeltaY*0.0005;
    camera.Transform.elements[3][3] = camera.zoomScale;

    drawScene();
    return false;
}


//--------- handle keyboard events
demo.prototype.keyDown = function(e){
    camera.LastRot = camera.ThisRot;
    var center = {x: GC.width/2, y:GC.height/2}; 
    var delta = 8;

    switch(e.keyCode){
        case 37: //Left arrow
            camera.click(center.x, center.y);
            camera.move(center.x - delta, center.y);
        break;
        case 38: //Up arrow
            camera.click(center.x, center.y);
            camera.move(center.x, center.y - delta);
        break;
        case 39: //Right arrow
            camera.click(center.x, center.y);
            camera.move(center.x + delta, center.y);
        break;
        case 40: //Down arrow
            camera.click(center.x, center.y);
            camera.move(center.x, center.y + delta);
        break;
    }

    //redraw
    drawScene();
}


// --------- handle touch events
demo.prototype.touchDown = function(event){
    GC.mouseDown = true;

    //update the base rotation so model doesn't jerk around upon new clicks
    camera.LastRot = camera.ThisRot;

    //tell the camera where the touch event happened
    camera.click(event.changedTouches[0].pageX,event.changedTouches[0].pageY);

    return false;
}

//handle touchEnd
demo.prototype.touchUp = function(event){
    GC.mouseDown = false;
    return false;
}

//handle touch movement
demo.prototype.touchMove = function(event){
    if(GC.mouseDown == true){
        X = event.changedTouches[0].pageX;
        Y = event.changedTouches[0].pageY;

       //call camera function for handling mouse movement
       camera.move(X,Y)

       drawScene();
    }
    return false;
}

