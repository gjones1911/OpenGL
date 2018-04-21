/* utils.h */

#include <GL/glut.h>
#include <math.h>
#include "jmesh.h"

#ifndef _GRAPHICS_UTILS_
#define _GRAPHICS_UTILS_

typedef struct {
  int width;        /* width of rendering target */
  int height;       /* height of rendering target */
  char * H;         /*used for possible printing*/
  char * W;			/*used for possible printing*/
  double cubesize;  /* size of cube - for playing with */
  //jmesh * jm;
  float Xcam;
  float Ycam;
  float Zcam;
  float Xe;
  float Ye;
  float Ze;
  int nobj;
  float * BB;
  float * dim;
  float * centroid;
  float * vertices;
  int * triangles;
  int ntri;
  int nvert;
  int numO;        //number of objects
  char * input;
} graphics_state;   /* global graphics state */


#ifdef __cplusplus
extern "C" {
#endif

	//my func's
	//will process the the object/objects pointed to by vert
	//takes the shapes/tri's pointer, number of vertices, number of shapes, type of object, and a color array
	//Object type:
	//0:triangle
	//1:
	//2:
	void process_Obj( float * vert, int * shapes, int nvert, int nshapes, int type,  GLfloat   color[]);

	void draw_Mesh( float  *  vert, int  * shapes, int nvert, int nshapes,  GLfloat   color[]);

	void MeshDisplay();

	//like above but for multiple objects at once
	void process_ObjM( float  *  vert, int  * shapes, int nvert, int nobjects, int type,  GLfloat   color[]);

	//will center the cam on the given object/graphic state
	void center_cam(graphics_state * gs, float * verts);

	//a simplification of the look at function
	void setcam( float x, float y , float z, float cx, float cy, float cz, float up);


	//used to create a ppm file of the given name
	void makePPM(char * file);

	//used to change from perspective to orthogonal mode
	void perspective();


	//Prototypes for GLUT/openGL
	void print_howto(void);
	void getMat(int n);
	void init(graphics_state *);
	void set_gs(graphics_state *);
	void timerfunc();
	void display(void); 
	void o_display(void); 
	void Solardisplay(void); 
	void reshape(int w, int h);
	void mouse_handler(int button, int button_state, int x, int y);
	void trackMotion(int x, int y);
	void keys(unsigned char c,int x, int y);

	/* GLSL specific functions */
	char*textFileRead(char *fn);
	int  load_shader(GLuint shader, GLchar * source);
	int  init_GLSL(char * vert_source, char * frag_source);

#ifdef __cplusplus
}
#endif

#endif
