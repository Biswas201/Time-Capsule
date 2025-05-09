import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage } from '../features/messages/messageSlice';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CreateMessagePage = () => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    subject: '',
    body: '',
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.messages);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      deliveryDate: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createMessage(formData))
      .unwrap()
      .then(() => {
        navigate('/sent');
      })
      .catch((err) => {
        console.error('Failed to create message:', err);
      });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Time Capsule
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="recipientEmail"
                name="recipientEmail"
                label="Recipient Email"
                type="email"
                value={formData.recipientEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="subject"
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="body"
                name="body"
                label="Message"
                multiline
                rows={6}
                value={formData.body}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Delivery Date & Time"
                  value={formData.deliveryDate}
                  onChange={handleDateChange}
                  minDateTime={new Date(Date.now() + 60 * 60 * 1000)} // At least 1 hour from now
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Creating...' : 'Create Time Capsule'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateMessagePage;