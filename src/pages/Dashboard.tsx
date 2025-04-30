// pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import DashboardTable from '../components/DashboardTable';
import DashboardFilters from '../components/DashboardFilters';
import { fetchDashboardData } from '../services/dashboardApi';
import { DashboardRecord } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const result = await fetchDashboardData({
        ...filters,
        page,
        pageSize
      });
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Auto-refresh setup
  useEffect(() => {
    // Initial load
    loadData();

    // Set up auto-refresh
    const interval = setInterval(() => {
      loadData();
    }, 300000); // 5 minutes

    setRefreshInterval(interval);

    // Clean up interval on unmount
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [loadData]);

  const handleFilter = (filters: any) => {
    // Reset to first page when filters change
    setPage(1);
    loadData(filters);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  };

  return (
    <Box sx={{ 
      p: 3,
      width: '100vw',
      overflowX: 'hidden',
      maxWidth: '100%'
    }}>
      <DashboardFilters onFilter={handleFilter} loading={loading} />
      <Box sx={{ 
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: '4px',
        }
      }}>
        <DashboardTable
          data={data}
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;