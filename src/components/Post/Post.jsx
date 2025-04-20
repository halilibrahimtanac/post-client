import React, { useState, useEffect } from "react";
import {
  Card,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { constructMediaUrl } from "../../lib/utils";
import { useDeletePostMutation, useEditPostMutation } from "../../store/post/mutation";
import PostHeader from "./PostComponents/PostHeader";
import PostContent from "./PostComponents/PostContent";
import PostMedia from "./PostComponents/PostMedia";
import PostActions from "./PostComponents/PostActions";

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
  refetch
}) => {
  const [editPost] = useEditPostMutation();
  const [deletePost] = useDeletePostMutation();
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
            await deletePost(id);
            refetch?.();
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

  

  return (
    <StyledCard onClick={() => navigate(`/post/${id}`)}>
      <PostHeader
        user={user}
        body={body}
        formattedDate={formattedDate}
        cancelEditHandler={cancelEditHandler}
        isEditing={isEditing}
        setEditBody={setEditBody}
        setIsEditing={setIsEditing}
      />

      <PostContent
        body={body}
        editBody={editBody}
        cancelEditHandler={cancelEditHandler}
        editPostHandler={editPostHandler}
        handleDeletePost={handleDeletePost}
        handleFileChange={handleFileChange}
        imageUrl={imageUrl}
        isEditing={isEditing}
        previewType={previewType}
        previewUrl={previewUrl}
        selectedFile={selectedFile}
        setEditBody={setEditBody}
        videoUrl={videoUrl}
      />

      {!isEditing && <PostMedia imageUrl={imageUrl} videoUrl={videoUrl} />}

      <PostActions likeList={likeList} commentCount={commentCount} likeCount={likeCount} id={id}/>
    
    </StyledCard>
  );
};

export default Post;
