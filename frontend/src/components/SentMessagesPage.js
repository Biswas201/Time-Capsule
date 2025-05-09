import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSentMessages } from '../features/messages/messageSlice';
import { 
  Container, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Chip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const SentMessagesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sentMessages, status } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchSentMessages());
    }
  }, [dispatch, user]);

  const handleCreateNew = () => {
    navigate('/create');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Sent Time Capsules</Typography>
        <Button variant="contained" onClick={handleCreateNew}>
          Create New
        </Button>
      </Box>
      
      {status === 'loading' ? (
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      ) : sentMessages.length === 0 ? (
        <Typography sx={{ mt: 2 }}>You haven't sent any time capsules yet.</Typography>
      ) : (
        <List sx={{ mt: 2 }}>
          {sentMessages.map((message) => (
            <React.Fragment key={message._id}>
              <ListItem 
                button 
                onClick={() => navigate(`/message/${message._id}`)}
                sx={{ py: 2 }}
              >
                <ListItemText
                  primary={message.subject}
                  secondary={
                    <>
                      To: {message.recipientEmail} | 
                      Delivery: {formatDistanceToNow(new Date(message.deliveryDate))} from now
                      {message.isDelivered && (
                        <Chip 
                          label="Delivered" 
                          size="small" 
                          color="success" 
                          sx={{ ml: 1 }} 
                        />
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default SentMessagesPage;