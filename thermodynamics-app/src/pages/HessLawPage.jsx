import React from 'react';
import { Box, Typography } from '@mui/material';
import HessLawViz from '../visualizations/HessLawViz';

const HessLawPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Hess's Law Applications</Typography>
      <HessLawViz />
    </Box>
  );
};

export default HessLawPage;