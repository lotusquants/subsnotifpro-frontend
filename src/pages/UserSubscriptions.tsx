
// pages/UserSubscriptions.tsx
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
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  TableFooter
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { ContentCopy, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { fetchUserSubscriptions, fetchSubscriptionEvents, SubscriptionEvent } from '../services/subscriptionApi';

interface Subscription {
  ID: string;
  SubscriptionID: string;
  ActivePlatform: string;
  Status: string;
  ProductId: string;
  PlanType: string;
  StartDate: string;
  NextRenewalDate: string | null;
  ExpirationDate: string | null;
  PurchaseToken: string;
}


const UserSubscriptions: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [events, setEvents] = useState<Record<string, SubscriptionEvent[]>>({});
  const [eventsLoading, setEventsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const result = await fetchUserSubscriptions(userId, page + 1, rowsPerPage);
        setSubscriptions(result.data as unknown as Subscription[]);
        setTotal(result.total);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [userId, page, rowsPerPage]);

  const toggleRowExpansion = async (subscriptionId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [subscriptionId]: !prev[subscriptionId]
    }));

    // Load events if not already loaded
    if (!events[subscriptionId] && !eventsLoading[subscriptionId]) {
      setEventsLoading(prev => ({ ...prev, [subscriptionId]: true }));
      try {
        const result = await fetchSubscriptionEvents(subscriptionId, 1, 10);
        setEvents(prev => ({
          ...prev,
          [subscriptionId]: result.data as unknown as SubscriptionEvent[]
        }));
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setEventsLoading(prev => ({ ...prev, [subscriptionId]: false }));
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { color: 'success', label: 'Active' };
      case 'EXPIRED': return { color: 'error', label: 'Expired' };
      case 'CANCELLED': return { color: 'warning', label: 'Cancelled' };
      default: return { color: 'default', label: status };
    }
  };

  const formatPlatform = (platform: string) => {
    switch (platform) {
      case 'GOOGLE_PLAYSTORE': return { color: 'primary', label: 'Google Play' };
      case 'APPSTORE': return { color: 'secondary', label: 'App Store' };
      default: return { color: 'default', label: platform };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h5">
          User ID: {userId}
        </Typography>
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
                  <TableCell />
                  <TableCell>Purchase Token</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Renewal Date</TableCell>
                  <TableCell>Expiration Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptions.map((sub) => (
                  <React.Fragment key={sub.SubscriptionID}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(sub.SubscriptionID)}
                        >
                          {expandedRows[sub.SubscriptionID] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {sub.PurchaseToken.slice(0, 15)}...
                          <Tooltip title="Copy Purchase Token">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(sub.PurchaseToken);
                              }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={formatPlatform(sub.ActivePlatform).label}
                          color={formatPlatform(sub.ActivePlatform).color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{sub.ProductId}</TableCell>
                      <TableCell>
                        <Chip 
                          label={formatStatus(sub.Status).label}
                          color={formatStatus(sub.Status).color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{sub.PlanType}</TableCell>
                      <TableCell>{new Date(sub.StartDate).toLocaleString()}</TableCell>
                      <TableCell>
                        {sub.NextRenewalDate ? new Date(sub.NextRenewalDate).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        {sub.ExpirationDate ? new Date(sub.ExpirationDate).toLocaleString() : '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ padding: 0 }} colSpan={9}>
                        <Collapse in={expandedRows[sub.SubscriptionID]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Events
                            </Typography>
                            {eventsLoading[sub.SubscriptionID] ? (
                              <CircularProgress size={24} />
                            ) : events[sub.SubscriptionID]?.length ? (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                  <TableCell>Timestamp</TableCell>
                                    <TableCell>Event Type</TableCell>
                                    
                                    
                                   
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {events[sub.SubscriptionID]?.map((event) => (
                                    <TableRow key={event.id}>
                                     <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                                      <TableCell>{event.event_type}</TableCell>
                                     
                                      
                                      
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography variant="body2">No events found</Typography>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={9}
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default UserSubscriptions;