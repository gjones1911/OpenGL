
var MeshArray = [];
var dataArray = [];

var counter = 0;

var numOobjects = 0;
var dosphere = 0;
var radius;

var files = [];

var checkArray = [36, 44454];

var currentTry = null;

var amIGood = 0;
var newI = 0;
//this loades the object file in filename into data and then calls processMesh if it worked
function executeMainLoop(filenames)
{
	//if(num) radius = num;
	files = filenames;


	numOobjects = filenames.length;
	
	//var lock = 0;
	//var nmb = 0;
	

	for(var i = 0; i < filenames.length; i++)
	{ 

		lock = counter;
		nmb = counter;
			//jQuery ajax call to load the .obj file from the local directory
			$.ajax({
				//url:"./"+filename,
				//url:"./cubeA.obj",
				//url:"./cubeB.obj",
				url:"./"+filenames[i],
				success:processMesh // --- call the function "processMesh" when the .obj is loaded
			});
		console.log("IM BACK!!");
		
	}

	//MeshArray.push("did it");
//	console.log("Making jkjkthe Demo!!!");

//	CreateDemo(MeshArray);

	return MeshArray;
}



function retryLoad(file)
{
			$.ajax({
				//url:"./"+filename,
				//url:"./cubeA.obj",
				//url:"./cubeB.obj",
				url:"./"+file,
				success:processMesh // --- call the function "processMesh" when the .obj is loaded
			});
		console.log("TRIED AGAIN");

}

var ldata;

function sleep( sec )
{
	msec = sec*1000;

	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) >= msec){
			break;
		}
	}
}

var old_num = -1;

var trycnt = 0;

//function to load the mesh and setup the opengl rendering demo
function processMesh(data){
	
	

	if(data.target != undefined){
		var mesh = {model: new modelLoader.Mesh(data.target.result)}
	} else {
		var mesh = {model: new modelLoader.Mesh(data)}
	}
	
	mesh.number = counter;
	console.log("number of objects is  "+numOobjects);
	console.log("Mesh indices length is "+mesh.model.indices.length);
	//Prntr("My mesh number is :"+mesh.number);
	Prntr("check 0 "+checkArray[0]);	
	Prntr("check 1 "+checkArray[1]);	
	//MeshArray[counter] = mesh;
	if(mesh.model.indices.length == checkArray[0] && counter < 1)
	{
		MeshArray.push(mesh);
		dataArray.push(data);
		console.log("counter is "+counter);
		counter++;
		console.log("counter is now "+counter);
	}
//	else if(mesh.model.indices.length == checkArray[0] && counter > 1)
//	{
//			MeshArray[0] = mesh;
//			dataArray[0] = data;
//			counter = 1;
//	}
	else if(counter == 1 && mesh.model.indices.length == checkArray[1] )//&& counter == 1)
	{
		MeshArray.push(mesh);
		dataArray.push(data);
		console.log("counter is "+counter);
		if(mesh.model.vertices) counter++;
		console.log("counter is now "+counter);
	}
//	else if(counter == 1 && trycnt < 10)
//	{
//		Prntr("trying to load file "+files[1]);
//		retryLoad(files[1] );
//		trycnt++;
//	}
	//else if(mesh.model.indices.length == 44454 && counter < numOobjects)
	//{
	//	Prntr("in the backup");
	//	MeshArray[1] = mesh;
	//	dataArray[1] = data;
	//	counter = 2;
//	}
	//else 
//	{
//		trycnt++;
//
//		Prntr("tiirying again for the "+trycnt+" time and counter "+counter); 
//		//processMesh(data);
//	
//	    return;
//		
//	}	
	
	if( counter == (numOobjects) )
	{

		console.log("9Making jkjkthe Demo!!!");

		CreateDemo(MeshArray);
		//CreateDemo(dataArray);

	}

	/*
	//create a new model viewing demo
	var myDemo = new demo("glcanvas",mesh, lmesh);

	//loadMesh("bunny.obj");

	//demoLoader( myDemo );

    //setup the webgl context and initialize everything
    myDemo.init();

    //enter the event driven loop; ---- demo.js
    myDemo.MainLoop();
	*/
}


function CreateDemo( meshArray )
//function CreateDemo( dataArray )
{

    //create a new model viewing demo
    var myDemo = new demo("glcanvas",meshArray);
    //var myDemo = new demo("glcanvas",dataArray);



    //setup the webgl context and initialize everything
    myDemo.init();

    //enter the event driven loop; ---- demo.js
    myDemo.MainLoop();
}


function setupLoadingCallbacks(){
    //handles when another mesh is selected via the dropdown
    $("#meshSelect").change(function(){
        $("select option:selected").each(function(){
            filename = $(this).text(); // grab the filename from the selection
            $.ajax({
                //url:"./"+filename,
				//url:"./cubeA.obj",
				url:"./cubeB.obj",
                success:processMesh// --- call the function "processMesh" when the .obj is loaded
            });
        });
    });


    //handles when user uploads a file
    $("#files").change(function(evt){
        var objFile = evt.target.files[0];
        var reader = new FileReader();

        //set a callback for when the file is finished uploading
        reader.onload = processMesh;

        //tell the reader to load the file as a text file
        reader.readAsText(objFile);
    });

}
