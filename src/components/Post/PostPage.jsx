import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPostQuery, useGetRelatedPostsQuery } from '../../store/post/query';
import Post from './Post';
import NewPost from './NewPost';

const PostPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetPostQuery(id);
  const { data:relatedPosts, isLoading:isLoading1, isError:isError1, refetch } = useGetRelatedPostsQuery(id);

  if (isLoading && isLoading1){
    return <div>Loading...</div>
  }

  if (isError && isError1){
    return <div>Couldn't fetch.</div>
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <div>
        <Post {...data }/></div>
        <div style={{ paddingLeft: 50, boxSizing: "border-box"}}>
            <NewPost parentPost={id} refetch={refetch}/>
            {relatedPosts?.map(p => <Post {...p} />)}
        </div>
    </div>
  )
}

export default PostPage