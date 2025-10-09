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
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    clearError();
    const result = await login(data.username, data.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
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
            p: 6,
            borderRadius: '32px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            width: '100%',
            maxWidth: 480,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
              }}
            >
              <RestaurantIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Sign in to your Runner's Restaurant Guide account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get personalized restaurant recommendations for your running needs
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '16px',
                '& .MuiAlert-icon': {
                  fontSize: '24px',
                },
              }}
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username Field */}
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
                          <PersonIcon sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                )}
              />

              {/* Password Field */}
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
                          <LockIcon sx={{ color: 'primary.main' }} />
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
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#6366f1',
                          borderWidth: '2px',
                        },
                      },
                    }}
                  />
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{
                  py: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 25px 50px rgba(99, 102, 241, 0.4)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              New to Runner's Guide?
            </Typography>
          </Divider>

          {/* Register Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don't have an account yet?
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '16px',
                borderWidth: '2px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderWidth: '2px',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create Account
            </Button>
          </Box>

          {/* Demo Credentials */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#0369a1' }}>
              🧪 Demo Credentials
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#0369a1' }}>
                <strong>Admin:</strong> admin / admin123
              </Typography>
              <Typography variant="body2" sx={{ color: '#0369a1' }}>
                <strong>User:</strong> testuser / password123
              </Typography>
              <Typography variant="body2" sx={{ color: '#0369a1' }}>
                <strong>Demo:</strong> demo / demo123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
