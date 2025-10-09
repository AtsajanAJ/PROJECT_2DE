import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const RestaurantSearch = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        🔍 Search Restaurants
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Advanced Restaurant Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search restaurants by cuisine type, location, budget, and nutrition profile.
          This feature is coming soon!
        </Typography>
      </Paper>
    </Container>
  );
};

export default RestaurantSearch;
