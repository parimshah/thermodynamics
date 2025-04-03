import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Paper,
  Divider,
  useTheme
} from '@mui/material';
import {
  Whatshot as HeatingIcon,
  Science as EnthalpyIcon,
  Calculate as HessLawIcon,
  School as FundamentalsIcon,
  Quiz as PracticeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animated components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const HomePage = () => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Content for topic cards
  const topics = [
    {
      title: 'Thermodynamics Fundamentals',
      description: 'Learn about thermodynamics, thermal equilibrium, and energy transfer between systems.',
      icon: <FundamentalsIcon fontSize="large" color="primary" />,
      path: '/fundamentals',
      color: theme.palette.primary.light
    },
    {
      title: 'Heating & Cooling Curves',
      description: 'Explore how substances change phase and temperature through interactive visualizations.',
      icon: <HeatingIcon fontSize="large" color="secondary" />,
      path: '/heating-cooling',
      color: theme.palette.secondary.light
    },
    {
      title: 'Enthalpy & Energy Changes',
      description: 'Understand enthalpy of reaction, formation, and how energy changes during chemical processes.',
      icon: <EnthalpyIcon fontSize="large" color="info" />,
      path: '/enthalpy',
      color: theme.palette.info.light
    },
    {
      title: 'Hess\'s Law',
      description: 'Calculate enthalpy changes using Hess\'s Law and visualize multi-step reaction pathways.',
      icon: <HessLawIcon fontSize="large" color="success" />,
      path: '/hess-law',
      color: theme.palette.success.light
    },
    {
      title: 'Practice Problems',
      description: 'Test your understanding with interactive problems and get feedback on your solutions.',
      icon: <PracticeIcon fontSize="large" color="error" />,
      path: '/practice',
      color: theme.palette.error.light
    }
  ];

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <MotionBox
        sx={{
          textAlign: 'center',
          py: { xs: 4, md: 8 },
          mb: 6
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <MotionTypography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(45deg, #1e88e5 30%, #ff6d00 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Thermodynamics Journey
        </MotionTypography>

        <MotionTypography
          variant="h5"
          color="textSecondary"
          sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Interactive webapp for thermal energy, enthalpy, and energy transfer
        </MotionTypography>

      </MotionBox>

      {/* Topic Cards Grid */}
      <MotionBox
        component="section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ mb: 8 }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: 0,
              width: 60,
              height: 4,
              bgcolor: 'secondary.main',
              borderRadius: 2
            }
          }}
        >
          Explore Topics
        </Typography>

        <Grid container spacing={3}>
          {topics.map((topic, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MotionCard
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  y: -5
                }}
                sx={{
                  height: '100%',
                  borderTop: `4px solid ${topic.color}`,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {topic.icon}
                    <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                      {topic.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                    {topic.description}
                  </Typography>

                  <CardActions sx={{ pt: 2, px: 0 }}>
                    <Button
                      component={Link}
                      to={topic.path}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        borderRadius: '20px',
                        px: 2
                      }}
                    >
                      Explore
                    </Button>
                  </CardActions>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Learning Path Section */}
      <MotionBox
        sx={{ mb: 8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Suggested Learning Path
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '15px',
              width: '4px',
              bgcolor: 'primary.light',
              borderRadius: 4
            }
          }}>
            {topics.map((topic, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  mb: 3,
                  position: 'relative',
                  py: 1
                }}
              >
                <Box sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  border: `3px solid ${topic.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3,
                  zIndex: 1,
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </Box>

                <Box>
                  <Typography variant="h6" component="h3">
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topic.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={topic.path}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Start learning
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </MotionBox>
    </Container>
  );
};

export default HomePage;