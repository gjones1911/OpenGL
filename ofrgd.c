#include "offreader.h"
//#include "jmesh.h"
#include <stdio.h>
#include <GL/glut.h>
#include <string.h>
#include <stdlib.h>
#include "/home/gjones2/Gutil/gmath.h"



void get_normals( float * normals, int * triangles, float * verts,int ntri);


int load_off_mesh(FILE * fp , jmesh * jm)
{
	int i = 0, j = 0, k, nedges, cnt = 0, num = 0;

	//	string OFF;

	int type = 0;

	char str[80];

	//get the off signifier
	if( fscanf(fp,"%s", str) == EOF)
	{
		fprintf(stderr,"error reading off\n");
		return -1;
	}

	printf("just got the %s\n", str );

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

	//exit(0);

	if(type == 0)
	{

		//GET THE NUMBER OF VERTS, AND THE NUMBER OF TRIANGLES, AND NUMBER OF EDGES
		int num_fc = 0;

		fscanf(fp, "%d %d %d", &jm->nvert, &num_fc, &nedges);




		//printf("just got nvert = %d, ntri = %d, nedges = %d\n", jm->nvert, jm->ntri, nedges);
		printf("just got nvert = %d\n",jm->nvert);
		printf("just got num_fc = %d\n",num_fc);
		//printf("just got ntri = %d\n",jm->ntri);
		printf("just got nedges = %d\n",nedges);

		int * fvert = malloc( sizeof( int ) * 4);

		int tricnt = 0;

		int lim = jm->ntri * 3;

		int c = 0, nm;

		char ch = 0;

		jm->vertices = malloc( sizeof(float) *jm->nvert*3);
		//	jm->triangles = malloc( sizeof(int) *jm->ntri * 3 * 2);

		int * i_buff = malloc( sizeof(int) * num_fc * 3 * 2);

		int buff[jm->ntri*2*3];

		int fc = 0;

		//get the vertex array
		for(cnt = 0; cnt < jm->nvert*3 ; cnt++)
		{
			fscanf(fp,"%f",jm->vertices + cnt);
		}


		//show the vertex array
		/*
		   for( i = 0; i < jm->nvert*3 ; i++)
		   {
		   printf("jm->vert + %d = %f\n", i, jm->vertices[i]);
		   }
		   */

		printf("\nnow getting the faces\n");

		cnt = 0;

		int tnm = 0, end = 2;
		//for(cnt = 0; cnt < jm->ntri; cnt++ )
		//for(cnt = 0; cnt < num_fc * 2 * 3 ; cnt++ )
		for(fc = 0; fc < num_fc; fc++ )
		{ 
			tnm = 0;

			//end = fread( &num, 1, sizeof( int ), fp);
			fscanf(fp,"%d", &num); 	

			if( num == 3)
			{
				//		printf("I MUST get %d nums cnt = %d\n", num, cnt );
				for( j = 0; j < num ; j++)
				{
					fscanf( fp, "%d",i_buff + cnt); 
					//			printf("i_buff[%d]  = %d\n", cnt, i_buff[cnt]);
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

				//cnt--;
				//		printf("cnt is now %d\n", cnt);
			}
			else
			{
				//		printf("I Know I must get %d nums\n", num);

				for( j = 0; j < num ; j++)
				{
					fscanf(fp,"%d", fvert + j);
					//			printf("it is %d\n", *(fvert + j) );
				}

				nm = 0;

				for(nm = 0; nm < 3 ; nm++)
				{
					//jm->triangles[cnt ] = fvert[nm]; 

					i_buff[cnt] = fvert[nm];

					//				printf("jm->tri[%d]  = %d, fvert[%d] = %d\n", cnt, jm->triangles[cnt], nm, fvert[nm]);
					//			printf("i_buff[%d]  = %d, fvert[%d] = %d\n", cnt, i_buff[cnt], nm, fvert[nm]);
					cnt++;

				}

				tricnt++;

				nm--;

				//		printf("nm is now %d\n", nm);

				for(nm ; nm < 5 ; nm++)
				{
					//jm->triangles[cnt ] = fvert[nm%4];
					i_buff[ cnt ] = fvert[nm%4];
					//printf("jm->tri[ %d ] = %d, fvert[%d%4] = %d\n", cnt ,jm->triangles[cnt], nm, fvert[nm%4] );
					//			printf("i_buff[%d]  = %d, fvert[%d%4] = %d\n", cnt, i_buff[cnt], nm, fvert[nm%4]);
					cnt++;
				}

				tricnt++;

				nm--;
				//		printf("....and nm is now %d\n", nm);

				//		printf("cnt is now %d\n", cnt);

				end = 2;
				c = 0;

				//		printf("------c is %c and end is %d\n", c, end);


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

				//cnt--;
				//		printf("C_cnt is now %d\n", cnt);
			}
		}

		printf("C_cnt is total  %d\n", cnt);
		//printf("there are %d triangles\n", tricnt);


		jm->ntri = tricnt;
		printf("there are %d triangles\n", jm->ntri);

		jm->triangles = malloc( sizeof(int) * cnt);

		for( i = 0 ; i < cnt ; i++)
		{
			jm->triangles[i] = i_buff[i];
		}


		//printf("the triangles are......\n");

		for( i = 0 ; i < cnt ; i++)
		{
			//	printf("jm->triangles[%d] = %d\n", i,jm->triangles[i]);
		}


		//	for( i = 0 ; i < jm->nvert ; i++)
		//	{
		//	printf("\nvertice[%d] is....\n", i);
		//	printf("vertices[%d]_X = %d\n", i,jm->triangles[i*3 + 0]);
		//	printf("vertices[%d]_Y = %d\n", i,jm->triangles[i*3 + 1]);
		//	printf("vertices[%d]_Z = %d\n", i,jm->triangles[i*3 + 2]);
		//	}


		//	for( i = 0 ; i < tricnt ; i++)
		//	{
		//		printf("\ntriangles[%d] is ...\n", i);
		//		printf("V1 = %d\n",jm->triangles[i*3 + 0]);
		//		printf("V2 = %d\n",jm->triangles[i*3 + 1]);
		//		printf("V3 = %d\n",jm->triangles[i*3 + 2]);
		//	}

		printf("the number of vertices is %d\n", jm->nvert);
		printf("the number of triangles  is %d\n", jm->ntri);

		float xmin = jm->vertices[0], xmax = jm->vertices[0], x = 0;
		float ymin = jm->vertices[1], ymax = jm->vertices[1], y = 0;
		float zmin = jm->vertices[2], zmax = jm->vertices[2], z = 0;

		//calculate the xmin/max, y/min/max, zmin, zmax

		for(i = 0; i < jm->nvert; i++)
		{
			x = jm->vertices[i*3 + 0];
			y = jm->vertices[i*3 + 1];
			z = jm->vertices[i*3 + 2];

			if( xmin > x )
			{
				xmin = x;
			}

			if( xmax < x )
			{
				xmax = x;
			}


			if( ymin > y )
			{
				ymin = y;
			}

			if( ymax < y )
			{
				ymax = y;
			}


			if( zmin > z )
			{
				zmin = z;
			}

			if( zmax < z )
			{
				zmax = z;
			}
		}

		int sz = jm->nvert;

		printf("\nxmin/max = %f,%f\n",xmin, xmax);
		printf("\nymin/max = %f,%f\n",ymin, ymax);
		printf("\nzmin/max = %f,%f\n",zmin, zmax);

		x = 0;
		y = 0;
		z = 0;


		float * xarr;
		float * yarr;
		float * zarr;

		float * BB;
		float * centroid;

		BB = getBoundingBox( jm->vertices, jm->nvert*3, BB);


		centroid = getCentroid( jm->vertices, jm->nvert*3, centroid);


		xarr = get012( jm->vertices, jm->nvert*3, 0, xarr);
		yarr = get012( jm->vertices, jm->nvert*3, 1, yarr);
		zarr = get012( jm->vertices, jm->nvert*3, 2, zarr);

		float xminmx[2];
		float yminmx[2];
		float zminmx[2];

		xminmx[0] = Flmin(xarr, sz); 
		xminmx[1] = Flmax(xarr,sz);
		yminmx[0] = Flmin(yarr, sz); 
		yminmx[1] = Flmax(yarr,sz);
		zminmx[0] = Flmin(zarr, sz); 
		zminmx[1] = Flmax(zarr,sz);


		printf("the bounding box is ...\n");
		printf("\nxmin/max = %f,%f\n",BB[0], BB[1]);
		printf("\nymin/max = %f,%f\n",BB[2], BB[3]);
		printf("\nzmin/max = %f,%f\n",BB[4], BB[5]);


		printf("the other bounding box is ...\n");
		printf("\nxmin/max = %f,%f\n",xminmx[0], xminmx[1]);
		printf("\nymin/max = %f,%f\n",yminmx[0], yminmx[1]);
		printf("\nzmin/max = %f,%f\n",zminmx[0], zminmx[1]);
		/*
		   printf("\n\nx:...\n");
		   printVEC(xarr, jm->nvert);
		   printf("y:...\n");
		   printVEC(yarr, jm->nvert);
		   printf("z:...\n");
		   printVEC(zarr, jm->nvert);
		   */

		float xyzav[3];



		xyzav[0] = getavg(xminmx, 2);
		xyzav[1] = getavg(yminmx, 2);
		xyzav[2] = getavg(zminmx, 2);

		printf("\nThe Centroid is...\n");
		printVEC( xyzav, 3);

		xyzav[0] = centroid[0];
		xyzav[1] = centroid[1];
		xyzav[2] = centroid[2];

		printf("\nThe my func Centroid is...\n");
		printVEC( xyzav, 3);

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






