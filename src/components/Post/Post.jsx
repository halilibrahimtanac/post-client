import React, { useState, useEffect } from "react";
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
import { Comment, Edit, Favorite, FavoriteBorder, Delete } from "@mui/icons-material";
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

  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(body);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    try {

      const formData = new FormData();
      formData.append("postId", id);
      formData.append('body', editBody || ''); 

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await editPost(formData); 

      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
    } catch (err) {
      console.error("Failed to edit post:", err);
    }
  };

  const handleFileChange = (event) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0]; 
      if (fileType === 'image' || fileType === 'video') {

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(file);
        const newPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(newPreviewUrl);
        setPreviewType(fileType);
      } else {
        alert("Invalid file type. Please select an image or video.");
      }
    }
  };


  const handleDeletePost = async (e) => {
    e.stopPropagation();
    // TODO: Add confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this post?")) {
        console.log("Attempting to delete post with ID:", id);
        try {
            // TODO: Implement delete post mutation call
            alert("Post deletion initiated (implement mutation call).");
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Failed to delete post.");
            // TODO: Add user feedback for error
        }
    }
  };

  const cancelEditHandler = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditBody(body)
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null); 
    setPreviewType(null);
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
        {...(loggedUser.username === user.username
          ? {
              action: (
                <Box sx={{ position: "relative", top: 3 }}>
                  <IconButton
                    color={isEditing ? "info" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isEditing) {
                        cancelEditHandler(e);
                      } else {
                        setIsEditing(true);
                        setEditBody(body);
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Box>
              ),
            }
          : {})}
      />

      <PostContent>
        {isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editBody}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="Edit your post..."
            />

            {/* File Preview Area */}
            {previewUrl && (
              <Box sx={{ maxHeight: 300, overflow: 'hidden', display: 'flex', justifyContent: 'center', border: '1px solid #eee', borderRadius: 1, my: 1 }}>
                {previewType === 'image' && (
                  <img src={previewUrl} alt="Preview" style={{ display: 'block', maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                )}
                {previewType === 'video' && (
                  <video controls src={previewUrl} style={{ display: 'block', maxWidth: '100%', maxHeight: '300px' }} onClick={e => e.stopPropagation()} /* Prevent card click */ />
                )}
              </Box>
            )}
             {/* Show existing media if no new preview is selected */}
            {!previewUrl && imageUrl && isValidUrl(imageUrl) && (
                <Box sx={{ maxHeight: 300, overflow: 'hidden', display: 'flex', justifyContent: 'center', border: '1px solid #eee', borderRadius: 1, my: 1, opacity: 0.7 }}>
                    <PostMedia component="img" image={imageUrl} alt="Current post content" />
                </Box>
            )}
            {!previewUrl && videoUrl && isValidUrl(videoUrl) && (
                 <Box sx={{ maxHeight: 300, overflow: 'hidden', display: 'flex', justifyContent: 'center', border: '1px solid #eee', borderRadius: 1, my: 1, opacity: 0.7 }}>
                    <PostMedia component="video" controls src={videoUrl} />
                 </Box>
            )}


            {/* Action Buttons Row 1: Upload and Delete */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              {/* File Input Button */}
              <Button
                variant="outlined"
                component="label"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedFile ? "Change Media" : "Upload Media"}
                <input
                  type="file"
                  hidden
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </Button>
              {/* Delete Button */}
              <Button
                variant="contained"
                color="error"
                onClick={handleDeletePost}
                // startIcon={<Delete />}
              >
                Delete Post
              </Button>
            </Box>

            {/* Action Buttons Row 2: Cancel and Save */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              {/* Cancel Button */}
              <Button variant="outlined" onClick={cancelEditHandler}>Cancel</Button>
              {/* Save Button */}
              <Button variant="contained" onClick={editPostHandler}>Save Changes</Button>
            </Box>
          </Box>
        ) : (

          body && <PostText variant="body1">{body}</PostText>
        )}
      </PostContent>


      {!isEditing && imageUrl && isValidUrl(imageUrl) && (
        <PostMedia component="img" image={imageUrl} alt="Post content" />
      )}
      {!isEditing && videoUrl && isValidUrl(videoUrl) && (
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
