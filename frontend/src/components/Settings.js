import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  Slider,
  Switch,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Settings Component
 * Allows users to configure moderation thresholds and auto-moderation settings
 */
function Settings() {
  const [settings, setSettings] = useState({
    autoModerate: true,
    toxicityThreshold: 0.7,
    sentimentThreshold: -0.5,
    autoHide: true,
    autoDelete: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch current settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      // In a real implementation, fetch user settings from API
      // For now, use default settings
      setSettings({
        autoModerate: true,
        toxicityThreshold: 0.7,
        sentimentThreshold: -0.5,
        autoHide: true,
        autoDelete: false,
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Using defaults.');
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      const token = localStorage.getItem('token');
      
      // In a real implementation, save to API
      // await axios.put(`${API_URL}/users/settings`, settings, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccessMessage('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Auto-Moderation Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" mb={2} fontWeight="bold">
                Auto-Moderation
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoModerate}
                    onChange={(e) => handleChange('autoModerate', e.target.checked)}
                  />
                }
                label="Enable automatic moderation"
              />
              
              <Typography variant="body2" color="text.secondary" ml={4}>
                Automatically analyze and moderate new comments based on thresholds
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Toxicity Threshold */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" mb={2} fontWeight="bold">
                Toxicity Threshold
              </Typography>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                Comments with toxicity score above this threshold will be flagged
              </Typography>
              
              <Box px={2}>
                <Slider
                  value={settings.toxicityThreshold}
                  onChange={(e, value) => handleChange('toxicityThreshold', value)}
                  min={0}
                  max={1}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 0.5, label: '0.5' },
                    { value: 1, label: '1' },
                  ]}
                  valueLabelDisplay="on"
                  disabled={!settings.autoModerate}
                />
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                Current: {settings.toxicityThreshold.toFixed(1)} (Default: 0.7)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sentiment Threshold */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" mb={2} fontWeight="bold">
                Sentiment Threshold
              </Typography>
              
              <Typography variant="body2" color="text.secondary" mb={2}>
                Comments with sentiment score below this threshold will be flagged as negative
              </Typography>
              
              <Box px={2}>
                <Slider
                  value={settings.sentimentThreshold}
                  onChange={(e, value) => handleChange('sentimentThreshold', value)}
                  min={-1}
                  max={1}
                  step={0.1}
                  marks={[
                    { value: -1, label: '-1' },
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                  ]}
                  valueLabelDisplay="on"
                  disabled={!settings.autoModerate}
                />
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                Current: {settings.sentimentThreshold.toFixed(1)} (Default: -0.5)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" mb={2} fontWeight="bold">
                Automatic Actions
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoHide}
                    onChange={(e) => handleChange('autoHide', e.target.checked)}
                    disabled={!settings.autoModerate}
                  />
                }
                label="Automatically hide flagged comments"
              />
              
              <Typography variant="body2" color="text.secondary" ml={4} mb={2}>
                Hide comments that exceed thresholds on Facebook
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoDelete}
                    onChange={(e) => handleChange('autoDelete', e.target.checked)}
                    disabled={!settings.autoModerate}
                  />
                }
                label="Automatically delete flagged comments"
              />
              
              <Typography variant="body2" color="text.secondary" ml={4}>
                <strong>Warning:</strong> This will permanently delete comments from Facebook
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;
