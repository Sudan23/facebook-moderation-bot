import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CommentIcon from '@mui/icons-material/Comment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { QueryClient, QueryClientProvider } from 'react-query';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CommentsList from './components/CommentsList';
import Settings from './components/Settings';

// Create a client for react-query
const queryClient = new QueryClient();

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

/**
 * App Component
 * Main application with routing and navigation
 */
function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Comments', icon: <CommentIcon />, path: '/comments' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Moderation Bot
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                window.location.href = item.path;
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Box sx={{ display: 'flex' }}>
                  {/* App Bar */}
                  <AppBar
                    position="fixed"
                    sx={{
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                  >
                    <Toolbar>
                      {isMobile && (
                        <IconButton
                          color="inherit"
                          edge="start"
                          onClick={handleDrawerToggle}
                          sx={{ mr: 2 }}
                        >
                          <MenuIcon />
                        </IconButton>
                      )}
                      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Facebook Moderation Bot
                      </Typography>
                      {!isMobile && (
                        <Box>
                          {menuItems.map((item) => (
                            <Button
                              key={item.text}
                              color="inherit"
                              startIcon={item.icon}
                              onClick={() => (window.location.href = item.path)}
                            >
                              {item.text}
                            </Button>
                          ))}
                          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                            Logout
                          </Button>
                        </Box>
                      )}
                    </Toolbar>
                  </AppBar>

                  {/* Mobile Drawer */}
                  {isMobile && (
                    <Drawer
                      variant="temporary"
                      open={mobileOpen}
                      onClose={handleDrawerToggle}
                      ModalProps={{
                        keepMounted: true, // Better mobile performance
                      }}
                      sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                      }}
                    >
                      {drawer}
                    </Drawer>
                  )}

                  {/* Main Content */}
                  <Box component="main" sx={{ flexGrow: 1, p: 0, width: '100%' }}>
                    <Toolbar /> {/* Spacer for fixed AppBar */}
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/comments" element={<CommentsList />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Box>
                </Box>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
