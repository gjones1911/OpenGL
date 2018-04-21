
var MeshArray = [];

var counter = 0;

var numOobjects = 0;
var dosphere = 0;
var radius;

//this loades the object file in filename into data and then calls processMesh if it worked
function executeMainLoop(filenames, num)
{
	//if(num) radius = num;


	numOobjects = filenames.length;
	console.log("number of objects is  "+numOobjects);
	
	var lock = 0;
	var nmb = 0;
	

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
		//while( nmb <= lock)
	//	{
	//		nmb = counter;
	//	}
		console.log("IM BACK!!");
		sleep(5);
		console.log("doneSleeping!!");
		console.log("9Making jkjkthe Demo!!!");

		//counter++;
	}

	//MeshArray.push("did it");
//	console.log("Making jkjkthe Demo!!!");

//	CreateDemo(MeshArray);

	num++

	return MeshArray;
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


//function to load the mesh and setup the opengl rendering demo
function processMesh(data){
 d = new $.Deferred();
	if(data.target != undefined){
		var mesh = {model: new modelLoader.Mesh(data.target.result)}
	} else {
		var mesh = {model: new modelLoader.Mesh(data)}
	}

	mesh.number = counter;
	console.log("its idc l "+mesh.model.indices.length);
	//MeshArray[counter] = mesh;
	MeshArray.push(mesh);

	console.log("counter is "+counter);
	counter++;
	console.log("counter is now "+counter);

	if( counter == (numOobjects) )
	{
		console.log("9Making jkjkthe Demo!!!");

		CreateDemo(MeshArray);

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
{

    //create a new model viewing demo
    var myDemo = new demo("glcanvas",meshArray);



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
