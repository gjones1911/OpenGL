/*Will load the given mesh file into the created graphics state and then initalize a gl window */
#include <stdio.h>
#include <stdlib.h>
#include "offreader.h"
#include "utils.h"
#include "/home/gjones2/cs456/libs/my.h"
#include "jmesh.h"
int
main(int argc, char ** argv)
{
	graphics_state gs;
	gs.height=512;
	gs.width =512;

	int cube_today = 0;
	//if given no arguments read from stdin, used to use the < operator in unix to read files 
	if(argc == 1)
	{
		
		jmesh * mesh;

		mesh = new_jmesh(stdin);
		if (mesh == NULL)
		{
			fprintf(stderr,"load_off_mesh failed\n");
			exit(-2);
		}



	}
	//if there are 2 arguments the second should be the name of the object file to read or the size of 
	//the cube to make
	else if(argc == 2)
	{
		FILE * fp = fopen( argv[1], "r");

		if( fp == NULL)
		{
			printf("Are we making a cube today? y/n\n");
			fscanf(stdin,"%s",str);
			if(strcmp(str,"y") == 0 )
			{
				cube_today = 1;
				gs.cubesize = argv[1];
			}
			else
			{
				printf("Problem opening file %s:usage ./meshdriver off_file.off\n",argv[1]);
				exit(-1);
			}
		}

		jmesh * mesh;

		mesh = new_jmesh(fp);
		if (mesh == NULL)
		{
			fprintf(stderr,"load_off_mesh failed\n");
			exit(-2);
		}
	}
		
		//use the mesh object to initialize the graphics state
		gs.vertices = mesh->vertices;
		gs.BB = mesh->BB;;
		gs.centroid = mesh->centroid;
		gs.triangles = mesh->triangles;
		gs.ntri = mesh->ntri;
		gs.nvert = mesh->nvert;
		
		if(cube_today == 0)
		{
			gs.cubesize = 0;
			gs.input = argv[1];
		}
		else
		{
			gs.input = NULL;
		}
		
		print_howto();

		{ /* GLUT initialization */
			glutInit(&argc,argv);
			glutInitDisplayMode(GLUT_RGB | GLUT_ALPHA);
			glutInitWindowSize(gs.width,gs.height);
			glutInitWindowPosition(100,100);
			glutCreateWindow(argv[0]);

			glutDisplayFunc(display);
			glutReshapeFunc(reshape);

			glutKeyboardFunc(keys);
			glutMouseFunc(mouse_handler);
			glutMotionFunc(trackMotion);

		}

		init(&gs);

		glutMainLoop();

		free_mesh(mesh);
	}
	else
	{
		printf("usage: meshdriver or..\nmeshdriver inputfile or..\nmeshdriver object_dimensions");
		exit(0);
	}


	return 0;
}
