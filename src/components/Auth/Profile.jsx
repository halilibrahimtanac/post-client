import React, { useRef, useState, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  styled,
  Button,
  TextField,
  IconButton,
  Grid,
  Paper,
  Skeleton,
  Tooltip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Cake as CakeIcon,
  Event as EventIcon,
  AccountCircle as AccountIcon,
  PhotoCamera as CameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useGetProfileQuery } from "../../store/user/query";
import { useUpdateProfileMutation } from "../../store/user/mutation";
import ProfilePostList from "../Post/ProfilePostList";
import { useParams } from "react-router-dom";
import { constructMediaUrl } from "../../lib/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const ProfileRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[100],
  minHeight: "calc(100vh - 64px)", // Assuming header height is 64px
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 800,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: theme.shadows[5],
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 200,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: "50%",
  transform: "translate(-50%, 50%)",
  zIndex: 2,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 140,
  height: 140,
  border: `4px solid ${theme.palette.background.paper}`,
  backgroundColor: theme.palette.grey[300],
  fontSize: "4rem", // For fallback icon
  cursor: "default",
  transition: "transform 0.3s ease-in-out",
}));

const EditableAvatarWrapper = styled(Box)({
  position: "relative",
  cursor: "pointer",
  "&:hover .avatar-overlay": {
    opacity: 1,
  },
  "&:hover .styled-avatar": {
    transform: "scale(1.05)",
  },
});

const AvatarOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  pointerEvents: "none", // Let clicks pass through to wrapper
}));

const ProfileInfoContent = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(12) + "!important", // 140px avatar height / 2 + extra padding
  textAlign: "center",
}));

const DetailGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: "left",
}));

const DetailItem = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 3),
  position: "relative",
}));

const DetailIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "auto",
  marginRight: theme.spacing(2.5),
  color: theme.palette.primary.main,
}));

const EditContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const HiddenInput = styled("input")({
  display: "none",
});

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  try {
    const diff = Date.now() - new Date(birthDate).getTime();
    if (isNaN(diff)) return null;
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  } catch (e) {
    console.error("Error calculating age:", e);
    return null;
  }
};

const Profile = ({ mainUser = false }) => {
  const { username } = useParams();
  const user = useSelector(state => state.data.user);
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(mainUser ? null : username, { refetchOnMountOrArgChange: true });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const fileInputRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleEditToggle = useCallback(() => {
    if (!editMode && profile) {
      setEditData({
        name: profile.name,
        lastname: profile.lastname,
        birthDate: profile.birthDate ? dayjs(profile.birthDate) : null,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } else {
      setEditData({});
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setEditMode(!editMode);
  }, [editMode, profile]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((newDate) => {
    setEditData((prev) => ({ ...prev, birthDate: newDate }));
  }, []);

  const handleAvatarClick = useCallback(() => {
    if (mainUser && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [mainUser]);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ""; // Reset input value
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (!profile) return;

    const formData = new FormData();
    let hasChanges = false;

    if (selectedFile) {
      formData.append("file", selectedFile);
      hasChanges = true;
    }
    if (editData.name !== profile.name) {
      formData.append("name", editData.name);
      hasChanges = true;
    }
    if (editData.lastname !== profile.lastname) {
      formData.append("lastname", editData.lastname);
      hasChanges = true;
    }
    if (
      editData.birthDate &&
      (!profile.birthDate ||
        !dayjs(editData.birthDate).isSame(dayjs(profile.birthDate), "day"))
    ) {
      // Format date as YYYY-MM-DD
      const formattedDate = dayjs(editData.birthDate).format("YYYY-MM-DD");
      formData.append("birthDate", formattedDate);
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        await updateProfile(formData).unwrap();
        setEditMode(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        refetch(); // Refetch profile data after successful update
      } catch (err) {
        console.error("Failed to update profile:", err);
        // Consider showing an error message to the user
      }
    } else {
      setEditMode(false); // No changes, just exit edit mode
    }
  }, [profile, editData, selectedFile, updateProfile, refetch]);

  const avatarSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (profile?.profilePicture)
      return constructMediaUrl(profile.profilePicture);
    return undefined; // Let Avatar component handle fallback
  }, [previewUrl, profile?.profilePicture]);

  const formattedBirthDate = useMemo(() => {
    const dateToFormat = editMode ? editData.birthDate : profile?.birthDate;
    if (!dateToFormat) return "Not set";
    try {
      return format(dayjs(dateToFormat).toDate(), "d MMMM, yyyy");
    } catch {
      return "Invalid Date";
    }
  }, [editMode, editData.birthDate, profile?.profileDate]);

  const age = useMemo(() => {
    const dateForAge = editMode ? editData.birthDate : profile?.birthDate;
    return calculateAge(dateForAge ? dayjs(dateForAge).toDate() : null);
  }, [editMode, editData.birthDate, profile?.birthDate]);

  if (isLoading) {
    return (
      <ProfileRoot>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography>Loading Profile...</Typography>
        </Box>
      </ProfileRoot>
    );
  }

  if (error) {
    return (
      <ProfileRoot>
        <Alert
          severity="error"
          sx={{ width: "100%", maxWidth: 600 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={refetch}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          Error loading profile:{" "}
          {error?.data?.message || error.message || "Unknown error"}
        </Alert>
      </ProfileRoot>
    );
  }

  if (!profile) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ProfileRoot>
        <ProfilePaper elevation={3}>
          <ProfileHeader>
            <AvatarWrapper>
              <EditableAvatarWrapper
                onClick={handleAvatarClick}
                className={mainUser ? "editable" : ""}
              >
                <StyledAvatar
                  src={avatarSrc}
                  alt={`${profile.name} ${profile.lastname}`}
                  className="styled-avatar"
                >
                  {!avatarSrc && <PersonIcon fontSize="inherit" />}
                </StyledAvatar>
                {mainUser && editMode && (
                  <AvatarOverlay className="avatar-overlay">
                    <CameraIcon sx={{ color: "white", fontSize: 40 }} />
                  </AvatarOverlay>
                )}
              </EditableAvatarWrapper>
            </AvatarWrapper>
            <HiddenInput
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              disabled={!mainUser}
            />
          </ProfileHeader>

          <ProfileInfoContent>
            {editMode ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    width: "100%",
                    maxWidth: 400,
                  }}
                >
                  <TextField
                    label="First Name"
                    name="name"
                    value={editData.name || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Last Name"
                    name="lastname"
                    value={editData.lastname || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h4" component="h1" fontWeight={600}>
                  {profile.name} {profile.lastname}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  @{profile.username}
                </Typography>
              </>
            )}

            {mainUser && (
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {editMode ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveChanges}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CancelIcon />}
                      onClick={handleEditToggle}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <DetailGrid container spacing={1}>
              <DetailItem item xs={12} md={6}>
                <DetailIcon>
                  <EmailIcon />
                </DetailIcon>
                <ListItemText
                  primary="Email"
                  secondary={profile.email}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </DetailItem>

              <DetailItem item xs={12} md={6}>
                <DetailIcon>
                  <CakeIcon />
                </DetailIcon>
                {editMode ? (
                  <DatePicker
                    label="Birth Date"
                    value={editData.birthDate}
                    onChange={handleDateChange}
                    maxDate={dayjs()} // Users cannot be born in the future
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                ) : (
                  <ListItemText
                    primary="Birth Date"
                    secondary={
                      profile.birthDate
                        ? `${formattedBirthDate} ${age ? `(${age} years)` : ""}`
                        : "Not set"
                    }
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                )}
              </DetailItem>

              <DetailItem item xs={12} md={6}>
                <DetailIcon>
                  <EventIcon />
                </DetailIcon>
                <ListItemText
                  primary="Member Since"
                  secondary={format(new Date(profile.createdAt), "MMMM yyyy")}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </DetailItem>
            </DetailGrid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Posts
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ProfilePostList username={mainUser ? user.username : username} />
            </Box>
          </ProfileInfoContent>
        </ProfilePaper>
      </ProfileRoot>
    </LocalizationProvider>
  );
};

export default Profile;
