import React from 'react';
import { Box, Typography } from '@mui/material';
import EnthalpyViz from '../visualizations/EnthalpyViz';

const EnthalpyPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Enthalpy and Energy Changes</Typography>
      <EnthalpyViz />
    </Box>
  );
};

export default EnthalpyPage;