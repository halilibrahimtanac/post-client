import { Comment, Favorite, FavoriteBorder } from "@mui/icons-material";
import { CardActions, IconButton, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useLikePostMutation } from "../../../store/post/mutation";

const PostActions = ({
  likeCount,
  likeList,
  commentCount,
  id
}) => {
  const loggedUser = useSelector((state) => state.data.user);
  const [likePost] = useLikePostMutation();

  const likePostHandler = async (e) => {
    e.stopPropagation();
    try {
      likePost({ postId: id });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <CardActions disableSpacing sx={{ padding: "0 16px 8px" }}>
      <IconButton aria-label="like post" onClick={likePostHandler}>
        {likeList.find((lk) => lk.user.username === loggedUser.username) ? (
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
  );
};

export default PostActions;
