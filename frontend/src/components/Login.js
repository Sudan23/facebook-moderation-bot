import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

/**
 * Login Component
 * Handles Facebook OAuth authentication
 */
function Login() {
  const handleFacebookLogin = () => {
    // In a real implementation, this would redirect to Facebook OAuth
    // For now, we'll create a mock token for development
    const mockToken = 'mock_jwt_token_for_development';
    localStorage.setItem('token', mockToken);
    window.location.href = '/dashboard';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Facebook Moderation Bot
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            AI-powered comment moderation for your Facebook pages
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookLogin}
            sx={{
              backgroundColor: '#1877f2',
              '&:hover': {
                backgroundColor: '#166fe5',
              },
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
            }}
          >
            Login with Facebook
          </Button>
          
          <Typography variant="caption" display="block" sx={{ mt: 3 }} color="text.secondary">
            By logging in, you agree to our terms and conditions
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
