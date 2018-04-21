
#include <stdio.h>
#include <stdlib.h>
#include "offreader.h"
#include "/home/gjones2/cs456/libs/my.h"
int
main(void)
{
  
	char  mystr[] = {"1234\0"};

	printstr(mystr);

	jmesh * mesh;

	mesh = new_jmesh(stdin);
	if (mesh == NULL)
		fprintf(stderr,"load_off_mesh failed\n");

	free_mesh(mesh);
	return 0;
}
