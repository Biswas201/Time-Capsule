import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReceivedMessages } from '../features/messages/messageSlice';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ReceivedMessagesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receivedMessages, status } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchReceivedMessages());
    }
  }, [dispatch, user]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Received Time Capsules</Typography>
        
        {status === 'loading' ? (
          <Typography sx={{ mt: 2 }}>Loading...</Typography>
        ) : receivedMessages.length === 0 ? (
          <Typography sx={{ mt: 2 }}>You haven't received any time capsules yet.</Typography>
        ) : (
          <List sx={{ mt: 2 }}>
            {receivedMessages.map((message) => (
              <React.Fragment key={message._id}>
                <ListItem 
                  button 
                  onClick={() => navigate(`/message/${message._id}`)}
                  sx={{ py: 2 }}
                >
                  <Avatar sx={{ mr: 2 }}>
                    {message.sender?.name?.charAt(0).toUpperCase() || '?'}
                  </Avatar>
                  <ListItemText
                    primary={message.subject}
                    secondary={
                      <>
                        From: {message.sender?.name || 'Unknown'} | 
                        Delivered: {format(new Date(message.deliveredAt), 'MMM d, yyyy h:mm a')}

                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default ReceivedMessagesPage;