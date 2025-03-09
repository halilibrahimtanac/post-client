import React from "react";
import { useGetAllPostsQuery } from "../../store/post/query";
import { Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material";

const PostList = () => {
  const { data, isLoading, isError, isFetching, isSuccess } = useGetAllPostsQuery();

  if(isLoading){
    return <div>Loading...</div>
  }
  if(isError){
    return <div>Couldn't fetch posts!</div>
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {data.posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea>
                {/* <CardMedia
              component="img"
              height="140"
              image={post.image}
              alt={post.body}
            /> */}
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.body}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostList;
