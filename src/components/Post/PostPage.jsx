import React from "react";
import { useParams } from "react-router-dom";
import {
  useGetPostQuery,
  useGetRelatedPostsQuery,
} from "../../store/post/query";
import Post from "./Post";
import NewPost from "./NewPost";

const PostPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError, isSuccess } = useGetPostQuery(id);
  const {
    data: relatedPosts,
    isLoading: isLoading1,
    isError: isError1,
    refetch,
  } = useGetRelatedPostsQuery(id);

  if (isLoading && isLoading1) {
    return <div>Loading...</div>;
  }

  if (isError && isError1) {
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
        <div style={{ paddingLeft: 50, boxSizing: "border-box" }}>
          <NewPost parentPost={id} refetch={refetch} />
          {relatedPosts?.map((p) => (
            <Post
              {...p}
              likeList={p.Like}
              likeCount={p._count.Like}
              commentCount={p._count.children}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default PostPage;
