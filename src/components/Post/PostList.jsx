import React from "react";
import { useGetAllPostsQuery } from "../../store/post/query";
import { Container } from "@mui/material";
import Post from "./Post";
import NewPost from "./NewPost";

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
      <NewPost />
      {data.posts.map((p) => <Post key={p.id} id={p.id} body={p.body} createdAt={p.createdAt} image={p.image} user={p.user} video={p.video} commentCount={p._count.children} likeCount={p._count.Like} likeList={p.Like}/>)}
    </Container>
  );
};

export default PostList;
