import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * CommentsList Component
 * Displays and manages comments with filtering and moderation actions
 */
function CommentsList() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  // Fetch comments from API
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/comments`, {
        params: {
          status: filter,
          page: page + 1,
          limit: rowsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setComments(response.data.data.comments);
      setTotal(response.data.data.pagination.total);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Moderate a comment
  const moderateComment = async (commentId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/comments/${commentId}/moderate`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh comments list
      fetchComments();
    } catch (err) {
      console.error('Error moderating comment:', err);
      setError(`Failed to ${action} comment. Please try again.`);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      hidden: 'info',
      deleted: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" mb={3}>
        Comments Management
      </Typography>

      {/* Filter Buttons */}
      <Box mb={3}>
        <ButtonGroup variant="outlined">
          <Button
            variant={filter === 'pending' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter('pending');
              setPage(0);
            }}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'approved' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter('approved');
              setPage(0);
            }}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'hidden' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter('hidden');
              setPage(0);
            }}
          >
            Hidden
          </Button>
          <Button
            variant={filter === 'deleted' ? 'contained' : 'outlined'}
            onClick={() => {
              setFilter('deleted');
              setPage(0);
            }}
          >
            Deleted
          </Button>
        </ButtonGroup>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Comments Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : comments.length === 0 ? (
            <Box textAlign="center" p={4}>
              <Typography color="text.secondary">
                No comments found with status: {filter}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Author</strong></TableCell>
                      <TableCell><strong>Message</strong></TableCell>
                      <TableCell align="center"><strong>Toxicity</strong></TableCell>
                      <TableCell align="center"><strong>Sentiment</strong></TableCell>
                      <TableCell align="center"><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Date</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment._id} hover>
                        <TableCell>{comment.from.name}</TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          {comment.message.substring(0, 100)}
                          {comment.message.length > 100 && '...'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${Math.round(comment.toxicityScore * 100)}%`}
                            size="small"
                            color={comment.toxicityScore > 0.7 ? 'error' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={comment.sentimentScore.toFixed(2)}
                            size="small"
                            color={comment.sentimentScore < -0.5 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={comment.status}
                            size="small"
                            color={getStatusColor(comment.status)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {format(new Date(comment.createdTime), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" gap={0.5} justifyContent="center">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => moderateComment(comment._id, 'approve')}
                              title="Approve"
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => moderateComment(comment._id, 'hide')}
                              title="Hide"
                            >
                              <VisibilityOffIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => moderateComment(comment._id, 'delete')}
                              title="Delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default CommentsList;
