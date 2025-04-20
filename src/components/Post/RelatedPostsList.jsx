import React from "react";
import { useGetRelatedPostsQuery } from "../../store/post/query";
import NewPost from "./NewPost";
import Post from "./Post";

const RelatedPostsList = ({ id, showNewPost = false, depth = 0 }) => {
  const {
    data: relatedPosts,
    isLoading,
    isError,
    refetch,
  } = useGetRelatedPostsQuery(id);

  const indentStyle = {
    paddingLeft: depth > 0 ? 30 : 0,
    boxSizing: "border-box",
    marginTop: depth > 0 ? 5 : 0,
    borderLeft: depth > 0 ? "1px solid #e0e0e0" : "none",
    marginLeft: depth > 0 ? 10 : 0,
  };

  if (isLoading) {
    return <div style={indentStyle}>Loading replies...</div>;
  }
  if (isError) {
    return <div style={indentStyle}>Could not load replies.</div>;
  }

  if (relatedPosts) {
    return (
      <div style={indentStyle}>
        {showNewPost && <NewPost parentPost={id} refetch={refetch} />}
        {relatedPosts?.map((p) => (
          <React.Fragment key={p.id}>
            <Post
              {...p}
              likeList={p.Like}
              likeCount={p._count.Like}
              commentCount={p._count.children}
              refetch={refetch}
            />
            {/* Recursive Call: Render related posts for *this* post (p) */}
            {p._count.children > 0 && (
              <RelatedPostsList
                id={p.id}
                showNewPost={false}
                depth={depth + 1}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return null;
};

export default RelatedPostsList;
