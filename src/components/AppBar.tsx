import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';

const AppBar: React.FC = () => {
  return (
    <MuiAppBar position="static" elevation={0} > {/* Changed from fixed to static */} 
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
          Subsnotifpro Console
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;