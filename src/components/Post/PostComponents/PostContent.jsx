import { Box, styled, TextField, Typography } from "@mui/material";
import React from "react";
import PostFilePreview from "./PostFilePreview";
import PostMedia from "./PostMedia";
import PostEditActions from "./PostEditActions";

const PostContentBox = styled("div")({
  padding: "0 16px 16px",
});

const PostText = styled(Typography)({
    fontSize: "1rem",
    lineHeight: 1.5,
    color: "#333",
    marginTop: 12,
  });

const PostContent = ({
  isEditing,
  body,
  imageUrl,
  videoUrl,
  editBody,
  setEditBody,
  previewUrl,
  previewType,
  selectedFile,
  handleFileChange,
  handleDeletePost,
  cancelEditHandler,
  editPostHandler,
}) => {
  return (
    <PostContentBox>
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

          <PostFilePreview previewType={previewType} previewUrl={previewUrl} />

          {/* Show existing media if no new preview is selected */}
          <PostMedia
            previewUrl={previewUrl}
            imageUrl={imageUrl}
            videoUrl={videoUrl}
            isEditing={isEditing}
          />

          {/* Action Buttons Row 1: Upload and Delete */}
          <PostEditActions
            cancelEditHandler={cancelEditHandler}
            editPostHandler={editPostHandler}
            handleDeletePost={handleDeletePost}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
          />
        </Box>
      ) : (
        body && <PostText variant="body1">{body}</PostText>
      )}
    </PostContentBox>
  );
};

export default PostContent;
