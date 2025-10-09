import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
  Restaurant as RestaurantIcon,
  DirectionsRun as RunIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  runnerType: yup
    .string()
    .required('Runner type is required'),
  budgetInterest: yup
    .number()
    .required('Budget interest is required')
    .min(50, 'Budget must be at least $50')
    .max(2000, 'Budget must be less than $2000'),
});

const runnerTypes = [
  'Sprint',
  'Middle Distance', 
  'Long Distance',
  'Marathon',
  'Ultra Marathon'
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      runnerType: '',
      budgetInterest: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    clearError();
    const { confirmPassword, ...registerData } = data;
    
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your credentials.' 
        } 
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          sx={{
            display: 'flex',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            width: '100%',
            maxWidth: 900,
            minHeight: 600,
          }}
        >
          {/* Left Side - Registration Form */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 2,
                }}
              >
                Hello, Guys!
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '16px',
                  width: '100%',
                  maxWidth: 400,
                  '& .MuiAlert-icon': {
                    fontSize: '24px',
                  },
                }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            {/* Registration Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                width: '100%',
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Username */}
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#ec4899' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                      },
                    }}
                  />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#ec4899' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                      },
                    }}
                  />
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#ec4899' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                      },
                    }}
                  />
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#ec4899' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                      },
                    }}
                  />
                )}
              />

              {/* Runner Type */}
              <Controller
                name="runnerType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.runnerType}>
                    <InputLabel>Runner Type</InputLabel>
                    <Select
                      {...field}
                      label="Runner Type"
                      startAdornment={
                        <InputAdornment position="start">
                          <RunIcon sx={{ color: '#ec4899', ml: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: '16px',
                      }}
                    >
                      {runnerTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.runnerType && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                        {errors.runnerType.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              {/* Budget Interest */}
              <Controller
                name="budgetInterest"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Monthly Budget ($)"
                    type="number"
                    error={!!errors.budgetInterest}
                    helperText={errors.budgetInterest?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RestaurantIcon sx={{ color: '#ec4899' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                      },
                    }}
                  />
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  py: 2,
                  mt: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 25px 50px rgba(236, 72, 153, 0.4)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component="button"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      color: '#ec4899',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Welcome Message */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(244, 114, 182, 0.8) 100%), url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.3) 100%)',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'white',
              }}
            >
              Glad to see You!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                maxWidth: 300,
              }}
            >
              Welcome to Runner's Guide! Create your account to get personalized restaurant recommendations based on your running preferences and dietary needs.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
