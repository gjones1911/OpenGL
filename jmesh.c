//#include "jmesh.h"
#include "offreader.h"


jmesh * 
new_jmesh(FILE * fp)
{
   jmesh * jm;

   jm = (jmesh *)malloc(sizeof(jmesh));


	jm->nvert = 0;
	jm->ntri = 0;

   load_off_mesh(fp, jm);

   return jm;
}


void free_mesh(jmesh * jm)
{
	free(jm);
}


