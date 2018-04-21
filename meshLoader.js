if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) === str;
  };
}
var modelLoader = {};

modelLoader.Mesh = function( objectData ){
    /*
        With the given elementID or string of the OBJ, this parses the
        OBJ and creates the mesh.
    */

	var texyn = 0;
    var verts = [];
    var norms = [];
    var texcords = [];
    var n = [];

	//var min = [90000.0, 90000.0, 90000.0];
	//var max = [-90000.0, -90000.0, -90000.0];

	var vx;
	var vy;
	var vz;


	var vnyn = 0;

    // unpacking stuff
    var packed = {};
    packed.indices = [];
    
    // array of lines separated by the newline
    var lines = objectData.split( '\n' )
    for( var i=0; i<lines.length; i++ ){

       lines[i] = lines[i].replace(/\s{2,}/g, " "); // remove double spaces

      // if this is a vertex
      if( lines[ i ].startsWith( 'v ' ) ){
        line = lines[ i ].slice( 2 ).split( " " )
        verts.push( line[ 0 ] , line[1], line[2]);
        //verts.push( line[ 0 ] );
        //verts.push( line[ 1 ] );
        //verts.push( line[ 2 ] );
		n.push(0,0,0);

      }
      // if this is a vertex normal
      else if( lines[ i ].startsWith( 'vn' ) ){
        line = lines[ i ].slice( 2 ).split( " " )
        //norms.push( line[ 0 ] );
        //norms.push( line[ 1 ] );
        //norms.push( line[ 2 ] );

		//vnyn = 0;
      }
      // if this is a texture
      else if( lines[ i ].startsWith( 'vt' ) ){
        line = lines[ i ].slice( 2 ).split( " " )
		texcords.push(line[1] , line[2]); 
		//texcords.push(line[1] ); 
		//texcords.push(line[2] ); 
		texyn = 1;

//		 console.log("texcords are here: "+line[1]+", "+line[2]);
	  }
      // if this is a face
      else if( lines[ i ].startsWith( 'f ' ) ){
        line = lines[ i ].slice( 2 ).split( " " );
        for(var j=1; j <= line.length-2; j++){
            var i1 = line[0].split('/')[0] - 1;
            var i2 = line[j].split('/')[0] - 1;
            var i3 = line[j+1].split('/')[0] - 1;
            packed.indices.push(i1,i2,i3);

			var rv = [];
			}
        }
    }

	this.vertices = verts;
	this.indices = packed.indices;
	this.indicesC = packed.indices;
	this.texcords  = texcords;
	this.texPos  = texcords;


	this.max = [];
	this.min = [];
	this.centroid =  [];
	//this.centroid =  [cx,cy,cz];
	//this.VS = [];
	//this.NS = [];
	//this.TP = [];
	//this.length = 0;
	//this.NYN = vnyn;

	this.norml = n;




	if( texyn == 1)
	{
		console.log("                                               texcords are here");
		this.texcords = texcords;
		this.texPos = texcords;
	}
	else
	{
		this.texcords = null;
		this.texPos = null;
	}
}


modelLoader.sphere = function( rad )
{

	var vert = [];
	var indces = [];
	var nrm = [];
	var tex = [];
	var pi = Math.PI;

	var latitudeBands = 30;
	var longitudeBands = 30;
	var radius = rad;

	var min = [9000, 9000,9000];
	var max = [-9000, -9000, -9000];

	var cnt = 0;

	var vx;
	var vy;
	var vz;

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

			var vx = (parseFloat(radius*x));
			var vy = (parseFloat(radius*y));
			var vz = (parseFloat(radius*z));


			vert.push(radius*x);
			vert.push(radius*y);
			vert.push(radius*z);
		
			if(vx < min[0]) min[0] = vx;
			if(vy < min[1]) min[1] = vy;
			if(vz < min[2]) min[2] = vz;
			if(vx > max[0]) max[0] = vx;
			if(vy > max[1]) max[1] = vy;
			if(vz > max[2]) max[2] = vz;
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


	var s = Math.max( Math.abs(min[0]-max[0]),
			Math.abs(min[1]-max[1]),
			Math.abs(min[2]-max[2]))

	var d = (s/2.0)/Math.tan(45/2.0);

	this.camdist = d;
	
	var cx = (min[0] + max[0])/2;
	var cy = (min[1] + max[1])/2;
	var cz = (min[2] + max[2])/2;

	this.verticesC = vert;
	this.indicesC = indces;
	this.normalsC = nrm;
	this.texPos = tex;
	this.texPosC = tex;
	
	this.VYN = 1;
	this.vertices = vert;
	this.indices = indces;
	this.norml = nrm;
	this.min = min;
	this.max = max;;
	this.centroid =  [cx,cy,cz];
}

modelLoader.cube = function( size )
{

	var lim = size/2;


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

	
	var verts = 
	[
		-0.500000, -0.500000, 0.500000,
		0.500000, -0.500000, 0.500000,
		-0.500000, 0.500000, 0.500000,
		0.500000, 0.500000, 0.500000,
		-0.500000, 0.500000, -0.500000,
		0.500000, 0.500000, -0.500000,
		-0.500000, -0.500000, -0.500000,
		0.500000, -0.500000, -0.500000
	];
	
/*
	var verts = 
	[
		-lim, -lim, lim,
		lim, -lim, lim,
		-lim, lim, lim,
		lim, lim, lim,
		-lim, lim, -lim,
		lim, lim, -lim,
		-lim, -lim, -lim,
		lim, -lim, -lim
	];
*/

	var indices = 
	[
		//s 1
		1, 2, 3,
		3, 2, 4,
		//s 2
		3, 4, 5,
		5, 4, 6,
		//s 3
		5, 6, 7,
		7, 6, 8,
		//s 4
		7, 8, 1,
		1, 8, 2,
		//s 5
		2, 8, 4,
		4, 8, 6,
		//s 6
		7, 1, 5,
		5, 1, 3
	];

	var n = [];
	var cnt = 0;


	for( var i = 0; i < indices.length ; i += 3)
	{

		var i1 = indices[i+0];
		var i2 = indices[i+1];
		var i3 = indices[i+2];

		var rv = CalcNorm( i1,i2,i3,verts);
		var l = Vector3fLength(rv);

		rv[0] = rv[0];
		rv[1] = rv[1];
		rv[2] = rv[2];

		n[ i1*3+0 ] += rv[0];
		n[ i1*3+1 ] += rv[1];
		n[ i1*3+2 ] += rv[2];

		n[ i2*3+0 ] += rv[0];
		n[ i2*3+1 ] += rv[1];
		n[ i2*3+2 ] += rv[2];

		n[ i3*3+0 ] += rv[0];
		n[ i3*3+1 ] += rv[1];
		n[ i3*3+2 ] += rv[2];
		cnt = i;
	}



	var min = [-.5, -.5,  -.5];
	var max = [ .5,  .5,   .5];

	var cx = (min[0] + max[0])/2;
	var cy = (min[1] + max[1])/2;
	var cz = (min[2] + max[2])/2;


	this.vertices = verts;
	this.indices = indices;
	this.norml = n;
	this.texcords = texPos;
	this.texPos = texPos;
	this.min = min;
	this.max = max;;
	this.VYN = 1;
	this.centroid =  [cx,cy,cz];

	Prntr("this indices: "+this.indices[0]+" "+this.indices[1]+ " "+this.indices[2]);
	Prntr("this texPos: "+this.texPos[0]+" "+this.texPos[1]+ " "+this.texPos[2]);
	Prntr("the centroid of this cube: "+cx+" "+cy+ " "+cz);
	Prntr("the min of this cube: "+min[0]+" "+min[1]+ " "+min[2]);
	Prntr("the max of this cube: "+max[0]+" "+max[1]+ " "+max[2]);


}
