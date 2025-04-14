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
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { constructMediaUrl } from "../../lib/utils";
import { Comment, Edit, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useEditPostMutation, useLikePostMutation } from "../../store/post/mutation";

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
  likeList,
}) => {
  const loggedUser = useSelector((state) => state.data.user);
  const [likePost] = useLikePostMutation();
  const [editPost] = useEditPostMutation();
  const navigate = useNavigate();
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const imageUrl = constructMediaUrl(image);
  const videoUrl = constructMediaUrl(video);

  const [editBody, setEditBody] = useState(null);

  const likePostHandler = async (e) => {
    e.stopPropagation();
    try {
      likePost({ postId: id });
    } catch (err) {
      console.log(err);
    }
  };

  const editPostHandler = async (e) => {
    e.stopPropagation();
    try{
      await editPost({ postId: id, editBody });
      setEditBody(null);
    } catch (err) {
      console.log(err);
    }
  }


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
        {...(loggedUser.username === user.username
          ? {
              action: (
                <Box sx={{ position: "relative", top: 3 }}>
                  <IconButton
                    color={editBody ? "info" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editBody) {
                        setEditBody(null);
                        return;
                      }
                      setEditBody(body);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
              ),
            }
          : {})}
      />

      {body && (
        <PostContent>
          {editBody === null ? (
            <PostText variant="body1">{body}</PostText>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
              <TextField
                value={editBody}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onChange={(e) => setEditBody(e.target.value)}
              />
              <Button variant="contained" onClick={editPostHandler}>Save</Button>
            </Box>
          )}
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
          {likeList.find((lk) => lk.user.username === loggedUser.username) ? (
            <Favorite sx={{ color: "#e91e63" }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginRight: 2 }}
        >
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
