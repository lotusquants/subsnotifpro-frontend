import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import AppBar from './AppBar';
import Drawer from './Drawer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      width: '100vw',
      overflowX: 'hidden' // Prevent horizontal scrolling
    }}>
      <CssBaseline />
      <AppBar />
      <Box sx={{ 
        display: 'flex',
        width: '100%',
        overflow: 'hidden' // Contain children
      }}>
        <Drawer />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            p: 3,
            width: 'calc(100vw - 240px)', // Adjust based on drawer width
            overflowX: 'auto' // Allow scrolling just for main content
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;