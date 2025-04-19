import { Edit } from "@mui/icons-material";
import { Avatar, Box, CardHeader, IconButton, Typography } from "@mui/material";
import React from "react";
import { constructMediaUrl } from "../../../lib/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PostHeader = ({
  user,
  body,
  formattedDate,
  isEditing,
  setIsEditing,
  setEditBody,
  cancelEditHandler,
}) => {
  const loggedUser = useSelector((state) => state.data.user);
  const navigate = useNavigate();
  
  const profileNavigate = (e) => {
    e.stopPropagation();
    navigate(
      loggedUser.username === user.username
        ? "/profile"
        : `/user/profile/${user.username}`
    );
  };
  return (
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
  );
};

export default PostHeader;
