#ifndef JMESH
#define JMESH

#include <stdio.h>

typedef struct {
	int nvert;
	int ntri;
	float * vertices;
	float * normals;
	int * triangles;	
	float * BB;		//bounding box
	float * centroid;;
	float * dim;
	char * input;
} jmesh;


/* return value: pointer to jmesh upon success, NULL upon failure*/
jmesh * new_jmesh(FILE *fp);
void free_mesh(jmesh * jm);


#endif



