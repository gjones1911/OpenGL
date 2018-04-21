var gl = null; //our OpenGL handler

var GC = {};   //the graphics context

var tooAni = 1;

//initialize the graphics context variables
GC.shaderProgram = null;          //our GLSL program
GC.shaderProgram2 = null;          //our GLSL program
GC.shaderProgram3 = null;          //our GLSL program
GC.shaderProgram4 = null;          //our GLSL program
GC.shaderProgram5 = null;          //our GLSL program
GC.shaderProgram6 = null;          //our GLSL program
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
GC.mesh4 = null;                   //the current mesh
GC.meshSphere = null;                   //the current mesh
GC.meshCube = null;                   //the current mesh
GC.mouseDown = null;              //boolean check for mouseDown
GC.width = 640;                   //render area width
GC.height = 480;                  //render area height
GC.widthoff = 512;                   //render area width
GC.heightoff = 512;                  //render area height
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
GC.color3 = [0.5, 0.6, 0.2];
GC.drawArray = [];
GC.drawArray2 = [];
GC.drawArray3 = [];

GC.lightColor = [1.0, 1.0, 1.0];

var xdel = 0;
var ydel = 0;
var zdel = .9;

var lx ;
var ly ;
var lz ;

var dx = 0.0;
var dz = 0.0;

GC.lightColorR = [1.0, 0.0, 0.0];
GC.lightColorG = [0.0, 1.0, 0.0];
GC.lightColorB = [0.0, 0.0, 1.0];
var ang3 = 0;

//GC.light1 = [4.5, -1.5, -1.8];
GC.light1 = [.5, -1.5, -.8];
GC.lightLocation1;

//GC.light2 = [-4.5, -1.5, -.8];
GC.light2 = [.5, -1.5, -.8];
GC.lightLocation2;

GC.data;
GC.angle1 = 0.0;;
GC.angle2 = 0.0;
GC.angle3 = 0.0;;

GC.frameBuffer;
//GC.mesh3.drawArray = [];

GC.programCount = 0.0;

GC.lightWorldPosition = [];
GC.CameraPosition = [];
GC.min;
GC.max;
GC.Rnum;


GC.AttribArray = ["vPos","bary","normals","texPos"];
GC.attribNum = [3, 3, 3, 2];
//GC.lightposAttribute;                  //render area height


//Prntr("What up Yo!!!");
//Prntr("How goes it?!!!");




var camera = new ArcBall();              //create a new arcball camera
camera.setBounds(GC.width,GC.height);    //initialize camera with screen space dimensions

var counter = 0;

function getMesh(filename)
{
	$.ajax({
		url:"./"+filename,
		success:processMesh2 // --- call the function "processMesh" when the .obj is loaded
	});

}


function processMesh2(data){

	if(data.target != undefined){
		var mesh = {model: new modelLoader.Mesh(data.target.result)}
	} else {
		var mesh = {model: new modelLoader.Mesh(data)}
	}
	
	GC.Hmesh = mesh;;
	GC.mesh4 = mesh;;

	Prntr("mesh vert 0 "+mesh.model.vertices[0]);
	sleep(3);
	counter++;
}











//demo constructor
function demo(canvasName,MeshArray) {
//function demo(canvasName,Mesh, Mesh2) {
    
	Prntr("Mesh array size is: "+MeshArray.length);
	
	
	this.canvasName = canvasName;
    GC.mesh = MeshArray[0];
    //GC.mesh = MeshArray[1];
//GC.mesh2 = MeshArray[1];
    GC.mesh3 = MeshArray[1];
  //  GC.mesh4 = MeshArray[1];

	if(GC.mesh.model.VYN != 1) 
	{
		Prntr("mesh 1 has no normals");
		GC.mesh.model = getMeshNormals(GC.mesh);
	}
	
//	if(GC.mesh3.model.VYN != 1)
//	{
//		Prntr("mesh 3 has no normals");
		GC.mesh3.model = getMeshNormals(GC.mesh3);
//	}

//	if(GC.mesh4.model.VYN != 1)
//	{
//		Prntr("mesh 4 has no normals");
//		GC.mesh3.model = getMeshNormals(GC.mesh3);
//	}

	GC.mesh.model = getMinMaxC(GC.mesh);
	GC.mesh3.model = getMinMaxC(GC.mesh3);
	//GC.mesh4.model = getMinMaxC(GC.mesh3);

    GC.MeshArray = MeshArray;;
	GC.mesh2 =  {model: new modelLoader.sphere(.25)};
	//GC.mesh2.model = getMeshNormals(GC.mesh2);
	GC.meshSphere =  {model: new modelLoader.sphere(.125)};
	GC.meshCube =  {model: new modelLoader.cube};


	GC.mesh.scale = [25.0, 25.0, 25.0];
	GC.mesh2.scale = [3.0, 2.0, 2.0];
	GC.mesh3.scale = [.009, .009, .009];
//	GC.mesh4.scale = [.04, 0.04, 0.04];

	Prntr("1's nomr1 "+GC.mesh.model.norml[0]);
	Prntr("3's nomr1 "+GC.mesh3.model.norml[0]);

	var m = GC.mesh.model;

	Prntr("the min/max/cent of 1"+m.min[0]+" "+m.min[1]+" "+m.min[2]);
	Prntr("the min/max/cent of 1"+m.max[0]+" "+m.max[1]+" "+m.max[2]);
	Prntr("the cent of "+m.centroid[0]+" "+m.centroid[1]+" "+m.centroid[2]);


	m = GC.mesh3.model;


	Prntr("the min/max/cent of "+m.min[0]+" "+m.min[1]+" "+m.min[2]);
	Prntr("the min/max/cent of "+m.max[0]+" "+m.max[1]+" "+m.max[2]);
	Prntr("the cent of 3"+m.centroid[0]+" "+m.centroid[1]+" "+m.centroid[2]);

//	getMesh("cubeB.obj");
	//getMesh("SS.obj");
	//sleep(2);
	//GC.mesh4 = GC.Hmesh;
/*
	var cn = 0;

	while(cn != 2)
	{
		Prntr("cn: "+cn);
		cn = counter;
	}

	if(counter == 3)Prntr("mesh 4 vert 0:"+GC.mesh4.model.vertices[0]);
	else Prntr("DIDN'T MAKE IT");
*/
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


//	this.setEmUp();

	setMeshBasics();

}


var anum = 0;

function animate()
{
//	gl.useProgram(GC.shaderProgram);
//
//	GC.Rnum = Math.random()*.2;
//
//	loadvertUniforms3f(centroidName, GC.shaderProgram, SdataVec);

	//GC.angle2 = GC.angle2 + 25:

	if( tooAni == 1)
	{
		anum += 2;
		
		
		if( (ang3 + Math.PI/1000) < 360)ang3 += (Math.PI)/1000;
		else ang3 = 0.0;
		
		dx = lz * Math.cos(ang3);
		dz = lz * Math.sin(ang3);
		


		var currentTime = Date.now();

		if (GC.lastRotationTime) {
			var delta = currentTime - GC.lastRotationTime;

			//if( (GC.angle1 + (35 * delta)/1000.0) > 360.0) GC.angle1 = 0.0;
			//else GC.angle1 += (35 * delta) / 1000.0;
			//if( GC.angle1 + .25*(delta/1000)  > 360.0) GC.angle1 = 0.0;
			//else GC.angle1 += .25*(delta/1000);
			if( GC.angle1 + .2  > 360.0) GC.angle1 = 0.0;
			else GC.angle1 += .2;
		}

		GC.lastRotationTime = currentTime;
	}

	drawScene();
	
	//if(tooAni == 1)
//	{
		requestAnimationFrame(animate);
//	}
}


function LoadAttrib(attribA, dataA, numA, shaderProgram)
{
	var i = 0;

	for(i = 0; i< attribA.length; i++)
	{

		setvertAttrib(gl.createBuffer(), attribA[i], dataA[i], numA[i], shaderProgram);
	}

}


var lasttime = Date.now();

function setMeshBasics()
{
	//set up the models
	Prntr("making 1");
	GC.mesh.model = setUpModel(GC.mesh, 0);
	Prntr("making 2");
	GC.mesh2.model = setUpModel(GC.mesh2, 1);
	Prntr("making 3");
	GC.mesh3.model = setUpModel(GC.mesh3, 0);
	//Prntr("making 4");
	//GC.mesh4.model = setUpModel(GC.mesh4, 0);

	var m = GC.mesh.model;
	var m2 = GC.mesh2.model;
	var m3 = GC.mesh3.model;
	//var m4 = GC.mesh4.model;

	var RNDS = getRands(GC.mesh.model.vertices, GC.mesh.model.indices);

	//GC.AttribArray = ["vPos","bary","normals","texPos"];

	//GC.AttribArray = ["vPos","bary","normals","texPos"];
	
	var adata = [];
	var bdata = [];
	var cdata = [];
	var nums = [3, 3, 3, 2];

	adata.push(m.VS, m.NS, m.NS, m.TP);
	bdata.push(m2.VS, m2.NS, m2.NS, m2.TP);
	cdata.push(m3.VS, m3.NS, m3.NS, m3.TP);

	var uniformArry3f = ["light1", "light2","camPos","Umin","Umax","lWP","color3"];

	var centroidName = ["centrd"];

	
	var SdataVec = [];
	SdataVec.push(m.centroid);
	Prntr("the centroid of m1: "+m.centroid[0]+" "+m.centroid[1]+" "+m.centroid[2]);
	//GC.light1 = [4.5, -1.5, -1.8];

//	GC.light2 = [-4.5, -1.5, -1.8];
	var dataVec = [];
	
	dataVec.push(GC.light1, GC.light2, GC.CameraPosition, GC.min, GC.max, GC.lightWorldPosition, GC.color3);

	Prntr("Making program 1");
	gl.useProgram(GC.shaderProgram); //set up stuff for program/object 1
	LoadAttrib(GC.AttribArray, adata, nums, GC.shaderProgram)
	loadvertUniforms3f(uniformArry3f, GC.shaderProgram, dataVec);
	loadvertUniforms3f(centroidName, GC.shaderProgram, SdataVec);

	Prntr("Making program 2");
    gl.useProgram(GC.shaderProgram2);
	LoadAttrib(GC.AttribArray, bdata, nums, GC.shaderProgram2);
	loadvertUniforms3f(uniformArry3f, GC.shaderProgram2, dataVec);
	loadvertUniforms3f(centroidName, GC.shaderProgram2, SdataVec);



	Prntr("Making program 3");
    gl.useProgram(GC.shaderProgram3);
	LoadAttrib(GC.AttribArray, bdata, nums, GC.shaderProgram3);
	loadvertUniforms3f(uniformArry3f, GC.shaderProgram3, dataVec);
	
	Prntr("Making program 4");
    gl.useProgram(GC.shaderProgram4);
	LoadAttrib(GC.AttribArray, cdata, nums, GC.shaderProgram4);
	loadvertUniforms3f(uniformArry3f, GC.shaderProgram4, dataVec);
	
	Prntr("Making program 5");
    gl.useProgram(GC.shaderProgram5);
	LoadAttrib(GC.AttribArray, cdata, nums, GC.shaderProgram5);
	loadvertUniforms3f(uniformArry3f, GC.shaderProgram5, dataVec);

	Prntr("Making program 6");
    gl.useProgram(GC.shaderProgram6);
	LoadAttrib(GC.AttribArray, cdata, nums, GC.shaderProgram6);
	loadvertUniforms3f(uniformArry3f, GC.shaderProgram6, dataVec);

}



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

loadvertUniforms4f = function(uniformArry, shaderProgram, dataVec)
{
	for( var i = 0; i < uniformArry.length; i++)
	{
		uniformVert3f = gl.getUniformLocation(shaderProgram, uniformArry[i]);
		gl.uniform3fv( uniformVert3f, [dataVec[0], dataVec[1], dataVec[2]]);
	}
}

loadvertUniforms3f = function(uniformArry, shaderProgram, dataVec)
{
	for( var i = 0; i < uniformArry.length; i++)
	{
		uniformVert3f = gl.getUniformLocation(shaderProgram, uniformArry[i]);
		gl.uniform3fv( uniformVert3f, dataVec[i]);
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

	this.shaderProgram = this.MakeProgram("FragmentShader1", "Gshader");

	GC.shaderProgram = this.shaderProgram;

	this.shaderProgram2 = this.MakeProgram("FragmentShader2", "Gshader2");

	this.shaderProgram3 = this.MakeProgram("TexFragmentShader","TVshader2");
	this.shaderProgram6 = this.MakeProgram("Tex2FragmentShader","TVshader2");
	
	this.shaderProgram4 = this.MakeProgram("ReflectiveFShader","ReflectiveVShader");
	this.shaderProgram5 = this.MakeProgram("BMPTexFragmentShader","BMPTVshader2");
	//this.shaderProgram6 = this.MakeProgram("SILFragmentShader","TVshader2");

	GC.shaderProgram = this.shaderProgram;
	GC.shaderProgram2 = this.shaderProgram2;
	GC.shaderProgram3 = this.shaderProgram3;
	GC.shaderProgram4 = this.shaderProgram4;
	GC.shaderProgram5 = this.shaderProgram5;
	GC.shaderProgram6 = this.shaderProgram6;
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
	
	// Loop through the indices array and create a vertices array (this means
    //     duplicating data) from the listed indices
    m.indices.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
		vx = (parseFloat(m.vertices[d*3]));
        vy = (parseFloat(m.vertices[d*3+1]));
        vz = (parseFloat(m.vertices[d*3+2]));

/*
        nx = (parseFloat(m.norml[d*3]));
        ny = (parseFloat(m.norml[d*3+1]));
        nz = (parseFloat(m.norml[d*3+2]));
        
		//add this vertex to our array
        verts.push(vx,vy,vz);
		nrms.push( nx,ny,nz);

*/
        //check to see if we need to update the min/max
        if(vx < min[0]) min[0] = vx;
        if(vy < min[1]) min[1] = vy;
        if(vz < min[2]) min[2] = vz;
        if(vx > max[0]) max[0] = vx;
        if(vy > max[1]) max[1] = vy;
        if(vz > max[2]) max[2] = vz;

/*
        //What does this do?
        if(i%3 == 0){
            bary.push(1,0,0);
        } else if(i % 3 == 1){
            bary.push(0,1,0);
        } else if(i % 3 == 2){
            bary.push(0,0,1);
        }
*/
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

 GC.cx = cx;
 GC.cy = cy;
 GC.cz = cz;

 lx = cx;
 ly= cy;
 lz = cz + .5;

  GC.light1 = [lx, ly, lz];
  //GC.light2 = [cx, cy, cz-.5];
  GC.lightWorldPosition = [cx, cy-.5, cz-0.5];
  GC.CameraPosition = [cx, cy, cz];
  GC.min = min;
  GC.max = max;
  

  gl.useProgram(GC.shaderProgram);

  //orient the camera to look at the center of the model
  camera.lookAt = [(m.minX+m.maxX)/2.0,(m.minY+m.maxY)/2.0,(m.minZ+m.maxZ)/2.0];

  //GC.drawArray = setDrawArray(GC.mesh);

}


getRands = function(vertices, indices)
{
	var verts = [];

	indices.forEach(function(d,i){
        //grab the x,y,z values for the current vertex
        verts.push(((Math.random())*.05 ));
    });

	return verts;
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

	return verts;
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

	//gl.activeTexture( gl.TEXTURE0 + num);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( name ) );

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( texPos ), gl.STATIC_DRAW);

	gl.activeTexture( gl.TEXTURE0 + num);

//	gl.bindTexture(gl.TEXTURE_2D, null);
}



setUpTexR = function(m, name, texPos, num)
{
	m.texBuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, m.texBuffer);

	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
			document.getElementById( name ) );

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( texPos ), gl.STATIC_DRAW);

	gl.activeTexture( gl.TEXTURE0 + num);

//	gl.bindTexture(gl.TEXTURE_2D, null);
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

setUpModel = function(mesh, ver)
{
	m = mesh.model
	
	var	verts = getverts(m.vertices, m.indices);
	var nrms = getverts(m.norml, m.indices);
	 texPos2 = [];
	if(m.texPos != null) 
	{	Prntr("in setUpModel not null");	
		if(ver == 0)  texPos2 = gettex(m.texPos, m.indices);
		else texPos2 = gettex(m.texPosC, m.indicesC);
		Prntr("in setUpModel not null DONE:");
	}
	else
	{
		m.indices.forEach(function(d,i){
			//grab the x,y,z values for the current vertex
			tu = d % 2.0;
			tv = d % 2.0;

			texPos2.push(tu,tv);
		});

	}
	var length = m.indices.length;
	
	m.VS = verts;
	m.NS = nrms;
	m.TP = texPos2;
	m.length = length

	return m;
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


function autodrawToFrameBuffer(framebuffer , drawAry, meshA)
//function drawToFrameBuffer(framebuffer, gc, shaderProgram){
{

	gl.useProgram(GC.shaderProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.clearColor(0.9,0.1,0.5,1.0);     //background to black

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, GC.widthoff, GC.heightoff);

	var m = GC.mesh.model;

//	GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");

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

	for(var i = 0; i < drawAry.length;i++)
	{
		var func = drawAry[i];

		func(meshA[i]);
	}

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}



function drawToFrameBuffer(framebuffer){
//function drawToFrameBuffer(framebuffer, gc, shaderProgram){

	gl.useProgram(GC.shaderProgram);
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.clearColor(0.9,0.1,0.5,1.0);     //background to black

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, GC.widthoff, GC.heightoff);

	var m = GC.mesh.model;

//	GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");

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

	draw2(GC.mesh2);
	draw1(GC.mesh);

	//gl.uniform3fv( GC.shaderProgram.picker, [0.0,2.0, 0.0]);
/*
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
	var cubeside4 = ['Tleft','Tright','Ttop','Tbottom','Tback','Tfront'];

	//setUpTex(m, 'skull', texPos2, 0);

	//setUpCubeTex(m, cubeside, verts, 1);
	setUpCubeTex(m, cubeside3, verts, 0);

	setMatrixUniformsB(GC, GC.shaderProgram);
	gl.drawArrays(gl.TRIANGLES,0,length);
*/
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.clearColor(0.1,0.1,0.3,1.0);     //background to black
}

//draw using shader program 1 to make a cube map
function draw1(mesh)
{
	 gl.useProgram(GC.shaderProgram);

	//var m = GC.mesh.model;
	var m = mesh.model;

	//initiate the rendering of the base object
	var verts = [];
	var nrms = [];
	var texpos2 = [];
	var length = m.indices.length;

	//verts = GC.mesh.model.VS;
	//nrms = GC.mesh.model.NS;;
	//texPos2 = GC.mesh.model.TP;;
	//length = GC.mesh.model.length;;

	verts = m.VS;
	nrms = m.NS;;
	texPos2 = m.TP;;
	length = m.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram);
	GC.lightLocation1 = gl.getUniformLocation(GC.shaderProgram, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array([lx+dx , ly, lz+dz]) );

	var Name = ["scale"];
	
	var dataVec = [mesh.scale];
	
	loadvertUniforms3f(Name, GC.shaderProgram, dataVec);

	//setUpTex(m, 'skull', texPos2);
	//setUpTex(m, 'skull', texPos2);
	
	var cubeside = ['right','left','top','bottom','front','back'];
	var cubeside2 = ['Pright','Pleft','Ptop','Pbottom','Pfront','Pback'];
	var cubeside3 = ['Tright','Tleft','Ttop','Tbottom','Tfront','Tback'];
	var cubeside4 = ['s1right','s1left','s1top','s1bottom','s1front','s1back'];
	var cubeside5 = ['s2right','s2left','s2top','s2bottom','s2front','s2back'];
	var cubeside6 = ['s3right','s3left','s3top','s3bottom','s3front','s3back'];
	var cubeside7 = ['s4right','s4left','s4top','s4bottom','s4front','s4back'];
	var cubeside8 = ['s5right','s5left','s5top','s5bottom','s5front','s5back'];

	var current = cubeside6;

	//setUpTex(m, 'skull', texPos2,0);
	//setUpTex(m, 'front', texPos2);
	//setUpTex(m, 'back', texPos2);
	//setUpTex(m, 'fskull', texPos2);
	setUpCubeTex(m, current, verts, 0);
	//setUpCubeTex(m, cubeside3, verts, 1);

	//gl.activeTexture(gl.TEXTURE2);
	//gl.bindTexture(gl.TEXTURE_2D, GC.frameBuffer.texture);
	//gl.bindTexture(gl.TEXTURE_2D, null);


	mvPushMatrix(0,GC) ;
	mvTranslate([0.0, 8.0, -.5],GC);
	mvRotate(GC.angle1/10, [0.0, 1.0,0.0], GC);	
	//draw everything
    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram);
    gl.drawArrays(gl.TRIANGLES,0,length);
	mvPopMatrix(GC);

	//draw2();
    //anidraw(GC.mesh3, 1, GC.shaderProgram4, cubeside7);
	drawBMP(GC.mesh2,"Grock");
	//drawBMP(GC.mesh3,"skull");
	//drawBMP(GC.mesh2,"skull");
	//drawBMP(GC.mesh2,"Grock");
    //anidraw(GC.mesh3, 3, GC.shaderProgram3, 'Fault');
    //anidraw(GC.mesh3, 3, GC.shaderProgram3, 'silver');
	//if(next && sp && num) next(msh, num, sp);
	//else if(next && sp) next(msh, num, sp, current);
	//else if(next && given) next(msh,  sp,given);
}


//draw a reflective object with program 4
function draw2(mesh)
{
	gl.useProgram(GC.shaderProgram4);

	//var m2 = GC.mesh2.model;
	var m = mesh.model;

	var cubeside = ['right','left','top','bottom','front','back'];
	var cubeside2 = ['Pright','Pleft','Ptop','Pbottom','Pfront','Pback'];
	var cubeside3 = ['Tright','Tleft','Ttop','Tbottom','Tfront','Tback'];
	var cubeside4 = ['s1right','s1left','s1top','s1bottom','s1front','s1back'];
	var cubeside5 = ['s2right','s2left','s2top','s2bottom','s2front','s2back'];
	var cubeside6 = ['s3right','s3left','s3top','s3bottom','s3front','s3back'];
	var cubeside7 = ['s4right','s4left','s4top','s4bottom','s4front','s4back'];
	var cubeside8 = ['s5right','s5left','s5top','s5bottom','s5front','s5back'];

	var current = cubeside6;

	//verts = GC.mesh2.model.VS;
	//nrms = GC.mesh2.model.NS;;
	//texPos2 = GC.mesh2.model.TP;;
	//length = GC.mesh2.model.length;;

	verts = mesh.model.VS;
	nrms = mesh.model.NS;;
	texPos2 = mesh.model.TP;;
	length = mesh.model.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram4);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram4);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram4);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram4);
	GC.lightLocation1 = gl.getUniformLocation(GC.shaderProgram4, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array([lx+dx , ly, lz+dz]) );
	var Name = ["scale"];
	var dataVec = [mesh.scale];
	loadvertUniforms3f(Name, GC.shaderProgram4, dataVec);
	//give this a mesh model, the name of the tag you gave to the 
	//image file, and the texture coordinates
	//setUpTex(m, 'ut logo', texPos2);
	setUpCubeTex(m, current, verts, 0);
//		setUpTex(m, 'ut logo', texPos2, 0);


/*********frame texture load********/
//	gl.bindTexture(gl.TEXTURE_2D, GC.frameBuffer.texture);
//	gl.activeTexture(gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_2D, null);

	mvPushMatrix(0,GC) ;

	//var v1 = [0.0,0.0,-0.0];

	//mvTranslate(v1,GC);

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram4);
    //gl.drawArrays(gl.TRIANGLES,0,GC.indicesB.length);
    gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);

	draw1(GC.mesh);
	//if( next && m2) next(m2);
	//draw1(GC.mesh, anidraw, GC.mesh3, GC.shaderProgram3, 1);
//draw1(mesh, next, msh, sp, num, given)
}

//draw with the frame buffer as a texture
function drawFB(mesh, drawA, meshA)
{
	drawToFrameBuffer(GC.frameBuffer);
	//autodrawToFrameBuffer(GC.frameBuffer,drawA, meshA );
	
	gl.useProgram(GC.shaderProgram3);

	//var m2 = GC.mesh2.model;
	var m = mesh.model;

	//verts = GC.mesh2.model.VS;
	//nrms = GC.mesh2.model.NS;;
	//texPos2 = GC.mesh2.model.TP;;
	//length = GC.mesh2.model.length;;

	verts = mesh.model.VS;
	nrms = mesh.model.NS;;
	texPos2 = mesh.model.TP;;
	length = mesh.model.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram2);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram2);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram2);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram2);
	var Name = ["scale"];
	var dataVec = [mesh.scale];
	loadvertUniforms3f(Name, shaderProgram, dataVec);
	//give this a mesh model, the name of the tag you gave to the 
	//image file, and the texture coordinates
	//setUpTex(m, 'ut logo', texPos2);
	//setUpCubeTex(m, cubeside8, verts, 0);
//		setUpTex(m, 'ut logo', texPos2, 0);


	gl.bindTexture(gl.TEXTURE_2D, GC.frameBuffer.texture);
	gl.activeTexture(gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_2D, null);

	mvPushMatrix(0,GC) ;

	//var v1 = [0.0,0.0,-0.0];

	//mvTranslate(v1,GC);

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram3);
    //gl.drawArrays(gl.TRIANGLES,0,GC.indicesB.length);
    gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);

	//draw1(GC.mesh);
	draw1(GC.mesh);

}

var jangle2 = 0.0;
//draw with a texture using program 3
function drawt3(mesh, texture)
{
	
	gl.useProgram(GC.shaderProgram3);

	//var m2 = GC.mesh2.model;
	var m = mesh.model;

	//verts = GC.mesh2.model.VS;
	//nrms = GC.mesh2.model.NS;;
	//texPos2 = GC.mesh2.model.TP;;
	//length = GC.mesh2.model.length;;

	verts = mesh.model.VS;
	nrms = mesh.model.NS;;
	texPos2 = mesh.model.TP;;
	length = mesh.model.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram3);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram3);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram3);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram3);
	GC.lightLocation1 = gl.getUniformLocation(GC.shaderProgram3, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array([lx+dx , ly, lz+dz]) );

	var Name = ["scale"];
	
	var dataVec = [mesh.scale];
	
	loadvertUniforms3f(Name, GC.shaderProgram3, dataVec);
	
	//give this a mesh model, the name of the tag you gave to the 
	//image file, and the texture coordinates
	//setUpTex(m, 'ut logo', texPos2);
	//setUpCubeTex(m, cubeside8, verts, 0);
   	setUpTex(m, texture, texPos2, 0);


	//gl.bindTexture(gl.TEXTURE_2D, null);

	mvPushMatrix(0,GC) ;

	//var v1 = [0.0,0.0,-0.0];

	//mvTranslate(v1,GC);
	mvRotate(anum, [0.0, 1.0,0.0], GC);	
    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram3);
    //gl.drawArrays(gl.TRIANGLES,0,GC.indicesB.length);
    gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);
	draw1(GC.mesh);

}


//draw with a texture using program 3
function drawBMP(mesh, texture)
{
	
	gl.useProgram(GC.shaderProgram5);

	//var m2 = GC.mesh2.model;
	var m = mesh.model;

	//verts = GC.mesh2.model.VS;
	//nrms = GC.mesh2.model.NS;;
	//texPos2 = GC.mesh2.model.TP;;
	//length = GC.mesh2.model.length;;

	verts = mesh.model.VS;
	nrms = mesh.model.NS;;
	texPos2 = mesh.model.TP;;
	length = mesh.model.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram5);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram5);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram5);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram5);

	GC.lightLocation1 = gl.getUniformLocation(GC.shaderProgram5, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array([lx+dx , ly, lz+dz]) );
	
	var Name = ["scale"];
	
	var dataVec = [mesh.scale];
	
	loadvertUniforms3f(Name, GC.shaderProgram5, dataVec);
	
	//give this a mesh model, the name of the tag you gave to the 
	//image file, and the texture coordinates
	//setUpTex(m, 'ut logo', texPos2);
	//setUpCubeTex(m, cubeside8, verts, 0);
   	//setUpTexR(m, "FACE2", texPos2, 0);
   	//setUpTexR(m, "FACE", texPos2, 0);
   	//setUpTexR(m, "bolder", texPos2, 0);
   	setUpTex(m, texture, texPos2, 0);
   	setUpTexR(m, "Grock", texPos2, 1);


	//gl.bindTexture(gl.TEXTURE_2D, null);

	mvPushMatrix(0,GC) ;

	//var v1 = [0.0,0.0,-0.0];

	//mvTranslate(v1,GC);
	mvRotate(anum, [0.0, 1.0,0.0], GC);	

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram5);
    //gl.drawArrays(gl.TRIANGLES,0,GC.indicesB.length);
    gl.drawArrays(gl.TRIANGLES,0,length);

	mvPopMatrix(GC);
	//draw1(GC.mesh);
    //anidraw(GC.mesh3, 3, GC.shaderProgram3, 'Fault');
    anidraw(GC.mesh3, 3, GC.shaderProgram6);

}

function anidraw2(mesh, type, shaderProgram, texture)
{

	//gl.useProgram(GC.shaderProgram3);
	gl.useProgram(shaderProgram);

	var m = mesh.model;
	
	verts = m.VS;
	nrms = m.NS;;
	texPos2 = m.TP;;
	length = m.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, shaderProgram);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, shaderProgram);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, shaderProgram);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, shaderProgram);
    
	var Name = ["scale"];
	
	var myscale = [.5, .5, .5]

	var dataVec = [myscale];
	loadvertUniforms3f(Name, shaderProgram, dataVec);
	
	//setUpTex(m, 'ut logo', texPos2);
	GC.lightLocation1 = gl.getUniformLocation(shaderProgram, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array([lx+dx , ly, lz+dz]) );
	
	if(texture) setUpTex(m,texture, texPos2,0);
	
	var v = [lx+dx, ly + .5, lz+dz];
	var VR = [0.0, 0.0, 1.0];
	
	mvPushMatrix(0,GC) ;

	//var v = [-10.5,10.0,10.0];
	//var v = [0.0, -1.5, 0.5];


	//mvTranslate([0.0, +0.39, 0.0],GC);
	//mvRotate(-90, [1.0, 0.0,0.0], GC);	
	mvTranslate(v,GC);
	//mvRotate(ang3, VR, GC);	
	//mvTranslate([0.0, 2.0, 0.0],GC);

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, shaderProgram);
	gl.drawArrays(gl.TRIANGLES,0,length);
	
	mvPopMatrix(GC);

//	var currentTime = Date.now();
/*
	if (GC.lastRotationTime) {
		var delta = currentTime - GC.lastRotationTime;

		//if( (GC.angle1 + (35 * delta)/1000.0) > 360.0) GC.angle1 = 0.0;
		//else GC.angle1 += (35 * delta) / 1000.0;
		if( GC.angle1 + 45*(delta/1000)  > 360.0) GC.angle1 = 0.0;
		else GC.angle1 += 45*(delta/1000);
	}
*/
//	GC.lastRotationTime = currentTime;

}

function anidraw(mesh, type, shaderProgram, texture)
{

	//gl.useProgram(GC.shaderProgram3);
	gl.useProgram(shaderProgram);

	var m = mesh.model;
	
	verts = m.VS;
	nrms = m.NS;;
	texPos2 = m.TP;;
	length = m.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, shaderProgram);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, shaderProgram);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, shaderProgram);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, shaderProgram);
	GC.lightLocation1 = gl.getUniformLocation(shaderProgram, "light1");
	gl.uniform3fv( GC.lightLocation1, new Float32Array([lx+dx , ly, lz+dz]) );
    
	var Name = ["scale"];
	var dataVec = [mesh.scale];
	loadvertUniforms3f(Name, shaderProgram, dataVec);
	
	//setUpTex(m, 'ut logo', texPos2);
	
	
	if(texture) setUpTex(m,texture, texPos2,0);
	
	mvPushMatrix(0,GC) ;

	//var v = [-10.5,10.0,10.0];
	//var v = [0.0, -1.5, 0.5];
	var v = [-.2, -0.0, 0.0];
	var VR = [0.0, 0.0, 1.0];


	mvTranslate([0.0, -0.39, 0.0],GC);
	mvRotate(-90, [1.0, 0.0,0.0], GC);	
	mvTranslate(v,GC);
	mvRotate(GC.angle1, VR, GC);	
	mvTranslate([0.0, 2.0, 0.0],GC);

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, shaderProgram);
	gl.drawArrays(gl.TRIANGLES,0,length);
	
	mvPopMatrix(GC);
 //   anidraw2(GC.mesh5, 3, GC.shaderProgram3, 'Fault');
	//anidraw2(GC.mesh2, 3, GC.shaderProgram3, 'fskull');
	anidraw2(GC.mesh2, 3, GC.shaderProgram3, 'skull');

}


//the drawing function
function drawScene(){
	//draw to frame  buffer
//	drawToFrameBuffer(GC.frameBuffer);

	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, GC.width, GC.height);

	var m = GC.mesh.model;
	//var m3 = GC.mesh3.model

	//GC.shaderProgram.picker = gl.getUniformLocation(GC.shaderProgram, "picker");

	//setup perspective and lookat matrices
	GC.perspectiveMatrix = makePerspective(45, GC.width/GC.height, 0.1, Math.max(2000.0,m.maxZ));
	var lookAtMatrix = makeLookAt(camera.position[0] + xdel,camera.position[1] +ydel,
	        camera.position[2] + 2.5,
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
     //gl.uniform3fv( GC.shaderProgram.picker, [0.0,0.0, 0.0]);


	//var picked  = gl.getUniformLocation(GC.shaderProgram, "picked");
     //gl.uniform1f( GC.shaderProgram.picker, 0.0);
/*
*/
	draw1(GC.mesh);
	//drawBMP(GC.mesh2,"skull");
    //anidraw(GC.mesh3, 3, GC.shaderProgram6);
	//anidraw2(GC.mesh2, 3, GC.shaderProgram3, 'fskull');
    //anidraw(GC.mesh3, 3, GC.shaderProgram3, 'Fault');
    //anidraw(GC.mesh3, 3, GC.shaderProgram3, 'Fault');
    
	//Prntr('making objec 4');
    //anidraw(GC.mesh3, 3, GC.shaderProgram6, 'Fault');
	//draw2(GC.mesh2);
	//drawt3(GC.mesh2,"Fault");
	//drawBMP(GC.mesh2,"Fault");
    //anidraw(GC.mesh3, 3, GC.shaderProgram3, 'ut logo');

	//CREATE THE OTHER OBJECTS
	//This uniform will be used to select with operations in the shaders are done
     //gl.uniform3fv( GC.shaderProgram.picker, [1.0,1.0, 1.0]);
	 //sphere(.25);
/*
*/	
	
	//gl.uniform3fv( GC.shaderProgram.picker, [2.0,1.0, 1.0]);
	
	//verts = getverts(GC.verticesB, GC.indicesB);
	//nrms = getverts(GC.normalsB, GC.indicesB);
	//texPos2 = GC.texPosA;
	//texPos2 = gettex(GC.texPosB, GC.indicesB);
/*
	gl.useProgram(GC.shaderProgram3);

	var m3 = GC.mesh3.model;
	
	verts = GC.mesh3.model.VS;
	nrms = GC.mesh3.model.NS;;
	texPos2 = GC.mesh3.model.TP;;
	length = GC.mesh3.model.length;;

	setvertAttrib(gl.createBuffer(),"vPos", verts, 3, GC.shaderProgram3);
	setvertAttrib(gl.createBuffer(),"bary", nrms, 3, GC.shaderProgram3);
	setvertAttrib(gl.createBuffer(), "normals", nrms, 3, GC.shaderProgram3);
	setvertAttrib(gl.createBuffer(), "texPos", texPos2, 2, GC.shaderProgram3);
    
	//setUpTex(m, 'ut logo', texPos2);
	setUpTex(m3, 'skull', texPos2,0);
	
	mvPushMatrix(0,GC) ;

	//var v = [-10.5,10.0,10.0];
	//var v = [0.0, -1.5, 0.5];
	var v = [1.0, -0.0, 0.0];
	var VR = [0.0, 0.0, 1.0];


	mvTranslate([0.0, -0.3, 0.0],GC);
	mvRotate(-90, [1.0, 0.0,0.0], GC);	
	mvTranslate(v,GC);
	mvRotate(GC.angle1, VR, GC);	
	mvTranslate([0.0, 2.0, 0.0],GC);

    //setMatrixUniforms(GC);
    setMatrixUniformsB(GC, GC.shaderProgram3);
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
        case 83: //s
            //camera.click(center.x, center.y);
            //camera.move(center.x, center.y + delta);
			if(tooAni == 1) tooAni = 0;
			else 
			{
				tooAni = 1; 
		//		drawScene()
			}
        break;
        case 74: //j--move left
				xdel -= .5;
		break;
        case 76: //l--move right
				xdel += .5;
		break;
        case 73: //i--move up
				ydel += .5;
		break;
        case 75: //k--move down
				ydel -= .5;
		break;
        case 78: //n--move in
				zdel += .5;
		break;
        case 77: //m--move out
				zdel -= .5;
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

