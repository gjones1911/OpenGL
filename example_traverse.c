{
  /*
   vertices has {x, y, z, x, y, z, x, y, z, ... } 
   there are nvertices * 3 floating points in this array

   triangles has {vert1_id, vert2_id, vert3_id, ....}
   there are ntri*3 int values in this array
   */

  /* 
   the following three ways of traversing through the
   vertex-list are equivalent
   */ 
    
  for (i = 0; i < ntri; i ++)
    for (j = 0; j < 3; j++)
       glVertex3fv(&vertices[triangles[i*3 + j]*3]);


  for (i = 0; i < ntri; i ++)
    for (j = 0; j < 3; j++)
       glVertex3fv(vertices + triangle[i*3+j]*3);


  int * t;
  for (t = triangles, i = 0; i < ntri; t+=3, i ++)
    for (j = 0; j < 3; j++)
       glVertex3fv(vertices + t[j]*3); 

}
