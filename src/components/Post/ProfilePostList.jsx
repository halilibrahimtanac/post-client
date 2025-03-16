import React from "react";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  styled,
} from "@mui/material";
import {
  Article as ArticleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useGetUserPostsQuery } from "../../store/post/query";

const PostsGrid = styled(Box)({
  display: "grid",
  gap: "1.5rem",
  padding: "2rem 0",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const PostItem = styled(Card)({
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },
});

const PostMedia = styled("div")({
  position: "relative",
  paddingTop: "56.25%", // 16:9 aspect ratio
  backgroundColor: "#f5f5f5",
});

const PostImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const PostVideo = styled("video")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const PostContent = styled(Box)({
  padding: "1rem",
});

const EmptyPosts = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "4rem",
  textAlign: "center",
  color: "#636e72",
});

const ProfilePostList = ({ constructMediaUrl }) => {
  const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery();

  return (
    <>
      {posts?.length > 0 ? (
        <PostsGrid>
          {posts.map((post) => (
            <PostItem key={post.id}>
              {post.image && (
                <PostMedia>
                  <PostImage
                    src={constructMediaUrl(post.image)}
                    alt={post.body?.substring(0, 20) || "Post image"}
                  />
                </PostMedia>
              )}
              {post.video && (
                <PostMedia>
                  <PostVideo controls src={constructMediaUrl(post.video)} />
                </PostMedia>
              )}
              <PostContent>
                <Typography variant="body2" sx={{ color: "#2d3436" }}>
                  {post.body || ""}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    color: "#636e72",
                    textAlign: "right",
                  }}
                >
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </Typography>
              </PostContent>
            </PostItem>
          ))}
        </PostsGrid>
      ) : (
        !postsLoading && (
          <EmptyPosts>
            <ArticleIcon sx={{ fontSize: 60 }} />
            <Typography variant="h6">No posts yet</Typography>
            <Typography variant="body2">
              When "user" shares updates, they'll appear here.
            </Typography>
          </EmptyPosts>
        )
      )}

      {postsLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={40} sx={{ color: "#00b894" }} />
        </Box>
      )}
    </>
  );
};

export default ProfilePostList;
