// pages/SubscriptionEvents.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  TablePagination,
  CircularProgress,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSubscriptionEvents, SubscriptionEvent } from '../services/subscriptionApi';

const SubscriptionEvents: React.FC = () => {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const navigate = useNavigate();
  const [events, setEvents] = useState<SubscriptionEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadEvents = async () => {
      if (!subscriptionId) return;
      
      setLoading(true);
      try {
        const result = await fetchSubscriptionEvents(subscriptionId, page + 1, rowsPerPage);
        console.log('API Response:', result.data); // Debug log
        setEvents(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [subscriptionId, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'SUCCESS': return { color: 'success', label: 'Success' };
      case 'FAILED': return { color: 'error', label: 'Failed' };
      case 'PENDING': return { color: 'warning', label: 'Pending' };
      default: return { color: 'default', label: status };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Events for Subscription: {subscriptionId}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
        >
          Back to Subscriptions
        </Button>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Base Plan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.event_type || 'N/A'}</TableCell>
                   
                    <TableCell>
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>{event.platform || 'N/A'}</TableCell>
                    <TableCell>{event.amount || '0'}</TableCell>
                    <TableCell>{event.currency || 'N/A'}</TableCell>
                    <TableCell>{event.product_id || 'N/A'}</TableCell>
                    <TableCell>{event.base_plan_id || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default SubscriptionEvents;