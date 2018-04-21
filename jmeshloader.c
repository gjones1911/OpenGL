/* utils.c */

#include <stdlib.h>
#include <stdio.h>
#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glut.h>
#include "utils.h"
#include "printers.h"
//#include "/home/gjones2/Gutil/gmath.h"

//#include "gheader.h"

//setcam(0.0, 100.0,-400.0, 0.0, 100.0, 0.0, 1.0);
float Zcampos = -5.0;
float Ycampos = 0.0;
float Xcampos = 0.0;
float Zeyepos = -5.0;
float Yeyepos = 0.0;
float Xeyepos = 0.0;
float UPdir = 1.0;
float * crnt_vert;
int ObjType;
float * vertXYZ;
float * crnt_centroid;
float * OrigBB;
float Ox;
float Oy;
float Oz;
int width, height;
int ntri;
int nvert;



static graphics_state * current_gs;


void process_Obj( float  *  vert, int * shapes, int nvert, int nshapes, int type,  GLfloat   color[])
{
	int i = 0, cnt = 0;

	if( type == 0 )
	{

		printf("making a triangle...\n");
		crnt_vert = malloc( sizeof( float )* nvert * 3);

		
		printf("nvert = %d\n", nvert);

		glBegin( GL_TRIANGLES);


		for( i = 0; i < nvert; i++ )
		{
			glColor3fv(color + i);
			glVertex3fv(  vert[i]) ;
		}

		glEnd();
	}

	if( type == 1 )
	{

		printf("making a cube...\n");
		crnt_vert = malloc( sizeof( float )* nvert * 3);

		
		printf("nvert = %d\n", nvert);

		glBegin( GL_QUADS);

		int * lpptr = malloc( sizeof(int )*4 );

		for( i = 0; i < nshapes; i++ )
		{
			glColor3fv(color + i%6);
			glVertex3fv(  vert + (i* 4 + 0) );
			glVertex3fv(  vert + (i* 4 + 1) );
			glVertex3fv(  vert + (i* 4 + 2) );
			glVertex3fv(  vert + (i* 4 + 3) );
		}

		glEnd();
		
	}
	if( type == 2 )
	{

		printf("making a polygon...\n");
		crnt_vert = malloc( sizeof( float )* nvert * 3);

		glPolygonMode(GL_FRONT_AND_BACK, GL_LINE)
		
		printf("nvert = %d\n", nvert);

		glBegin( GL_POLYGON);

		int * lpptr = malloc( sizeof(int )*3 );

		for( i = 0; i < nshapes; i++ )
		{
			glColor3fv(color + i%3);
			glVertex3fv(  vert[ shapes[i*3 + 0] ] );
			glVertex3fv(  vert[ shapes[i*3 + 1] ] );
			glVertex3fv(  vert[ shapes[i*3 + 2] ] );
		}

		glEnd();
		
	}


}

void makePPM(char * file)
{
	int num = 0;
	
	int cols, rows;	

	FILE * fp;

	char spc[1] = {' '};

	char nl[1] = {'\n'};

	char ppm[3] = {'P','3','\n'};
	char max[4] = {'2','5','5','\n'};

	fp = fopen(file, "w");

	num = fwrite(ppm, sizeof(char), sizeof(ppm), fp);

	if( num <= 0) 
	{
		printf("problem opening file\n");
		exit(-3);
	}

	printf(" size of width = %d\n", sizeof(current_gs->W) );
	printf(" size of height = %d\n", sizeof(current_gs->H) );

	num = fwrite(current_gs->W, sizeof(char), 4, fp);
	num = fwrite(current_gs->H, sizeof(char), 4, fp);

	if( num <= 0) 
	{
		printf("1problem opening file\n");
		exit(-3);
	}
	
	if( num <= 0) 
	{
		printf("3problem opening file\n");
		exit(-3);
	}

	num = fwrite(max, sizeof(char), sizeof(max), fp);
	if( num <= 0) 
	{
		printf("5problem opening file\n");
		exit(-3);
	}


	int r,c, i;

	unsigned char * charA = malloc( sizeof(unsigned char) *1);

	rows = current_gs->width;
	cols = current_gs->height;

	int cnt, cidx = 0;

	int rcnt = 0;

	char numar[4];
	
	char rnum[4];

	unsigned char * buf;
	
	buf = malloc( sizeof(unsigned char ) * 3 * current_gs->width * current_gs->height);

	glReadPixels(0,0, current_gs->width, current_gs->height, GL_RGB, GL_UNSIGNED_BYTE, buf);

	int nm = 0;

	int lim = 16;

	int pcnt = 0;

//	for( r = rows- 1; r >= 0; r--)
	//
	//printf("cols*3  = %d\n", cols*3);
//	for( r = (( rows- 1)* cols* 3); r >= 0 ; r -= cols*3)
	for( r = 0; r < rows*cols*3 ; r++)
	{

//		if( nm < 5 ) printf("idx0 = %d: idxend = %d\n", r, (r + cols*3)-1 );

		for( cidx = 0; cidx < cols * 3; cidx++)
		{
//		if( r + cidx == 0 || r+ cidx == 1)printf("idx0 = %d: idxend = %d\n", r, (r + cols*3)-1 );

			
			cnt = sprintf( numar, "%d", buf[r + cidx] );
			
	//if( nm < lim && (cidx < 10 ||  cidx >  cols*3 -5) )printf("the idx : %d, idx %d\n", r + cidx, cidx);

			/*
			   for( i = 0 ; i < cnt ; i++)
			   {
			   rnum[i] = numar[cnt - i+1];
			   }
			   */



			 //if( nm < lim && cidx < 10 &&  cidx < cols*3 -5) printf("the count is , rcnt %d %d\n", cnt, rcnt);


			 //if( nm < lim && cidx < 10 &&  cidx < cols*3 -5)printf("as chars the num is \n");

			for( i = 0; i < cnt ; i++)
			{
	//		 if( nm < lim && cidx < 10 && cidx < cols*3 -5)printf("%c", numar[i]);
//			 if( r + cidx == 0 || r+ cidx == 1535)printf("%c", numar[i]);
				num = fwrite(numar + i, sizeof(char), 1, fp);
			}
			pcnt++;

			num = fwrite(spc, sizeof(char), 1, fp);

			if(pcnt > 0 && pcnt %3 == 0) num = fwrite(spc, sizeof(char), 1, fp);
	//		if( nm < lim && cidx < 10 && cidx < cols*3 -5)printf(" ");
	//		if( nm < lim && cidx < 10 && cidx < cols*3 -5)printf("\n");


			//printf("%uB\n", buf[r]);
			//num = fwrite(buf[r], sizeof(unsigned char), 1, fp);
			//num = fwrite(buf+r, sizeof(unsigned int), 1, fp);


			//	if( r % 3 == 0)
			//	{
			//		num = fwrite(spc, sizeof(char), 1, fp);
			//		num = fwrite(spc, sizeof(char), 1, fp);
			//	}

			if( rcnt % 20 == 0 && rcnt > 0)
			{
	//			if( nm < lim && cidx < 10 && cidx < cols*3 -5)printf("rcnt is %d\n", rcnt);
				num = fwrite(nl, sizeof(char), 1, fp);
			}
			rcnt++;
		}
			nm++;

	}

	printf("pcnt total = %d\n", pcnt);
	printf("DONE!!\n");


}





void setupcam( float x, float y , float z, float cx, float cy, float cz, float up);
void setupcam2( float * xyz, float * cntrd, float up)
{

	Xeyepos = xyz[0];
	Yeyepos = xyz[1];
	Zeyepos = xyz[2];

	Xcampos = cntrd[0];
	Ycampos = cntrd[1];
	Zcampos = cntrd[2];

	UPdir = 1.0;
}

void print_howto(void){
	printf("So far it does nothing - you output howto here\n");
	printf("r/R:     Rotate Up\n");
	printf("v/V:   Rotate Down\n");
	printf("c/C:   Rotate Left\n");
	printf("g/G:  Rotate Right\n");
	printf("u/U:     Move Up\n");
	printf("d/D:   Move Down\n");
	printf("t/T:   Move Left\n");
	printf("y/Y:  Move Right\n");
	printf("f/F:      Zoom In\n");
	printf("b/B:    Zoom Out\n");
	printf("Home:         Reset View\n");
	printf("q/Q:       Exit Program\n");
}

void 
set_gs(graphics_state * gs){
	current_gs = gs;
}

void init(graphics_state * gs)
{
	crnt_vert = malloc( sizeof(float) * 4);
	current_gs = gs;
	//orange
	glClearColor(0.93, 0.6666667, 0.0, 1.0); 
	//glClearColor(1.0, 1.0, 1.0, 1.0); 
	glClearDepth( 1.0);
	//glEnable(GL_LIGHT0);
	//glEnable(GL_LIGHTING);
	//glEnable(GL_DEPTH_TEST);
	vertXYZ = gs->vertices;
	OrigBB = gs->BB;
	crnt_centroid = gs->centroid;
	ntri = gs->ntri;
	nvert = gs->nvert;
	setupcam(0.5, 0.5,-5.0, 0.5, 5.0, 5.0, 1.0);
}

void setcam( float x, float y , float z, float cx, float cy, float cz, float up)
{
	Zcampos = cz;
	Ycampos = cy;
	Xcampos = cx;
	Zeyepos = z;
	Yeyepos = y;
	Xeyepos = x;
	UPdir = up;
	gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos, Ycampos, Zeyepos, 0.0, up, 0.0);
	printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);
}


void setupcam( float x, float y , float z, float cx, float cy, float cz, float up)
{
	Zcampos = z;
	Ycampos = y;
	Xcampos = x;
	Zeyepos = cz;
	Yeyepos = cy;
	Xeyepos = cx;
	UPdir = up;
}

void display(void)
{

	int type = 0, cnt = 0;

	glClear(GL_COLOR_BUFFER_BIT);

	//	glLineWidth(10);

//	glutWireCube(current_gs->cubesize);

	float cubeAry[24];

	float * cube = cubeAry;


	float clr[24];

	float * color = clr;
	color[0] = 1.0f;  
	color[1] = 0.0f;  
	color[2] = 0.0f;  
	
	color[3] = 0.0f;  
	color[4] = 1.0f;  
	color[5] = 0.0f;  
	
	color[6] = .666f;  
	color[7] = .24f;  
	color[8] = 0.0f;  

	color[9] = .666f;  
	color[10] = .24f;  
	color[11] = 0.0f;  

	color[12] = .666f;  
	color[13] = .24f;  
	color[14] = 0.0f;  
	
	color[15] = 0.0f;  
	color[16] = 1.0f;  
	color[17] = 0.0f;  
	
	
	color[18] = 0.0f;  
	color[19] = 1.0f;  
	color[20] = 0.0f;  
	
	
	color[21] = 0.0f;  
	color[22] = 1.0f;  
	color[23] = 0.0f;  
	
//	float * BB  = getBoundingBox( cubeAry, 24, BB, 0);
//	OrigBB  = getBoundingBox( cubeAry, 24, BB, 0);

//	float * centroid = getCentroid(cubeAry, 24, centroid, 2);
//	crnt_centroid = getCentroid(cubeAry, 24, centroid, 2);


	Ox = getCnter( OrigBB[0], OrigBB[1]);
	Oy = getCnter( OrigBB[2], OrigBB[3]);
	Oz = getCnter( OrigBB[4], OrigBB[5]);
	printf("Ox = %f, Oy = %f, Oz = %f\n", Ox, Oy, Oz);
	printf("Cx = %f, Cy = %f, Cz = %f\n",crnt_centroid[0], crnt_centroid[1], crnt_centroid[2]);

	//void process_Obj( float * vert, int * shapes, int nvert, int nshapes, int type, int color[])
	process_Obj(vptr, shpp,8, 6, 1, color);
	//process_Obj(cube, shpp,8, 6, 1, color);

	/*
	   glBegin( GL_TRIANGLES);

	   ObjType = 0;

	   crnt_vert[0] = 2.0f;
	   crnt_vert[1] = 0.0f;
	   crnt_vert[2] = 0.0f;

	   glColor3f(1.0, 0.0 , 0.0);

	//glVertex3f(2.0f,0.0f, 0.0f);
	glVertex3fv(crnt_vert);

	crnt_vert[0] = -2.0f;
	crnt_vert[1] = 0.0f;
	crnt_vert[2] = 0.0f;
	glColor3f(0.0, 1.0 , 0.0);

	//glVertex3f(-2.0f,0.0f, 0.0f);
	glVertex3fv(crnt_vert);

	crnt_vert[0] = 0.0f;
	crnt_vert[1] = 2.0f;
	crnt_vert[2] = 0.0f;
	glColor3f(0.0, 0.0 , 0.0);

	//glVertex3f(0.0f,2.0f,0.0f);
	glVertex3fv(crnt_vert);

	glEnd();
	*/


	/*
	   glBegin(GL_POLYGON );
	   glColor3f(0.0, 1.0 , 0.0);
	   glVertex2f(0.0,0.5);//glutWireCube(current_gs->cubesize);

	   glColor3f(0.0, 1.0 , 1.0);
	   glVertex2f(0.5,-0.5);//glutWireCube(current_gs->cubesize);

	   glColor3f(1.0, 1.0 , 0.0);
	   glVertex2f(-0.5,-0.5);//glutWireCube(current_gs->cubesize);
	   */ 



	//	glColor3f(1,1,1);
	//	glWindowPos2i(100,20);
	//	printAt(5,5,"hello yo");
	//	print("and again");

	//setcam( BB[0], BB[2], BB[4] - 5, centroid[0], centroid[1], centroid[2], 1 );


	glFlush();
	glutSwapBuffers();
	printf("\nDisplay called\n");

}

void 
reshape(int w, int h){

	printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	glViewport (0, 0, (GLsizei) w, (GLsizei) h);
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	//gluOrtho2D (0.0, (GLdouble) w, 0.0, (GLdouble) h);
	//glOrtho(0.0, (GLdouble) w, 0.0, (GLdouble) h,-1,1);

	gluPerspective( 65.0, (GLfloat) w/h, 0.001, 1000);


	glMatrixMode( GL_MODELVIEW);
	glLoadIdentity ();

	gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Zcampos,Ycampos,0.0,UPdir,0.0);
	glutPostRedisplay();
}

void 
mouse_handler(int button, int button_state, int x, int y){

}

void 
trackMotion(int x, int y) {

}

void keys(unsigned char c, int x, int y) 
{


	//int wn = 0;

	if( c == 'q'|| c == 'Q')
	{
		printf("i got the quit command\n");


		exit( EXIT_SUCCESS);
	}
	else if(c == 'B'|| c == 'b')
	{
		printf("i got the B/b/back command\n");

		Zeyepos = Zeyepos - .5;


		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,0.0,0.0,UPdir, 0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();


		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	}
	else if(c == 'f'|| c == 'F')
	{
		printf("i got the f/F/forward command\n");

		Zeyepos = Zeyepos + .5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zeyepos,0.0,UPdir, 0.0);

	}
	else if(c == 'c'|| c == 'C')
	{
		printf("i got the C/c/rotate left command\n");

		Xeyepos = Xeyepos - 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	}
	else if(c == 'g'|| c == 'G')
	{
		printf("i got the g/G/rotate right command\n");

		Xeyepos = Xeyepos + 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	}
	else if(c == 'r'|| c == 'R')
	{
		printf("i got the r/R/rotate upward command\n");

		Yeyepos = Yeyepos + 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	}

	else if(c == 'v'|| c == 'V')
	{
		printf("i got the v/V/rotate downward command\n");

		Yeyepos = Yeyepos - 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	}
	else if(c == 'd'|| c == 'D')
	{
		printf("i got the d/D/move down command\n");

		Yeyepos = Yeyepos - 5;
		Ycampos = Ycampos - 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);
	}
	else if(c == 'u'|| c == 'U')
	{
		printf("i got the u/U/move up command\n");

		Yeyepos = Yeyepos + 5;
		Ycampos = Ycampos + 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);
	}
	else if(c == 't'|| c == 'T')
	{
		printf("i got the u/U/move left command\n");

		Xeyepos = Xeyepos - 5;
		Xcampos = Xcampos - 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);
	}
	else if(c == 'y'|| c == 'Y')
	{
		printf("i got the u/U/move right command\n");

		Xeyepos = Xeyepos + 5;
		Xcampos = Xcampos + 5;

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
		printf("%.3f, %.3f, %.3f, %.3f, %.3f,%.3f, %.3f, %.3f, %.3f\n", Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir, 0.0);

	}
	else if( c == 8)
	{
		printf("I got the reset command/Esc\n");
		
		printf("Ox = %f, Oy = %f, Oz = %f\n", Ox, Oy, Oy);
		printf("Cx = %f, Cy = %f, Cz = %f\n",crnt_centroid[0], crnt_centroid[1], crnt_centroid[2]);

		setupcam( Ox, Oy, Oz - 5, crnt_centroid[0], crnt_centroid[1], crnt_centroid[2], 1);

		glLoadIdentity ();
		gluLookAt(Xeyepos, Yeyepos,Zeyepos, Xcampos,Ycampos,Zcampos,0.0,UPdir,0.0);
		glutPostRedisplay();
		glutSwapBuffers();
		glFlush();
	}
	else if( c == 'p')
	{
		printf("I got the make ppm command/Esc\n");

		char fileN[] = {'m','y','p','p','m'};

		char * filename = fileN;

		makePPM( filename );


	}
	else
	{
		printf("the value of the key pressed is %d\n", c);
	}
}

