import React,{ useRef, useState } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Cake as CakeIcon,
  Event as EventIcon,
  AccountCircle as AccountIcon,
  Camera,
  Edit
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useGetProfileQuery } from '../../store/user/query';
import { useUpdateProfileMutation } from '../../store/user/mutation';
import ProfilePostList from '../Post/ProfilePostList';
import { useParams } from 'react-router-dom';
import { constructMediaUrl } from '../../lib/utils';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

const ProfileContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
});

const ProfileCard = styled(Card)({
  width: '100%',
  maxWidth: 600,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
});

const ProfileHeader = styled(Box)({
  position: 'relative',
  height: 150,
  backgroundColor: '#2d3436',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
});

const ProfileAvatarWrapper = styled(Box)({
    position: 'relative',
    display: 'inline-block',
    left: "50%",
    top: "80%",
    cursor: 'pointer'
  });
  
  const AvatarOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  });

const ProfileAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  border: '4px solid white',
  position: 'absolute',
  bottom: '-60px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#1976d2',
});

const ProfileContent = styled(CardContent)({
  paddingTop: '80px !important',
  textAlign: 'center',
});

const DetailList = styled(List)({
  padding: '16px 0',
});

const DetailItem = styled(ListItem)({
  padding: '8px 24px',
});

const calculateAge = (birthDate) => {
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const Profile = ({ mainUser = true }) => {
  const { username } = useParams();
  const { data: profile, isLoading, error, refetch } = useGetProfileQuery(username);
  const [updateProfile] = useUpdateProfileMutation();
  const fileInputRef = useRef(null);
  const [updateFields, setUpdateFields] = useState({});
  const [isEditing, setIsEditing] = useState({ birthDate: false, nameLastName: false });
  const [isHovered, setIsHovered] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUpdateFields(prev => ({ ...prev, file, selectedImage: imageUrl}));
      // Here you would typically upload the image to your server
    }
  };

  const save = async () => {
    try{
        const formData = new FormData();
        Object.keys(updateFields).forEach(ky => {
          formData.append(ky, updateFields[ky]);
        })
        await updateProfile(formData);
        setUpdateFields({});
        setIsEditing({ birthDate: false, nameLastName: false });
    }catch(err){
        console.log(err);
    }
  }

  const setEditingState = (fieldName) => {
    setIsEditing(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const setUpdatingFieldsState = (fieldName, val) => {
    setUpdateFields(prev => ({
      ...prev,
      [fieldName]: val
    }))
  }

  if (isLoading) {
    return (
      <ProfileContainer>
        <CircularProgress size={60} thickness={4} sx={{ color: '#00b894' }} />
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <Alert 
          severity="error" 
          sx={{ width: '100%', maxWidth: 600 }}
          action={
            <button 
              onClick={refetch}
              style={{
                backgroundColor: '#00b894',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          }
        >
          Error loading profile: {error.message}
        </Alert>
      </ProfileContainer>
    );
  }

  if (!profile) return null;

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatarWrapper
            onClick={mainUser ? handleAvatarClick : () => {}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ProfileAvatar
              src={
                updateFields.selectedImage ||
                constructMediaUrl(profile.profilePicture)
              }
              alt={`${profile.name} ${profile.lastname}`}
            >
              {!profile.profilePicture && !updateFields.selectedImage && (
                <AccountIcon
                  sx={{
                    fontSize: 60,
                    zIndex: 1,
                    opacity: isHovered && mainUser ? 0.5 : 1,
                  }}
                />
              )}
            </ProfileAvatar>
            <AvatarOverlay sx={{ opacity: isHovered && mainUser ? 1 : 0 }}>
              <Camera sx={{ color: "white", fontSize: 40, zIndex: 2 }} />
            </AvatarOverlay>
          </ProfileAvatarWrapper>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </ProfileHeader>

        <ProfileContent>
          <div
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isEditing.nameLastName ? (
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <TextField
                  value={updateFields?.name || profile.name}
                  onChange={(e) =>
                    setUpdatingFieldsState("name", e.target.value)
                  }
                />
                <TextField
                  value={updateFields?.lastname || profile.lastname}
                  onChange={(e) =>
                    setUpdatingFieldsState("lastname", e.target.value)
                  }
                />
              </div>
            ) : (
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 600, marginBottom: 0 }}
              >
                {profile.name} {profile.lastname}
              </Typography>
            )}
            {mainUser && (
              <IconButton onClick={() => setEditingState("nameLastName")}>
                <Edit />
              </IconButton>
            )}
          </div>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#636e72", mb: 3 }}
          >
            @{profile.username}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <DetailList>
            <DetailItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={profile.email} />
            </DetailItem>

            <DetailItem
              onDoubleClick={
                mainUser ? () => setEditingState("birthDate") : null
              }
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CakeIcon color="primary" />
              </ListItemIcon>
              {isEditing.birthDate ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={
                      updateFields?.birthDate
                        ? dayjs(updateFields?.birthDate)
                        : dayjs(profile.birthDate)
                    }
                    onChange={(newDate) => {
                      setUpdateFields((prev) => ({
                        ...prev,
                        birthDate: `${newDate.$y}-${newDate.$M + 1}-${
                          newDate.$D
                        }`,
                      }));
                    }}
                    closeOnSelect
                  />
                </LocalizationProvider>
              ) : (
                (profile.birthDate || updateFields.birthDate) && (
                  <ListItemText
                    primary="Birth Date"
                    secondary={`${format(
                      new Date(updateFields.birthDate || profile.birthDate),
                      "d MMMM, yyyy"
                    )} (${calculateAge(
                      updateFields.birthDate || profile.birthDate
                    )} years)`}
                  />
                )
              )}
              {mainUser && (
                <IconButton
                  onClick={() => setEditingState("birthDate")}
                  sx={{ marginLeft: "auto" }}
                >
                  <Edit />
                </IconButton>
              )}
            </DetailItem>

            <DetailItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EventIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Member Since"
                secondary={format(new Date(profile.createdAt), "MMMM yyyy")}
              />
            </DetailItem>
          </DetailList>

          {Object.values(updateFields).some(Boolean) && (
            <Button variant="contained" onClick={save}>
              Save
            </Button>
          )}

          <ProfilePostList username={username} />
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;