import React from 'react';
import {
  Alert,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Login as LoginIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AuthenticationAlert = ({ onRetry }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="warning" 
        icon={<LockIcon />}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              sx={{ fontWeight: 600 }}
            >
              Retry
            </Button>
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleLogin}
              startIcon={<LoginIcon />}
              sx={{ fontWeight: 600 }}
            >
              Login
            </Button>
          </Box>
        }
      >
        <Typography variant="h6" gutterBottom>
          Authentication Required
        </Typography>
        <Typography variant="body2">
          You need to be logged in to search restaurants. Please login to continue.
        </Typography>
      </Alert>
    </Box>
  );
};

const RateLimitAlert = ({ onRetry, retryCount = 0 }) => {
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRetry = () => {
    if (countdown === 0) {
      onRetry();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="info" 
        icon={<TimerIcon />}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {countdown > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">
                  {countdown}s
                </Typography>
              </Box>
            ) : (
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetry}
                startIcon={<RefreshIcon />}
                sx={{ fontWeight: 600 }}
              >
                Retry Now
              </Button>
            )}
          </Box>
        }
      >
        <Typography variant="h6" gutterBottom>
          Too Many Requests
        </Typography>
        <Typography variant="body2">
          You're making requests too quickly. Please wait a moment before trying again.
          {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
        </Typography>
      </Alert>
    </Box>
  );
};

const AuthenticationRequired = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
      <LockIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="text.secondary">
        Authentication Required
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        You need to be logged in to access restaurant search features.
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<LoginIcon />}
        onClick={handleLogin}
        size="large"
      >
        Go to Login
      </Button>
    </Paper>
  );
};

export { AuthenticationAlert, RateLimitAlert, AuthenticationRequired };
