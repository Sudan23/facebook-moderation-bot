import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SyncIcon from '@mui/icons-material/Sync';
import CommentIcon from '@mui/icons-material/Comment';
import WarningIcon from '@mui/icons-material/Warning';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Dashboard Component
 * Displays statistics and charts for comment moderation
 */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [syncMessage, setSyncMessage] = useState(null);

  // Fetch statistics from API
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/comments/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sync comments from Facebook
  const handleSync = async () => {
    try {
      setSyncing(true);
      setSyncMessage(null);
      setError(null);
      const token = localStorage.getItem('token');
      
      // This would need a page ID in a real implementation
      const response = await axios.post(
        `${API_URL}/comments/sync`,
        { pageId: 'mock_page_id' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSyncMessage(`Synced ${response.data.data.newComments} new comments`);
      fetchStats(); // Refresh stats after sync
    } catch (err) {
      console.error('Error syncing comments:', err);
      setError('Failed to sync comments. Please check your Facebook connection.');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Prepare chart data
  const chartData = stats
    ? [
        { name: 'Total', value: stats.total, fill: '#2196f3' },
        { name: 'Hateful', value: stats.hateful, fill: '#f44336' },
        { name: 'Negative', value: stats.negative, fill: '#ff9800' },
        { name: 'Auto-Moderated', value: stats.autoModerated, fill: '#4caf50' },
      ]
    : [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={syncing ? <CircularProgress size={20} /> : <SyncIcon />}
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? 'Syncing...' : 'Sync Comments'}
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {syncMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSyncMessage(null)}>
          {syncMessage}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CommentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Total Comments
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {stats?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Hateful
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="error">
                {stats?.hateful || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ThumbDownIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Negative
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="warning.main">
                {stats?.negative || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AutoModeIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Auto-Moderated
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {stats?.autoModerated || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" mb={2} fontWeight="bold">
            Moderation Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Dashboard;
