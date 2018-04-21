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

	gs.cubesize = argv[1];


	//use the mesh object to initialize the graphics state
	gs.vertices = mesh->vertices;
	gs.BB = mesh->BB;;
	gs.centroid = mesh->centroid;
	gs.triangles = mesh->triangles;
	gs.ntri = mesh->ntri;
	gs.nvert = mesh->nvert;

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
	printf("usage: cubedriver cubesize");
	exit(0);
}


return 0;
}
