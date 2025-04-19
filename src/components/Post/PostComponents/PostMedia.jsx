import React from "react";
import { isValidUrl } from "../../../lib/utils";
import { Box, CardMedia, styled } from "@mui/material";

const PostMediaBox = styled(CardMedia)({
  width: "100%",
  maxHeight: 500,
  objectFit: "cover",
  borderBottom: "1px solid #eee",
  borderTop: "1px solid #eee",
});

const PostMedia = ({ previewUrl, imageUrl, videoUrl, isEditing }) => {
  return (
    <>
      {!previewUrl && imageUrl && isValidUrl(imageUrl) && (
        <Box
          sx={{
            maxHeight: 300,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            border: "1px solid #eee",
            borderRadius: 1,
            my: 1,
            opacity: isEditing ? 0.7 : 1,
          }}
        >
          <PostMediaBox
            component="img"
            image={imageUrl}
            alt="Current post content"
          />
        </Box>
      )}
      {!previewUrl && videoUrl && isValidUrl(videoUrl) && (
        <Box
          sx={{
            maxHeight: 300,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            border: "1px solid #eee",
            borderRadius: 1,
            my: 1,
            opacity: isEditing ? 0.7 : 1,
          }}
        >
          <PostMediaBox component="video" controls src={videoUrl} />
        </Box>
      )}
    </>
  );
};

export default PostMedia;
