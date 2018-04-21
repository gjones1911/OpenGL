#include <stdio.h>
#include <stdlib.h>


int main(void)
{
	int num = 0;

	for(num = 0; num < 5 ; num++)
	{
		printf("%d % 4 = %d\n", num , num % 4);

	}

	return 0;
}

