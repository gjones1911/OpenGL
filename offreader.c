//used to read and process a given off file and will store the:
//Bounding box, Centroid

#include "offreader.h"
//#include "jmesh.h"

#include <stdio.h>
#include <GL/glut.h>
#include <string.h>
#include <stdlib.h>

//used for printing various information
const int pnt = 0;

float * getdim(float * BB)
{
	float * dimAry = malloc( sizeof( float ) * 3);

	dimAry[0] = fabs(BB[1]) + fabs(BB[0]);
	dimAry[1] = fabs(BB[3]) + fabs(BB[2]);
	dimAry[2] = fabs(BB[5]) + fabs(BB[4]);

	return dimAry;
}



void get_normals( float * normals, int * triangles, float * verts,int ntri);

//will get The X,Y or Z portions of the given vertex array{fla)
//use int XYZ to select: X = 0, Y = 1, Z = 2
float *  get012( float fla[], int size, int XYZ, float * rtn )
{
	int i;

	rtn = malloc( sizeof( float ) * size );

	if( XYZ != 0 && XYZ != 1 && XYZ != 2)
	{
		printf("usage: get012( array, size, o = x, 1 = y, 2 = z)\n");
		exit(-1);
	}
	else
	{

		for( i = 0; i < size/3 ; i++)
		{
			rtn[i] = fla[i*3 + XYZ];
		}

	}

	return rtn;
}




//Used to print a given vector in pointer long form
void printVEC( char * name, float * arr , int size, int typ)
{
	int i = 0;


	if( typ == 0 )
	{
		for( i = 0; i < size; i++)
		{
			printf("%d: %f\n", i, arr[i]);
		}
	}
	else if( typ == 1 )
	{
		for( i = 0; i < size; i++)
		{
			printf("%c %d: %f\n",name[i%3], i, arr[i]);

			if( i > 0 && i % 3 == 0)
			{
				printf("\n");
			}
		}

	}
	else if( typ == 2 )
	{
		for( i = 0; i < size; i++)
		{
			printf("%s %d: %f\n",name, i, arr[i]);
		}

	}
}


//used to get the center point between the given max and min points
float getCnter( float  min, float max)
{
	printf("min = %f, max = %f\n", min, max);
	float  diff = fabs( max ) - fabs( min);

	printf("diff = %f, min + diff/2 = %f\n", diff,min+(diff/2) );

	if( diff > 0)
	{
		return (min + (diff/2) );
	}
	else
	{
		return diff;
	}
}

//will calculate the average of the numbers in the given array
float getavg( float farry[], int size)
{
	int i = 0, j = 0;
	float  sum = 0, sz = (float) size;


	for(i = 0; i < size ; i++)
	{
		sum += farry[i];
	}

	return sum / sz;
}


//will calculatr the dot product of the twe given vectors
float * get_dot_prod3D( float u[], float v[], float * rtn)
{
	float fl[3];

	rtn[0] = u[1]*v[2] - u[2]*v[1];
	rtn[1] = u[2]*v[0] - u[0]*v[2];
	rtn[2] = u[0]*v[1] - u[1]*v[0];

	return rtn;
}

//will calculater the normal of the triangle described by 
//vertices V1, V2, and V3
float * get_normal3D(float v1[], float v2[], float v3[] )
{
	float u[3];
	float v[3];

	float * rtn;

	u[0] = v2[0] - v1[0];
	u[1] = v2[1] - v1[1];
	u[2] = v2[2] - v1[2];

	v[0] = v3[0] - v1[0];
	v[1] = v3[1] - v1[1];
	v[2] = v3[2] - v1[2];

	rtn =  get_dot_prod3D(u, v, rtn);
	return rtn;
}

//wiill return the minimum of the array given
float Flmin(float arr[] , int size)
{
	int i = 0;

	float min = arr[0];

	for( i = 0; i < size; i++)
	{
		if( arr[i] < min)
		{
			min = arr[i];
		}
	}

	return min;;
}


//wiill return the maximmum of the array given
float Flmax(float arr[] , int size)
{
	int i = 0;

	float max = arr[0];

	for( i = 0; i < size; i++)
	{
		if( arr[i] > max)
		{
			max = arr[i];
		}
	}

	return max;
}

//calculates the bounding box of the object described by the vector array 
//given. use verbose to print this to the screen;
//verbose = 2, to print, any other value will not
float * getBoundingBox( float vecAry[], int size,  float * BB, int verbose)
{
	int i = 0, num = size/3;

	float x = 0, y = 0, z = 0;

	float * xarr;
	float * yarr;
	float * zarr;


	xarr = get012( vecAry, size, 0, xarr);
	yarr = get012( vecAry, size, 1, yarr);
	zarr = get012( vecAry, size, 2, zarr);

	float xminmx[2];
	float yminmx[2];
	float zminmx[2];

	BB = malloc( sizeof( float ) * 6);

	BB[0] = Flmin(xarr, num);
	BB[1] = Flmax(xarr,num);
	BB[2] = Flmin(yarr, num);
	BB[3] = Flmax(yarr,num);
	BB[4] = Flmin(zarr, num);
	BB[5] = Flmax(zarr,num);


	if( verbose == 2)
	{
		printf("The bounding box is...\n");
		printf("\nxmin/max = %f,%f\n",BB[0], BB[1]);
		printf("\nymin/max = %f,%f\n",BB[2], BB[3]);
		printf("\nzmin/max = %f,%f\n",BB[4], BB[5]);
	}

	return BB;


}

//will calculate the centroid of the object described by the given vector array
//you must pass it the pointer you want this stored in. 
//Verbose = 1, to just print the centroid
//Verbose = 2 to print the centroid and the bounding box
//Verbose = 0 to not print
float * getCentroid( float vecAry[], int size, float * centroid, int verbose)
{
	centroid = malloc( sizeof(float) * 3 );

	int i = 0, num = size/3;

	float * BB;
	BB = getBoundingBox( vecAry,size ,BB, verbose);


	float xminmx[2];
	float yminmx[2];
	float zminmx[2];

	xminmx[0] = BB[0];
	xminmx[1] = BB[1];

	yminmx[0] = BB[2];
	yminmx[1] = BB[3];

	zminmx[0] = BB[4];
	zminmx[1] = BB[5];

	centroid[0] = getavg(xminmx, 2);
	centroid[1] = getavg(yminmx, 2);
	centroid[2] = getavg(zminmx, 2);

	char xyz[4] = {'X','Y','Z','\0'};

	if(verbose > 0)
	{
		printf("\nThe Centroid is...\n");

		float xyzav[3];
		xyzav[0] = centroid[0];
		xyzav[1] = centroid[1];
		xyzav[2] = centroid[2];

		printVEC( xyz, xyzav, 3, 1);
	}

	return centroid;

}



//will load the .off file pointed to by fp into the given jmesh object
int load_off_mesh(FILE * fp , jmesh * jm)
{
	int i = 0, j = 0, k, nedges, cnt = 0, num = 0;


	int type = 0;

	char str[80];

	//get the off signifier
	if( fscanf(fp,"%s", str) == EOF)
	{
		fprintf(stderr,"error reading off\n");
		return -1;
	}

	if( strcmp( str, "OFF") == 0)
	{
		printf("it is an off file\n");
		type = 0;
	}
	else if( strcmp( str, "PLY") == 0)
	{
		printf("it is an PLY file\n");
		type = 1;
	}
	else if( strcmp( str, "OBJ") == 0)
	{
		printf("it is an OBJ file\n");
		type = 2;
	}
	else 
	{
		printf("unknown file format\n");
		exit(-2);
	}


	//process off file
	if(type == 0)
	{

		//GET THE NUMBER OF VERTS, AND THE NUMBER OF TRIANGLES, AND NUMBER OF EDGES
		int num_fc = 0;

		fscanf(fp, "%d %d %d", &jm->nvert, &num_fc, &nedges);

		
		int * fvert = malloc( sizeof( int ) * 4);

		int tricnt = 0;

		int lim = jm->ntri * 3;

		int c = 0, nm;

		char ch = 0;

		jm->vertices = malloc( sizeof(float) *jm->nvert*3);

		//used as a buffer to store the triangle cordinates
		int * i_buff = malloc( sizeof(int) * num_fc * 3 * 2);

		int buff[jm->ntri*2*3];

		int fc = 0;

		//get the vertex array
		for(cnt = 0; cnt < jm->nvert*3 ; cnt++)
		{
			fscanf(fp,"%f",jm->vertices + cnt);
		}


		//show the vertex array

		if(pnt)
		{
			for( i = 0; i < jm->nvert*3 ; i++)
			{
				printf("jm->vert + %d = %f\n", i, jm->vertices[i]);
			}

		}

		cnt = 0;

		int tnm = 0, end = 2;

		for(fc = 0; fc < num_fc; fc++ )
		{ 
			tnm = 0;

			//get amount to read vertices numbers to read
			fscanf(fp,"%d", &num); 	

			if( num == 3)
			{
				for( j = 0; j < num ; j++)
				{
					fscanf( fp, "%d",i_buff + cnt); 
					cnt++;
				}

				tricnt++;

				printf("cnt is %d\n",cnt);

				end = 2;

				c = 0;

				//now read until you get another number or a newspace
				while( c != '\n' && end != 0)
				{
					end = fread( &c, 1, sizeof( char ), fp);
					//			printf("just got %c\n", c);

					if( end == 0)
					{
						//				printf("found EOF\n");;
					}

				}

			}
			//designed in an attempt to turn all shapes into triangles
			else
			{

				for( j = 0; j < num ; j++)
				{
					fscanf(fp,"%d", fvert + j);
					//			printf("it is %d\n", *(fvert + j) );
				}

				nm = 0;

				//get one triangle
				for(nm = 0; nm < 3 ; nm++)
				{

					i_buff[cnt] = fvert[nm];

					cnt++;

				}

				tricnt++;

				nm--;

				//get another triangle
				for(nm ; nm < 5 ; nm++)
				{
					i_buff[ cnt ] = fvert[nm%4];
					cnt++;
				}

				tricnt++;

				nm--;

				end = 2;
				c = 0;



				while( c != '\n' && end != 0)
				{
					end = fread( &c, 1, sizeof( char ), fp);

					if( end == 0)
					{
					}

				}

			}
		}

		if(pnt)printf("C_cnt is total  %d\n", cnt);


		jm->ntri = tricnt;

		jm->triangles = malloc( sizeof(int) * cnt);

		//store the triangles
		for( i = 0 ; i < cnt ; i++)
		{
			jm->triangles[i] = i_buff[i];
		}


		if(pnt)
		{
			printf("the triangles are......\n");
			for( i = 0 ; i < cnt ; i++)
			{
				printf("jm->triangles[%d] = %d\n", i,jm->triangles[i]);
			}
		}

		if(pnt)
		{
			for( i = 0 ; i < jm->nvert ; i++)
			{
				printf("\nvertice[%d] is....\n", i);
				printf("vertices[%d]_X = %d\n", i,jm->triangles[i*3 + 0]);
				printf("vertices[%d]_Y = %d\n", i,jm->triangles[i*3 + 1]);
				printf("vertices[%d]_Z = %d\n", i,jm->triangles[i*3 + 2]);
			}
		}

		if(pnt)
		{
			for( i = 0 ; i < tricnt ; i++)
			{
				printf("\ntriangles[%d] is ...\n", i);
				printf("V1 = %d\n",jm->triangles[i*3 + 0]);
				printf("V2 = %d\n",jm->triangles[i*3 + 1]);
				printf("V3 = %d\n",jm->triangles[i*3 + 2]);
			}
		}
		
		printf("--The number of vertices is %d\n", jm->nvert);
		printf("--The number of triangles  is %d\n", jm->ntri);

		int sz = jm->nvert;


		//calculate the bounding box and centroid of this object
		jm->BB = getBoundingBox( jm->vertices, jm->nvert*3, BB, 0);

		jm->dim = getdim(jm->BB);

		printf("The dimensions are %fx%fx%f\n", jm->dim[0], jm->dim[1], jm->dim[2]);

		jm->centroid = getCentroid( jm->vertices, jm->nvert*3, centroid, 2);
		
		if( pnt )
		{
		   printf("the bounding box is ...\n");
		   printf("\nxmin/max = %f,%f\n",jm->BB[0], jm->BB[1]);
		   printf("\nymin/max = %f,%f\n",jm->BB[2], jm->BB[3]);
		   printf("\nzmin/max = %f,%f\n",jm->BB[4], jm->BB[5]);
		}

		if(pnt)
		{
		   printf("the centroid is ...\n");
		   printf("\ncenter X: = %f\n",jm->centroid[0]);
		   printf("\ncenter Y: = %f\n",jm->centroid[1]);
		   printf("\ncenter Z: = %f\n",jm->centroid[2]);
			
		}

		//the below shows the x y and z individually
		if( pnt )
		{
		   printf("\n\nx:...\n");
		   printVEC(xarr, jm->nvert);
		   printf("y:...\n");
		   printVEC(yarr, jm->nvert);
		   printf("z:...\n");
		   printVEC(zarr, jm->nvert);
		}

	}
	return nedges;

}

void get_normals( float * normals, int * triangles, float * verts,int ntri)
{

	float vx1,vy1,vz1,
		  vx2, vy2,vz2,
		  vx3, vy3,vz3;

	int  i, cnt = 0, V1, V2, V3, pnt = 0;

	float X,Y,Z;

	float V[3], U[3];

	float f_buff[ntri*3];

	normals = malloc( sizeof( float ) * ntri * 3);


	for(i = 0; i < ntri ; i++)
	{

		V1 = triangles[i*3 + 0];
		V2 = triangles[i*3 + 1];
		V3 = triangles[i*3 + 2];

		if( pnt )printf("\nTri_%d: V1 = %d , V2 = %d, V3 = %d\n",i, V1,V2,V3);

		vx1 = verts[V1*3 + 0];
		vy1 = verts[V1*3 + 1];
		vz1 = verts[V1*3 + 2];

		if( pnt ) printf("\nvx1 = %f , vy1 = %f, vz1 = %f\n", vx1,vy1,vz1);

		vx2 = verts[V2*3 + 0];
		vy2 = verts[V2*3 + 1];
		vz2 = verts[V2*3 + 2];

		if(pnt) printf("\nvx2 = %f , vy2 = %f, vz2 = %f\n", vx2,vy2,vz2);

		vx3 = verts[V3*3 + 0];
		vy3 = verts[V3*3 + 1];
		vz3 = verts[V3*3 + 2];

		if(pnt) printf("\nvx3 = %f , vy3 = %f, vz3 = %f\n", vx3,vy3,vz3);

		V[0] = vx2 - vx1;

		if(pnt) printf("\nvx2 - vx1 = %f -%f = %f\n", vx2,vx1,vx2-vx1);

		V[1] = vy2 - vy1;

		if(pnt) printf("\nvy2 - vy1 = %f -%f = %f\n", vy2,vy1,vy2-vy1);

		V[2] = vz2  -vz1;

		if(pnt) printf("\nvz2 - vz1 = %f -%f = %f\n", vz2,vz1,vz2-vz1);


		U[0] = vx3 - vx1;

		if(pnt) printf("\nvx3 - vx1 = %f -%f = %f\n", vx3,vx1,vx3-vx1);

		U[1] = vy3 - vy1;

		if(pnt) printf("\nvy3 - vy1 = %f -%f = %f\n", vy3,vy1,vy3-vy1);

		U[2] = vz3 - vz1;

		if(pnt) printf("\nvz3 - vz1 = %f -%f = %f\n", vz3,vz1,vz3-vz1);


		X = ( U[1]*V[2] - U[2]*V[1]);

		if(pnt) printf("\nU[1] * V[2] = %.3f, U[2]*V[1] = %.3f, A-B = %.3f \n",U[1]*V[2], U[2]*V[1],(U[1]*V[2]) - (U[2]*V[1]) );

		Y = ( U[2]*V[0] - U[0]*V[2]);

		if(pnt) printf("\nU[2] * V[0] = %.3f, U[0]*V[2] = %.3f, A-B = %.3f \n",U[2]*V[0], U[0]*V[2],(U[2]*V[0]) - (U[0]*V[2]) );

		Z = ( U[0]*V[1] - U[1]*V[0]);

		if(pnt) printf("\nU[0] * V[1] = %.3f, U[1]*V[0] = %.3f, A-B = %.3f \n",U[0]*V[1], U[1]*V[0],(U[0]*V[1]) - (U[1]*V[0]) );

		printf("\nthe normals for triangle %d are.....\n",i);

		normals[cnt] = X;

		printf("%dnormals[%d] = %f\n", i,cnt ,normals[cnt]);
		cnt++;

		normals[cnt] = Y;
		printf("%dnormals[%d] = %f\n", i,cnt ,normals[cnt]);
		cnt++;

		normals[cnt] = Z;
		printf("%dnormals[%d] = %f\n",i, cnt ,normals[cnt]);
		cnt++;

	}


}

//used to skip the rest of the line if needed
void skipRestLine( FILE * fp)
{
	int c, end, uint;

	float fl32;

	printf("skipping the rest of this line\n");

	while( ( c != '\n' || c != '\r') && end != 0)
	{
		end = fread( &c, 1, sizeof( char ), fp);

		if( end == 0)
		{
			printf("found EOF\n");;
		}

	}
}


//will be used to process PLY files
/*
   void processPLY( FILE * fp, jmesh jm)
   {

   char str[90];

   while( fscanf( fp, "%s",str) )
   {
   if( strcmp( str, "format" ) == 0 )
   {
   fscanf( fp, "%s", str);

   if( strcmp( str, "ascii") == 0)
   {
   printf("its ascii format\n");
   }
   else if( strcmp( str, "binary") == 0)
   {
   printf("its binary format\n");
   }
   else
   {
   printf("BAD FORMAT LINE\n");
   exit(-3);
   }

   fscanf( fp, "%f", &fl32);

   printf("version %.1f\n", fl32);


   }
   else if( strcmp( str, "comment" ) == 0 )
   {
   skipRestLine(fp);
   }
   else if( strcmp( str, "element" ) == 0 )
   {
   fscanf( fp, "%s", str);


   if( strcmp( str, "vertex") == 0)
   {
   printf("its ascii format\n");

   fscanf( fp "%s", str);

   while( strcmp( str, "property") == 0)
   {

   fscanf( fp "%s", str);

   if( strcmp(str,"float32") == 0)
   {
   fscanf( fp "%s", str);

   if( strcmp(str,"x") == 0)
   {

   }
   else if( strcmp(str,"y") == 0)
   {

   }
   else if( strcmp(str,"z") == 0)
   {

   }

   }
   if( strcmp(str,"uint8") == 0)
{
	fscanf( fp "%s", str);

	if( strcmp(str,"x") == 0)
	{

	}
	else if( strcmp(str,"y") == 0)
	{

	}
	else if( strcmp(str,"z") == 0)
	{

	}
}
else if( strcmp(str,"red") == 0)
{
	fscanf( fp "%s", str);
	if( strcmp(str,"uint8") == 0)
	{
	}
	else if( strcmp(str,"float32") == 0)
	{
	}


}
else if( strcmp(str,"green") == 0)
{
	fscanf( fp "%s", str);
	if( strcmp(str,"uint8") == 0)
	{
	}
	else if( strcmp(str,"float32") == 0)
	{
	}

}
else if( strcmp(str,"blue") == 0)
{
	fscanf( fp "%s", str);
	if( strcmp(str,"uint8") == 0)
	{
	}
	else if( strcmp(str,"float32") == 0)
	{
	}


}

}

}
else if( strcmp( str, "face") == 0)
{
	printf("its binary format\n");
}
else if( strcmp( str, "edge") == 0)
{
	printf("its binary format\n");
}
else
{
	printf("Need to make a new element\n");
	exit(-3);
}
}
else if( strcmp( str, "property" ) == 0 )
{

}
else if( strcmp( str, "end_header" ) == 0 )
{

}

}

}
*/






