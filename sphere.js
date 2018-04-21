
sphere = function(GC , rad)
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

	GC.vertices = vert;
	GC.indices = indces;
	GC.normalsl = nrm;
	GC.texPosB = tex; 


}



