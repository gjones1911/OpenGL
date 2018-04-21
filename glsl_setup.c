#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glut.h>

#include "utils.h"

char *textFileRead(char *fn) 
{
	FILE *fp;
	char *content = NULL;
	int count;

	if((fp = fopen(fn,"r")) == NULL) {
		fprintf(stderr, "unable to open %s for reading\n", fn);
		exit(1);
	}

	fseek(fp, 0, SEEK_END);    
	count = ftell(fp);
	rewind(fp);

	if (count > 0) {
		content = (char *)malloc(sizeof(char) * (count+1));
		if(content == NULL){
			fprintf(stderr, "unable to malloc %d bytes in textFileRead\n", count);
			exit(1);
		}
		count = fread(content,sizeof(char),count,fp);
		content[count] = '\0';
	}
	fclose(fp);
	return content;
}

int load_shader(GLuint shader, GLchar * source)
{
    GLint status;

    glShaderSource(shader, 1, (const GLchar**) &source, NULL);
    glCompileShader(shader);
    glGetShaderiv(shader, GL_COMPILE_STATUS, &status);

    if (status == GL_FALSE)
        return -1; /* failed */
    else
        return 0; /* successful */
}

int init_GLSL(char * vert_source, char * frag_source)
{
    GLint status;
    GLuint vertexShader, fragShader, program;
    GLchar *vertexSource, *fragSource;

    vertexSource = textFileRead(vert_source);
    fragSource = textFileRead(frag_source);

    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    if (load_shader(vertexShader, vertexSource) < 0)
        printf("vertex shader failed to load\n");
    else
        printf("vertex shader loaded successfully\n");

    fragShader = glCreateShader(GL_FRAGMENT_SHADER);
    if (load_shader(fragShader, fragSource) < 0)
        printf("fragment shader failed to load\n");
    else
        printf("fragment shader loaded successfully\n");
  
    /* link the shader programs */
    program = glCreateProgram();
    glAttachShader(program, vertexShader);
    glAttachShader(program, fragShader);  
    glLinkProgram(program);
    glGetProgramiv(program, GL_LINK_STATUS, &status);
    if (status == 1)
    {
        glUseProgram(program);
        return 0; /* linked successfuly */
    }
    else
        return -1; /* oops, didn't work */

    /* remember to cleanup */
    free(vertexSource);
    free(fragSource);
}
