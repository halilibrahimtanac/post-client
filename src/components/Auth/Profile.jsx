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
  Button
} from '@mui/material';
import {
  Email as EmailIcon,
  Cake as CakeIcon,
  Event as EventIcon,
  AccountCircle as AccountIcon,
  Camera
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useGetProfileQuery } from '../../store/user/query';
import { useUpdateProfileMutation } from '../../store/user/mutation';
import ProfilePostList from '../Post/ProfilePostList';
import { useParams } from 'react-router-dom';
import { constructMediaUrl } from '../../lib/utils';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setSelectedImage(imageUrl);
      // Here you would typically upload the image to your server
    }
  };

  const save = async () => {
    try{
        const formData = new FormData();
        formData.append("file", selectedFile);
        await updateProfile(formData);
        setSelectedImage(null);
    }catch(err){
        console.log(err);
    }
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
            onMouseLeave={() => setIsHovered(false)}>
            <ProfileAvatar 
              src={selectedImage || constructMediaUrl(profile.profilePicture)} 
              alt={`${profile.name} ${profile.lastname}`}
            >
              {!profile.profilePicture && !selectedImage && (
                <AccountIcon sx={{ fontSize: 60, zIndex: 1, opacity: (isHovered && mainUser) ? 0.5 : 1 }} />
              )}
            </ProfileAvatar>
            <AvatarOverlay sx={{ opacity: (isHovered && mainUser) ? 1 : 0 }}>
              <Camera sx={{ color: 'white', fontSize: 40, zIndex: 2 }} />
            </AvatarOverlay>
          </ProfileAvatarWrapper>
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </ProfileHeader>

        <ProfileContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            {profile.name} {profile.lastname}
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ color: '#636e72', mb: 3 }}
          >
            @{profile.username}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <DetailList>
            <DetailItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color='primary' />
              </ListItemIcon>
              <ListItemText 
                primary="Email" 
                secondary={profile.email}
              />
            </DetailItem>

            <DetailItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CakeIcon color='primary' />
              </ListItemIcon>
              {profile.birthDate && <ListItemText 
                primary="Birth Date" 
                secondary={`${format(new Date(profile.birthDate), 'd MMMM, yyyy')} (${calculateAge(profile.birthDate)} years)`}
              />}
            </DetailItem>

            <DetailItem>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EventIcon color='primary' />
              </ListItemIcon>
              <ListItemText 
                primary="Member Since" 
                secondary={format(new Date(profile.createdAt), 'MMMM yyyy')}
              />
            </DetailItem>
          </DetailList>

          {selectedImage && <Button variant='contained' onClick={save}>Save</Button>}

          <ProfilePostList username={username}/>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;