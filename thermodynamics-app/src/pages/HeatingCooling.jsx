import React from 'react';
import { Box, Typography } from '@mui/material';
import HeatingCurveViz from '../visualizations/HeatingCurveViz';

const HeatingCooling = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Heating and Cooling Processes</Typography>
      <HeatingCurveViz />
    </Box>
  );
};

export default HeatingCooling;