import React from "react";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  styled,
  CardMedia,
  CardContent,
  Chip,
  Skeleton,
  Alert,
  Grid,
  IconButton,
  Avatar, // Assuming user avatar is available on post
  Link as MuiLink,
  Paper, // If post title/body should link somewhere
} from "@mui/material";
import {
  Forum as ForumIcon, // Changed from ArticleIcon for better "feed" context
  FavoriteBorder as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Videocam as VideoIcon, // Specific icon for video overlay
  BrokenImage as BrokenImageIcon, // Placeholder for broken images
  Refresh as RefreshIcon,
  Favorite, // For error state
} from "@mui/icons-material";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useGetUserPostsQuery } from "../../store/post/query"; // Ensure this path is correct
import { constructMediaUrl } from "../../lib/utils"; // Ensure this path is correct
import { useSelector } from "react-redux";

const PostsRoot = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  width: '100%',
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
    paddingTop: theme.spacing(2),
}));

const PostCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%', // Ensure cards in a row have the same height if needed
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
  cursor: 'pointer', // Indicate clickable
  backgroundColor: theme.palette.background.paper,
}));

const MediaWrapper = styled(Box)({
  position: 'relative',
  paddingTop: '56.25%', // 16:9 Aspect Ratio
  backgroundColor: 'rgba(0, 0, 0, 0.04)', // Placeholder color
});

const StyledCardMedia = styled(CardMedia)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const MediaPlaceholder = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[200],
}));

const VideoIconOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  borderRadius: '50%',
  padding: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1, // Allows content to fill space if media is short/absent
  padding: theme.spacing(0.5),
  '&:last-child': { // Remove extra padding at the bottom
    paddingBottom: theme.spacing(0.5),
  },
}));

const PostFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 2, 1.5), // Padding: top 0, sides 2, bottom 1.5
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: 'auto', // Push footer to the bottom
}));

const PostActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ActionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  gap: theme.spacing(0.5),
}));

const EmptyState = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px dashed ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  width: '100%', // Take full width within the grid context if needed
  minHeight: 200, // Ensure it has some height
}));

const PostSkeleton = () => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ borderRadius: 1.5 }}>
        <Skeleton variant="rectangular" height={190} />
        <CardContent>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="80%" />
            <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width="60%" />
        </CardContent>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, pb: 1.5, pt: 0, borderTop: '1px solid lightgrey'}}>
            <Box sx={{ display: 'flex', gap: 2}}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width={20} />
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width={20} />
            </Box>
             <Skeleton variant="text" sx={{ fontSize: '0.8rem' }} width="30%" />
         </Box>
    </Card>
  </Grid>
);

const ProfilePostList = ({ username }) => {
  const user = useSelector(state => state.data.user);
  const { data, isLoading, error, refetch } = useGetUserPostsQuery(username);

  const posts = data || [];

  const renderMedia = (post) => {
    const mediaUrl = post.image ? constructMediaUrl(post.image) : post.video ? constructMediaUrl(post.video) : null;
    const isVideo = !!post.video;

    if (!mediaUrl) {
       return null; // Or a placeholder if no media is standard
    }

    return (
       <MediaWrapper>
        <StyledCardMedia
          component={isVideo ? "video" : "img"}
          src={mediaUrl}
          alt={post.body?.substring(0, 30) || (isVideo ? "Post video" : "Post image")}
          controls={isVideo}
          onError={(e) => { // Basic error handling for images
              if (!isVideo) {
                 e.target.style.display = 'none'; // Hide broken image icon if needed
                 e.target.parentElement.innerHTML = `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: grey;"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BrokenImageIcon"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path></svg></div>`; // Inject placeholder SVG
             }
          }}
        />
         {isVideo && <VideoIconOverlay><VideoIcon fontSize="small" /></VideoIconOverlay>}
      </MediaWrapper>
    );
  };

  const formatRelativeTime = (dateString) => {
     try {
         return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
     } catch (e) {
         return "Invalid date";
     }
  };

  if (error) {
    return (
      <PostsRoot>
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small" onClick={refetch}>
              <RefreshIcon />
            </IconButton>
          }
        >
           Failed to load posts. Please try again.
        </Alert>
       </PostsRoot>
    );
  }


  return (
    <PostsRoot>
       <StyledGrid container spacing={2.5}>
         {isLoading ? (
           Array.from(new Array(6)).map((_, index) => (
            <PostSkeleton key={index} />
          ))
        ) : posts.length > 0 ? (
           posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard elevation={1}>
                 {renderMedia(post)}
                <StyledCardContent>
                  <Typography variant="body1" component="p" sx={{ mb: 1 }}>
                      {post.body || <Typography component="span" fontStyle="italic" color="text.secondary">No content</Typography>}
                  </Typography>
                </StyledCardContent>
                <PostFooter>
                    <PostActions>
                        <ActionItem>
                           {post.Like.find(lk => lk.user.username === user.username) ? <Favorite fontSize="small" sx={{ color: "#e91e63" }} /> : <FavoriteIcon fontSize="small" />}
                            <Typography variant="body2">{post._count.Like || 0}</Typography>
                        </ActionItem>
                         <ActionItem>
                             <CommentIcon fontSize="small" />
                            <Typography variant="body2">{post._count.children || 0}</Typography>
                        </ActionItem>
                   </PostActions>
                   <Typography variant="caption" color="text.secondary">
                        {formatRelativeTime(post.createdAt)}
                   </Typography>
                </PostFooter>
              </PostCard>
            </Grid>
          ))
        ) : (
           <Grid item xs={12} > {/* Ensure empty state takes full width */}
             <EmptyState elevation={0}>
                 <ForumIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                <Typography variant="h6">No Posts Yet</Typography>
                <Typography variant="body2">
                  When {username} shares something, it will appear here.
                </Typography>
            </EmptyState>
          </Grid>
        )}
      </StyledGrid>
    </PostsRoot>
  );
};

export default ProfilePostList;