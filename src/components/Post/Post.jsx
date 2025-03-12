import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  Typography,
  Avatar,
  styled,
} from "@mui/material";

const StyledCard = styled(Card)({
  maxWidth: 600,
  margin: "20px auto",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
});

const PostContent = styled("div")({
  padding: "0 16px 16px",
});

const PostText = styled(Typography)({
  fontSize: "1rem",
  lineHeight: 1.5,
  color: "#333",
  marginTop: 12,
});

const PostMedia = styled(CardMedia)({
  width: "100%",
  maxHeight: 500,
  objectFit: "cover",
  borderBottom: "1px solid #eee",
  borderTop: "1px solid #eee",
});

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};


const constructMediaUrl = (relativePath) => {
  if (!relativePath) return null;

  const normalizedPath = relativePath?.replace(/\\/g, ".");
  return `http://localhost:3000/media/${normalizedPath}`;
};

const Post = ({ body, createdAt, image, user, video }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const imageUrl = constructMediaUrl(image);
  const videoUrl = constructMediaUrl(video);
  return (
    <StyledCard>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#1976d2" }}>{user.username[0]}</Avatar>}
        title={
          <Typography variant="subtitle1" fontWeight="600">
            {user.username}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="textSecondary">
            {formattedDate}
          </Typography>
        }
        sx={{ padding: "16px 16px 8px" }}
      />

      {body && (
        <PostContent>
          <PostText variant="body1">{body}</PostText>
        </PostContent>
      )}

      {imageUrl && isValidUrl(imageUrl) && (
        <PostMedia component="img" image={imageUrl} alt="Post content" />
      )}

      {videoUrl && isValidUrl(videoUrl) && (
        <PostMedia component="video" controls src={videoUrl} />
      )}
    </StyledCard>
  );
};

export default Post;
