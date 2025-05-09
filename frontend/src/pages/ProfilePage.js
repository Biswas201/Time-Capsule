import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Box, 
  Avatar, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Profile
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5">{user.name}</Typography>
          </Box>
          
          <List>
            <ListItem>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Member Since" secondary={new Date(user.createdAt).toLocaleDateString()} />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;