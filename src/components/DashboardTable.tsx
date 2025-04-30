import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Chip, 
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { DashboardRecord } from '../types/dashboard';
import { ContentCopy } from '@mui/icons-material';
import ColumnSelector from './ColumnSelector';
import { loadColumnPrefs, saveColumnPrefs } from '../utils/ColumnPrefs';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardTableProps {
  data: DashboardRecord[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

const ALL_COLUMNS = [
  // 'Subscription ID',
  'User ID',
  'Product',
  'Base Plan',
  'Offer ID',
  'Platform',
  'Status',
  'Plan Type',
  'Latest Order',
  'Purchase Token',
  'Amount',
  'Start Time',
  'Renewal Time',
  'Expiration',
  'Last Modified'
];

const DashboardTable: React.FC<DashboardTableProps> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const navigate = useNavigate();
  const [columnPrefs, setColumnPrefs] = useState(() => {
    const saved = loadColumnPrefs();
    return saved || {
      order: ALL_COLUMNS,
      visible: ALL_COLUMNS
    };
  });

  useEffect(() => {
    saveColumnPrefs(columnPrefs);
  }, [columnPrefs]);

  const handleColumnToggle = (column: string) => {
    setColumnPrefs(prev => ({
      ...prev,
      visible: prev.visible.includes(column)
        ? prev.visible.filter(c => c !== column)
        : [...prev.visible, column]
    }));
  };

  const handleColumnOrderChange = (newOrder: string[]) => {
    setColumnPrefs(prev => ({ ...prev, order: newOrder }));
  };

  const orderedVisibleColumns = columnPrefs.order.filter(col => 
    columnPrefs.visible.includes(col)
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(1);
  };

  const columnMap: Record<string, string> = {
    // 'Subscription ID': 'subscriptionID',
    'User ID': 'platformUserID',
    'Product': 'productID',
    'Base Plan': 'basePlanID',
    'Offer ID': 'activeOfferID',
    'Platform': 'platform',
    'Status': 'status',
    'Plan Type': 'planType',
    'Latest Order': 'latestOrderID',
    'Purchase Token': 'purchaseToken',
    'Amount': 'totalAmount',
    'Start Time': 'startDate',
    'Renewal Time': 'renewalDate',
    'Expiration': 'expirationDate',
    'Last Modified': 'lastModified'
  };

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}/subscriptions`);
  };

  


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <ColumnSelector
          columns={ALL_COLUMNS}
          visibleColumns={columnPrefs.visible}
          orderedColumns={columnPrefs.order}
          onColumnToggle={handleColumnToggle}
          onColumnOrderChange={handleColumnOrderChange}
        />
      </Box>
      
      <TableContainer sx={{ 
        maxHeight: 'calc(100vh - 200px)',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: '8px' },
        '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
        '&::-webkit-scrollbar-thumb': { 
          background: '#888',
          borderRadius: '4px',
          '&:hover': { background: '#555' }
        }
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>No data found</Typography>
          </Box>
        ) : (
          <Table stickyHeader aria-label="subscription dashboard table">
            <TableHead>
              <TableRow>
                {orderedVisibleColumns.map(column => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={`${row.subscriptionID}-${row.platformUserID}`}>
                  {orderedVisibleColumns.map(column => {
                    const prop = columnMap[column];
                    const value = row[prop as keyof DashboardRecord];
                    
                    switch (column) {
                      // case 'Subscription ID':
                      case 'User ID':
                        return (
                          <TableCell key={column}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {value ? (
                                <>
                                  <Box
                                    component="button"
                                    onClick={() => handleUserClick(String(value))}
                                    sx={{ 
                                      background: 'none',
                                      border: 'none',
                                      padding: 0,
                                      margin: 0,
                                      textDecoration: 'none',
                                      color: 'primary.main',
                                      cursor: 'pointer',
                                      '&:hover': { textDecoration: 'underline' }
                                    }}
                                  >
                                    {String(value)}
                                  </Box>
                                  <Tooltip title="Copy User ID">
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(String(value))
                                      }}
                                    >
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : 'N/A'}
                            </Box>
                          </TableCell>
                        );
                      case 'Latest Order':
                      case 'Purchase Token':
                        return (
                          <TableCell key={column}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {value ? (
                                <>
                                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {String(value)}
                                  </span>
                                  <Tooltip title={`Copy ${column}`}>
                                    <IconButton size="small" onClick={() => navigator.clipboard.writeText(String(value))}>
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : 'N/A'}
                            </Box>
                          </TableCell>
                        );
                      
                      case 'Platform':
                        return (
                          <TableCell key={column}>
                            <Chip 
                              label={formatText(String(value))} 
                              color={value === 'PLAY_STORE' ? 'primary' : 'secondary'}
                              size="small"
                            />
                          </TableCell>
                        );
                      
                      case 'Status':
                        return (
                          <TableCell key={column}>
                            <Box
                              sx={{
                                color: value === 'ACTIVE' ? 'success.main' : 
                                      value === 'CANCELLED' ? 'error.main' :
                                      value === 'GRACE_PERIOD' ? 'warning.main' : 'text.secondary',
                                fontWeight: 'bold'
                              }}
                            >
                              {formatText(String(value))}
                            </Box>
                          </TableCell>
                        );
                      
                      case 'Plan Type':
                        return (
                          <TableCell key={column}>
                            <Chip 
                              label={formatText(String(value))} 
                              color="info"
                              size="small"
                            />
                          </TableCell>
                        );
                      
                      case 'Amount':
                        return (
                          <TableCell key={column}>
                            {row.totalAmount ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {row.currency} {row.totalAmount.toFixed(2)}
                              </Box>
                            ) : 'N/A'}
                          </TableCell>
                        );
                      
                      case 'Start Time':
                      case 'Renewal Time':
                      case 'Expiration':
                      case 'Last Modified':
                        return (
                          <TableCell key={column}>
                            {value ? formatDate(String(value)) : 'N/A'}
                          </TableCell>
                        );
                      
                      default:
                        return (
                          <TableCell key={column}>
                            {value ? String(value) : 'N/A'}
                          </TableCell>
                        );
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

function formatText(text: string) {
  if (!text) return '';
  return text
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(date: string) {
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleString();
}

export default DashboardTable;