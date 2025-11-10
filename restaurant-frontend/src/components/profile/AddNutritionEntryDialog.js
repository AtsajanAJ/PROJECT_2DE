import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
const AddNutritionEntryDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    restaurant: '',
    meal: 'Breakfast',
    calories: '',
    carbs: 'Medium',
    protein: 'Medium',
    fat: 'Medium',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const nutritionLevels = ['Low', 'Medium', 'High'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.restaurant.trim()) {
      newErrors.restaurant = 'Restaurant name is required';
    }
    
    if (!formData.calories || formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Pass the form data to parent component to save with userId
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      restaurant: '',
      meal: 'Breakfast',
      calories: '',
      carbs: 'Medium',
      protein: 'Medium',
      fat: 'Medium',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Add Nutrition Entry</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Restaurant Name"
              value={formData.restaurant}
              onChange={(e) => handleInputChange('restaurant', e.target.value)}
              error={!!errors.restaurant}
              helperText={errors.restaurant}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Meal Type</InputLabel>
              <Select
                value={formData.meal}
                onChange={(e) => handleInputChange('meal', e.target.value)}
                label="Meal Type"
                sx={{
                  borderRadius: '8px',
                }}
              >
                {mealTypes.map((meal) => (
                  <MenuItem key={meal} value={meal}>{meal}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={formData.calories}
              onChange={(e) => handleInputChange('calories', e.target.value)}
              error={!!errors.calories}
              helperText={errors.calories}
              inputProps={{ min: 0, step: 10 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Carbohydrates</InputLabel>
              <Select
                value={formData.carbs}
                onChange={(e) => handleInputChange('carbs', e.target.value)}
                label="Carbohydrates"
                sx={{
                  borderRadius: '8px',
                }}
              >
                {nutritionLevels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Protein</InputLabel>
              <Select
                value={formData.protein}
                onChange={(e) => handleInputChange('protein', e.target.value)}
                label="Protein"
                sx={{
                  borderRadius: '8px',
                }}
              >
                {nutritionLevels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Fat</InputLabel>
              <Select
                value={formData.fat}
                onChange={(e) => handleInputChange('fat', e.target.value)}
                label="Fat"
                sx={{
                  borderRadius: '8px',
                }}
              >
                {nutritionLevels.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="e.g., Post-run recovery meal, pre-workout energy..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleClose}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ 
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          Save Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNutritionEntryDialog;
