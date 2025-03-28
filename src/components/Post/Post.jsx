import React, { useState } from "react";
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
import { Comment, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useLikePostMutation } from "../../store/post/mutation";

const StyledCard = styled(Card)({
  maxWidth: 600,
  margin: "10px auto",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  overflow: "visible",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
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
  likeCount = 0,
  parentPost,
}) => {
  
  const loggedUser = useSelector((state) => state.data.user);
  const [likePost] = useLikePostMutation();
  const navigate = useNavigate();
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const imageUrl = constructMediaUrl(image);
  const videoUrl = constructMediaUrl(video);

  const [liked, setLiked] = useState(false);

  const likePostHandler = async (e) => {
    e.stopPropagation();
    try {
      likePost({ postId: id, username: loggedUser.username });
    } catch (err) {
      console.log(err);
    }
  };


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
            <Avatar
              sx={{ bgcolor: "#1976d2", cursor: "pointer" }}
              src={constructMediaUrl(user.profilePicture)}
              onClick={profileNavigate}
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

      <CardActions disableSpacing sx={{ padding: "0 16px 8px" }}>
        <IconButton aria-label="like post" onClick={likePostHandler}>
          {liked ? (
            <Favorite sx={{ color: "#e91e63" }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
        <Typography variant="body2" color="textSecondary" sx={{ marginRight: 2 }}>
          {likeCount}
        </Typography>
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
