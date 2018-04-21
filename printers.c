#include <stdarg.h>
#include <stdio.h>
#define LEN 9192

void printv( va_list args, const char* format)
{
	char buff[LEN];
	char * ch = buff;
	vsnprint(buf,LEN, format, args);
	while( *ch )
	{
		glutBitMapCharacter(GLUT_BITMAP_HELVETICA_10,*ch++);;
	}

}

void print( const char * format, ...)
{
	va_list args;
	//glWindowPos2i(x,y);
	va_start(args,format);
	printv(args,format);
	va_end(args);
}

void printAt( int x, int y,const char * format, ...)
{
	va_list args;
	glWindowPos2i(x,y);
	va_start(args,format);
	printv(args,format);
	va_end(args);
}
