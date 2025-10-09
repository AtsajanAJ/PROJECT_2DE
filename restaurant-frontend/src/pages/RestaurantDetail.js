import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';

const RestaurantDetail = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        🍽️ Restaurant Details
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Restaurant Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View detailed information about restaurants including nutrition profiles, 
          menu items, and user reviews. This feature is coming soon!
        </Typography>
      </Paper>
    </Container>
  );
};

export default RestaurantDetail;
