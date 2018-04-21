/* hello.c */
//#include "gheader.h"


#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdarg.h>
//i#include <GL/glut.h>
#include "utils.h"
//#include "printers.h"


int 
main(int argc, char **argv)
{
  graphics_state gs;

  gs.height=512;
  gs.width =512;

  char height[4] = {'5','1','2', '\n'};
  char width[4] = {'5','1','2', ' '};


  gs.H = height;
  gs.W = width;

  /* check for command line arguments */
  if(argc != 2){
    printf("Usage: executable cubesize\n");
    exit(1);
  }

	printf("cube size is %f\n", gs.cubesize);

  gs.cubesize = strtod(argv[1], NULL);
	printf("cube size is %f\n", gs.cubesize);
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

  return 0;
}
