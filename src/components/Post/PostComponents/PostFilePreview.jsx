import { Box } from '@mui/material'
import React from 'react'

const PostFilePreview = ({ previewUrl, previewType }) => {
  return (
    previewUrl ? (
        <Box
          sx={{
            maxHeight: 300,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            border: "1px solid #eee",
            borderRadius: 1,
            my: 1,
          }}
        >
          {previewType === "image" && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
              }}
            />
          )}
          {previewType === "video" && (
            <video
              controls
              src={previewUrl}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "300px",
              }}
              onClick={(e) =>
                e.stopPropagation()
              } /* Prevent card click */
            />
          )}
        </Box>
      ) : null
  )
}

export default PostFilePreview