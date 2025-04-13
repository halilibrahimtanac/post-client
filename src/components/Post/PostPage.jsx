import React from "react";
import { useParams } from "react-router-dom";
import { useGetPostQuery } from "../../store/post/query";
import Post from "./Post";
import RelatedPostsList from "./RelatedPostsList";

const PostPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, isSuccess } = useGetPostQuery(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Couldn't fetch.</div>;
  }

  if (isSuccess) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div>
          <Post
            {...data}
            likeList={data.Like}
            likeCount={data._count.Like}
            commentCount={data._count.children}
          />
        </div>
        <RelatedPostsList id={id} showNewPost />
      </div>
    );
  }
};

export default PostPage;
