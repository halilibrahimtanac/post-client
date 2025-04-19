import { Box, Button } from "@mui/material";
import React from "react";

const PostEditActions = ({
  selectedFile,
  handleFileChange,
  handleDeletePost,
  cancelEditHandler,
  editPostHandler
}) => {
    
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        {/* Cancel Button */}
        <Button variant="outlined" onClick={cancelEditHandler}>
          Cancel
        </Button>
        {/* Save Button */}
        <Button variant="contained" onClick={editPostHandler}>
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default PostEditActions;
