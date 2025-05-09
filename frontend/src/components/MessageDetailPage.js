import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import ErrorIcon from '@mui/icons-material/Error';

const MessageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchMessage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/messages/${id}`);
        
        if (!response.data) {
          throw new Error('Message data not received');
        }

        // Additional client-side authorization check
        const isSender = user.id === response.data.sender._id;
        const isRecipient = user.email === response.data.recipientEmail;
        
        if (!isSender && !isRecipient) {
          setUnauthorized(true);
          return;
        }

        // If recipient, verify message is delivered
        if (isRecipient && !response.data.isDelivered) {
          setError('This message has not been delivered yet');
          return;
        }

        setMessage(response.data);
      } catch (err) {
        console.error('Error fetching message:', err);
        
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.msg || 
                           err.message || 
                           'Failed to fetch message';
        
        setError(errorMessage);
        
        // Handle 401/403 errors specifically
        if (err.response?.status === 401 || err.response?.status === 403) {
          setUnauthorized(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id, user, token, navigate]);

  const handleBack = () => navigate(-1);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2 
        }}>
          <CircularProgress size={60} />
          <Typography variant="body1">Loading message...</Typography>
        </Box>
      </Container>
    );
  }

  if (unauthorized) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          icon={<ErrorIcon fontSize="large" />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Unauthorized Access
          </Typography>
          <Typography>
            You don't have permission to view this message
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleBack}
          size="large"
        >
          Back to Messages
        </Button>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          icon={<ErrorIcon fontSize="large" />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Error Loading Message
          </Typography>
          <Typography>
            {error}
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={handleBack}
          size="large"
        >
          Back to Messages
        </Button>
      </Container>
    );
  }

  if (!message) {
    return null;
  }

  const isSender = user.id === message.sender._id;
  const isRecipient = user.email === message.recipientEmail;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        onClick={handleBack} 
        variant="outlined"
        sx={{ mb: 3 }}
      >
        &larr; Back to Messages
      </Button>
      
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        {/* Message Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          gap: 2
        }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              fontSize: '1.75rem',
              bgcolor: isSender ? 'primary.main' : 'secondary.main'
            }}
          >
            {isSender ? 
              user.name.charAt(0).toUpperCase() : 
              message.sender?.name?.charAt(0).toUpperCase() || '?'
            }
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {message.subject}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {isSender ? 
                `To: ${message.recipientEmail}` : 
                `From: ${message.sender?.name || 'Unknown Sender'}`
              }
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Message Metadata */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5,
          mb: 3 
        }}>
          <Chip 
            label={
              message.isDelivered ? 
                `Delivered: ${format(new Date(message.deliveredAt), 'MMM d, yyyy h:mm a')}` : 
                `Scheduled: ${format(new Date(message.deliveryDate), 'MMM d, yyyy h:mm a')}`
            } 
            color={message.isDelivered ? 'success' : 'info'}
            variant="outlined"
          />
          <Chip 
            label={`Created: ${format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}`} 
            variant="outlined"
          />
        </Box>

        {/* Message Body */}
        <Box sx={{ 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1, 
          p: 3,
          backgroundColor: 'background.paper',
          whiteSpace: 'pre-wrap',
          minHeight: 200
        }}>
          <Typography component="div" variant="body1">
            {message.body}
          </Typography>
        </Box>

        {/* Delivery Notice for Recipient */}
        {isRecipient && !message.isDelivered && (
          <Alert severity="info" sx={{ mt: 3 }}>
            This message will be delivered to you on {format(new Date(message.deliveryDate), 'MMM d, yyyy h:mm a')}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default MessageDetailPage;