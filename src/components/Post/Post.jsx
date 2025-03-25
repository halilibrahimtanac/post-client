import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  Typography,
  Avatar,
  styled,
  CardActions,
  IconButton,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { constructMediaUrl } from "../../lib/utils";
import { Comment } from "@mui/icons-material";

const StyledCard = styled(Card)({
  maxWidth: 600,
  margin: "10px auto",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  overflow: "visible"
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

const Post = ({
  id,
  body,
  createdAt,
  image,
  user,
  video,
  commentCount,
  parentPost,
}) => {
  const loggedUser = useSelector((state) => state.data.user);
  const navigate = useNavigate();
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const imageUrl = constructMediaUrl(image);
  const videoUrl = constructMediaUrl(video);

  const profileNavigate = (e) => {
    e.stopPropagation();
    navigate(
      loggedUser.username === user.username
        ? "/profile"
        : `/user/profile/${user.username}`
    );
  };

  return (
    <StyledCard onClick={() => navigate(`/post/${id}`)}>
      <CardHeader
        avatar={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* parentPost && (
              <Box
                sx={{
                  minWidth: "1px",
                  maxWidth: "1px",
                  height: "22px",
                  backgroundColor: "#bdbdbd",
                  position: "absolute",
                  top: "-42px", // Adjust spacing above the avatar
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            ) */}
            <Avatar
              sx={{ bgcolor: "#1976d2" }}
              src={constructMediaUrl(user.profilePicture)}
            >
              {user.username[0]}
            </Avatar>
          </Box>
        }
        title={
          <Typography
            onClick={profileNavigate}
            sx={{
              "&:hover": { textDecoration: "underline", cursor: "pointer" },
            }}
            variant="subtitle1"
            fontWeight="600"
          >
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
      <CardActions disableSpacing>
        <IconButton aria-label="comments">
          <Comment fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {commentCount}
        </Typography>
      </CardActions>
    </StyledCard>
  );
};

export default Post;
