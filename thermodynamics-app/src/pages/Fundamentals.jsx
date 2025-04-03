import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';

const Fundamentals = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Thermodynamics Fundamentals
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          Thermodynamics is the branch of physics that deals with the relationships between heat and other forms of energy.
          Understanding these fundamental concepts is essential for exploring more complex thermodynamic processes.
        </Typography>
      </Paper>

      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 4,
            bgcolor: 'primary.main',
            borderRadius: 2
          }
        }}
      >
        Key Thermodynamics Concepts
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Thermodynamic Systems &amp; Surroundings
            </Typography>
            <Typography variant="body2" paragraph>
              A <strong>system</strong> is the specific part of the universe that is being studied, while the <strong>surroundings</strong> are everything else in the universe outside the system.
            </Typography>
            <Typography variant="body2" paragraph>
              Systems can be classified as:
            </Typography>
            <ul>
              <Typography component="li" variant="body2"><strong>Open systems</strong>: Allow the transfer of both energy and matter</Typography>
              <Typography component="li" variant="body2"><strong>Closed systems</strong>: Allow energy transfer but not matter</Typography>
              <Typography component="li" variant="body2"><strong>Isolated systems</strong>: Allow neither energy nor matter transfer</Typography>
            </ul>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="secondary">
              Energy Types &amp; Transfers
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Thermal energy</strong> is the energy associated with the random motion of atoms and molecules.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Kinetic energy</strong> is the energy of motion, while <strong>potential energy</strong> is stored energy due to position or chemical bonds.
            </Typography>
            <Typography variant="body2">
              <strong>Heat</strong> is thermal energy that flows from a higher temperature to a lower temperature, measured in joules (J) or calories (cal).
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="error">
              Endothermic vs. Exothermic Processes
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Endothermic processes</strong> absorb heat energy from the surroundings, resulting in a positive enthalpy change (ΔH &gt; 0). Examples include melting ice or photosynthesis.
            </Typography>
            <Typography variant="body2">
              <strong>Exothermic processes</strong> release heat energy to the surroundings, resulting in a negative enthalpy change (ΔH &lt; 0). Examples include combustion or freezing water.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="success">
              Enthalpy &amp; Bond Energies
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Enthalpy (H)</strong> is a measure of the total heat content of a system, and <strong>enthalpy change (ΔH)</strong> represents the heat absorbed or released during a process at constant pressure.
            </Typography>
            <Typography variant="body2">
              <strong>Bond energy</strong> is the energy required to break a chemical bond. Strong bonds have high bond energies. In chemical reactions, energy is released when new bonds form and energy is absorbed when bonds break.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Thermal Equilibrium &amp; Temperature
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Thermal Equilibrium
                </Typography>
                <Typography variant="body2" paragraph>
                  Thermal equilibrium is the state in which two objects in physical contact with each other exchange no net thermal energy. At thermal equilibrium, the objects have the same temperature.
                </Typography>
                <Typography variant="body2">
                  The Zeroth Law of Thermodynamics states that if two systems are each in thermal equilibrium with a third system, then they are in thermal equilibrium with each other.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Temperature &amp; Heat
                </Typography>
                <Typography variant="body2" paragraph>
                  Temperature is a measure of the average kinetic energy of particles in a substance, not the total thermal energy. It determines the direction of heat flow.
                </Typography>
                <Typography variant="body2" paragraph>
                  Heat always flows spontaneously from higher temperature objects to lower temperature objects, never the reverse.
                </Typography>
                <Typography variant="body2">
                  Common temperature scales include Celsius (°C), Fahrenheit (°F), and Kelvin (K). The Kelvin scale is the SI unit and starts at absolute zero (0 K = -273.15°C).
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Specific Heat Capacity
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" paragraph>
            <strong>Specific heat capacity</strong> is the amount of heat energy required to raise the temperature of 1 gram of a substance by 1 degree Celsius.
          </Typography>

          <Box sx={{
            bgcolor: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            my: 2,
            fontFamily: 'monospace',
            textAlign: 'center'
          }}>
            <Typography variant="h6">
              Q = m × c × ΔT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              where Q = heat energy (J), m = mass (g), c = specific heat capacity (J/g·°C), ΔT = temperature change (°C)
            </Typography>
          </Box>

          <Typography variant="body2" paragraph>
            Different substances have different specific heat capacities. Water has a remarkably high specific heat capacity (4.18 J/g·°C), which means it can absorb or release large amounts of heat with relatively small temperature changes.
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Common Specific Heat Capacities:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Water</Typography>
                  <Typography variant="h6">4.18 J/g·°C</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Aluminum</Typography>
                  <Typography variant="h6">0.90 J/g·°C</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Iron</Typography>
                  <Typography variant="h6">0.45 J/g·°C</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>Gold</Typography>
                  <Typography variant="h6">0.13 J/g·°C</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Fundamentals;