import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Typography, IconButton } from "@mui/material";
import { PhotoCamera, VideoLibrary } from "@mui/icons-material";
import { useNewPostMutation } from "../../store/post/mutation";

const NewPost = () => {
  const [newPost] = useNewPostMutation();
  const [body, setBody] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if(!body && !media) return;

    const formData = new FormData();
    let str = JSON.stringify({ body })
    console.log(str);
    formData.append("body", body);
    if(media){
        formData.append("file", media);
    }

    try{
        await newPost(formData).unwrap();
        setBody("");
        setMedia(null);
        setPreview(null);
    }catch(err){
        console.log(err);
    }
  };

  return (
    <Card sx={{ maxWidth: 570, margin: "auto", padding: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create a New Post
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <input
          accept="image/*,video/*"
          style={{ display: "none" }}
          id="media-upload"
          type="file"
          onChange={handleMediaUpload}
        />
        <label htmlFor="media-upload">
          <IconButton color="primary" component="span">
            <PhotoCamera />
          </IconButton>
          <IconButton color="primary" component="span">
            <VideoLibrary />
          </IconButton>
        </label>
        {media && <Typography variant="body2">{media.name}</Typography>}
        {preview && (media.type.startsWith("image") ? (
          <img src={preview} alt="Preview" style={{ maxWidth: "100%", marginTop: 10, borderRadius: 5 }} />
        ) : (
          <video controls style={{ maxWidth: "100%", marginTop: 10, borderRadius: 5 }}>
            <source src={preview} type={media.type} />
            Your browser does not support the video tag.
          </video>
        ))}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewPost;
