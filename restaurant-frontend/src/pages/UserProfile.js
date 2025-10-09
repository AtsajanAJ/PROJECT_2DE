import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const UserProfile = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        👤 User Profile
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your user profile, view saved restaurants, and track your nutrition history.
          This feature is coming soon!
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserProfile;
