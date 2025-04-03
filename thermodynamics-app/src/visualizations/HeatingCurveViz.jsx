import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Tooltip,
  Grid,
  FormControlLabel,
  Switch,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';

// Styled components
const AnimationContainer = styled(Box)(({ theme }) => ({
  height: 150,
  position: 'relative',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
  backgroundColor: '#f1f8fe',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: '1px solid #ddd'
}));

const PhaseLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  background: 'rgba(255, 255, 255, 0.8)',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
  boxShadow: theme.shadows[1],
  zIndex: 10,
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: theme.shadows[2],
  '& .MuiCardContent-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
}));

// Molecule visualization component
const MoleculeAnimation = ({ phase, temperature, isHeating }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Constants for animation
  const particleCount = 50;
  const particleRadius = 5;

  // Initialize visualization
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing SVG
    d3.select(containerRef.current).selectAll('svg').remove();

    // Create new SVG
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    svgRef.current = svg;

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: particleRadius
    }));

    // Draw initial particles
    updateParticles();

    // Start animation
    startAnimation();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Update particles based on phase and temperature
  useEffect(() => {
    if (!svgRef.current) return;

    // Adjust particle behavior based on phase and temperature
    let speed, vibration, color, linkStrength;

    switch (phase) {
      case 'solid':
        speed = 0.1;
        vibration = temperature / 100 * 0.5;
        color = '#3385ff';
        linkStrength = 0.9;
        break;
      case 'solid-liquid':
        speed = 0.3;
        vibration = 0.8;
        color = '#33aaff';
        linkStrength = 0.5;
        break;
      case 'liquid':
        speed = 1.0;
        vibration = 1.0;
        color = '#33ccff';
        linkStrength = 0.2;
        break;
      case 'liquid-gas':
        speed = 1.5;
        vibration = 1.5;
        color = '#33ddff';
        linkStrength = 0.1;
        break;
      case 'gas':
      default:
        speed = 2.0 + (temperature - 100) / 50;
        vibration = 2.0;
        color = '#33eeff';
        linkStrength = 0;
        break;
    }

    // Update particles with new properties
    particlesRef.current.forEach(p => {
      p.speed = speed;
      p.vibration = vibration;
      p.color = color;
      p.linkStrength = linkStrength;
    });

  }, [phase, temperature]);

  const updateParticles = () => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = svgRef.current;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Update particle positions
    particlesRef.current.forEach(p => {
      if (p.speed) {
        // Random movement based on phase
        const noise = (Math.random() - 0.5) * p.vibration;

        if (p.linkStrength < 0.5) {
          // More movement for liquid and gas
          p.x += p.vx * p.speed + noise;
          p.y += p.vy * p.speed + noise;

          // Boundary checking
          if (p.x < p.radius || p.x > width - p.radius) {
            p.vx *= -1;
            p.x = Math.max(p.radius, Math.min(width - p.radius, p.x));
          }
          if (p.y < p.radius || p.y > height - p.radius) {
            p.vy *= -1;
            p.y = Math.max(p.radius, Math.min(height - p.radius, p.y));
          }
        } else {
          // Solid just vibrates in place
          const originalX = p.originalX || p.x;
          const originalY = p.originalY || p.y;

          if (!p.originalX) {
            p.originalX = p.x;
            p.originalY = p.y;
          }

          p.x = originalX + (Math.random() - 0.5) * p.vibration * 5;
          p.y = originalY + (Math.random() - 0.5) * p.vibration * 5;
        }
      }
    });

    // Draw particles
    const circles = svg.selectAll('circle')
      .data(particlesRef.current);

    // Update existing circles
    circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', d => d.color);

    // Add new circles
    circles.enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', d => d.color);

    // Remove old circles
    circles.exit().remove();

    // Draw connections for solids and transition phases
    if (phase === 'solid' || phase === 'solid-liquid') {
      const links = [];

      // Create links between particles that are close
      for (let i = 0; i < particlesRef.current.length; i++) {
        const pi = particlesRef.current[i];

        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const pj = particlesRef.current[j];
          const distance = Math.sqrt((pi.x - pj.x) ** 2 + (pi.y - pj.y) ** 2);

          if (distance < 30) {
            links.push({ source: pi, target: pj, distance });
          }
        }
      }

      // Draw links
      const lines = svg.selectAll('line')
        .data(links);

      // Update existing lines
      lines
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', '#aaddff')
        .attr('stroke-opacity', d => 0.8 - d.distance / 30);

      // Add new lines
      lines.enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', '#aaddff')
        .attr('stroke-opacity', d => 0.8 - d.distance / 30)
        .attr('stroke-width', 1);

      // Remove old lines
      lines.exit().remove();
    } else {
      // Remove all lines for liquid and gas
      svg.selectAll('line').remove();
    }
  };

  const startAnimation = () => {
    const animate = () => {
      updateParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: '100%' }} />
  );
};

// Main component
const HeatingCurveViz = () => {
  const [temperature, setTemperature] = useState(25);
  const [process, setProcess] = useState('heating'); // 'heating' or 'cooling'
  const [systemType, setSystemType] = useState('closed');
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('solid');
  const [showDetails, setShowDetails] = useState(true);

  // Reference temperature points (for water)
  const MELTING_POINT = 0; // °C
  const BOILING_POINT = 100; // °C
  const MIN_TEMP = -50;
  const MAX_TEMP = 150;

  // Animation timer
  useEffect(() => {
    let timer;

    if (autoPlay) {
      timer = setInterval(() => {
        setTemperature(prevTemp => {
          let newTemp;
          if (process === 'heating') {
            newTemp = Math.min(prevTemp + speed, MAX_TEMP);
            if (newTemp >= MAX_TEMP) setAutoPlay(false);
          } else {
            newTemp = Math.max(prevTemp - speed, MIN_TEMP);
            if (newTemp <= MIN_TEMP) setAutoPlay(false);
          }
          return newTemp;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [autoPlay, process, speed]);

  // Determine the current phase based on temperature
  useEffect(() => {
    if (temperature < MELTING_POINT - 5) {
      setCurrentPhase('solid');
    } else if (temperature >= MELTING_POINT - 5 && temperature <= MELTING_POINT + 5) {
      setCurrentPhase('solid-liquid');
    } else if (temperature > MELTING_POINT + 5 && temperature < BOILING_POINT - 5) {
      setCurrentPhase('liquid');
    } else if (temperature >= BOILING_POINT - 5 && temperature <= BOILING_POINT + 5) {
      setCurrentPhase('liquid-gas');
    } else {
      setCurrentPhase('gas');
    }
  }, [temperature]);

  // Get information about the current process
  const getProcessInfo = () => {
    const isEndothermic = process === 'heating';

    let phaseChangeType = '';
    let energyDescription = '';

    if (currentPhase === 'solid-liquid') {
      phaseChangeType = isEndothermic ? 'Melting (fusion)' : 'Freezing';
      energyDescription = isEndothermic
        ? 'Heat energy is being absorbed to break bonds (endothermic)'
        : 'Heat energy is being released as bonds form (exothermic)';
    } else if (currentPhase === 'liquid-gas') {
      phaseChangeType = isEndothermic ? 'Vaporization' : 'Condensation';
      energyDescription = isEndothermic
        ? 'Heat energy is being absorbed to overcome intermolecular forces (endothermic)'
        : 'Heat energy is being released as intermolecular forces reform (exothermic)';
    } else {
      phaseChangeType = `Temperature change in ${currentPhase} phase`;
      energyDescription = isEndothermic
        ? 'Heat energy is increasing molecular kinetic energy (endothermic)'
        : 'Heat energy is decreasing, reducing molecular kinetic energy (exothermic)';
    }

    return {
      phaseChangeType,
      energyDescription,
      systemDescription: getSystemDescription()
    };
  };

  const getSystemDescription = () => {
    switch (systemType) {
      case 'open':
        return 'Open system: Energy and matter can be exchanged with surroundings';
      case 'closed':
        return 'Closed system: Energy can be exchanged, but matter is contained';
      case 'isolated':
        return 'Isolated system: Neither energy nor matter can be exchanged';
      default:
        return '';
    }
  };

  // SVG for heating/cooling curve
  const HeatingCurveSVG = ({ width = 600, height = 300 }) => {
    const svgRef = useRef(null);

    useEffect(() => {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      // Create margins and dimensions
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create main group for chart elements
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create x-axis scale (time/heat added)
      const x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, innerWidth]);

      // Create y-axis scale (temperature)
      const y = d3.scaleLinear()
        .domain([MIN_TEMP, MAX_TEMP])
        .range([innerHeight, 0]);

      // Draw the heating curve
      const heatCurveData = [
        { x: 0, y: MIN_TEMP }, // Starting point
        { x: 15, y: MELTING_POINT - 0.1 }, // Just before melting point
        { x: 30, y: MELTING_POINT }, // During melting (flat)
        { x: 45, y: MELTING_POINT + 0.1 }, // Just after melting
        { x: 70, y: BOILING_POINT - 0.1 }, // Just before boiling point
        { x: 85, y: BOILING_POINT }, // During boiling (flat)
        { x: 100, y: MAX_TEMP } // Final temperature
      ];

      // Create line generator
      const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));

      // Draw line
      g.append('path')
        .datum(heatCurveData)
        .attr('fill', 'none')
        .attr('stroke', process === 'heating' ? '#ff6d00' : '#1e88e5')
        .attr('stroke-width', 3)
        .attr('d', line);

      // Draw axes
      g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x).ticks(5))
        .append('text')
        .attr('fill', '#000')
        .attr('x', innerWidth / 2)
        .attr('y', 35)
        .attr('text-anchor', 'middle')
        .text(process === 'heating' ? 'Heat Added (kJ)' : 'Heat Removed (kJ)');

      g.append('g')
        .call(d3.axisLeft(y).ticks(8))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text('Temperature (°C)');

      // Phase transition labels
      // Melting point
      g.append('text')
        .attr('x', x(30))
        .attr('y', y(MELTING_POINT) - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text('Melting/Freezing');

      // Boiling point
      g.append('text')
        .attr('x', x(85))
        .attr('y', y(BOILING_POINT) - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text('Boiling/Condensation');

      // Phase labels
      g.append('text')
        .attr('x', x(7.5))
        .attr('y', y((MIN_TEMP + MELTING_POINT) / 2))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text('Solid');

      g.append('text')
        .attr('x', x(57.5))
        .attr('y', y((MELTING_POINT + BOILING_POINT) / 2))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text('Liquid');

      g.append('text')
        .attr('x', x(92.5))
        .attr('y', y((BOILING_POINT + MAX_TEMP) / 2))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .text('Gas');

      // Current temperature indicator
      const tempX = process === 'heating'
        ? x(mapTemperatureToX(temperature))
        : x(100 - mapTemperatureToX(temperature));

      g.append('circle')
        .attr('cx', tempX)
        .attr('cy', y(temperature))
        .attr('r', 8)
        .attr('fill', '#e91e63');

      g.append('line')
        .attr('x1', 0)
        .attr('y1', y(temperature))
        .attr('x2', tempX)
        .attr('y2', y(temperature))
        .attr('stroke', '#e91e63')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4');

      g.append('line')
        .attr('x1', tempX)
        .attr('y1', y(temperature))
        .attr('x2', tempX)
        .attr('y2', innerHeight)
        .attr('stroke', '#e91e63')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4');
    }, [width, height, temperature, process]);

    // Helper function to map temperature to x position on the curve
    const mapTemperatureToX = (temp) => {
      if (temp <= MIN_TEMP) return 0;
      if (temp >= MAX_TEMP) return 100;

      if (temp < MELTING_POINT) {
        // Solid region
        return 15 * (temp - MIN_TEMP) / (MELTING_POINT - MIN_TEMP);
      } else if (temp === MELTING_POINT) {
        // Melting point (flat region)
        return 30;
      } else if (temp < BOILING_POINT) {
        // Liquid region
        return 45 + 25 * (temp - (MELTING_POINT + 0.1)) / (BOILING_POINT - (MELTING_POINT + 0.1));
      } else if (temp === BOILING_POINT) {
        // Boiling point (flat region)
        return 85;
      } else {
        // Gas region
        return 85 + 15 * (temp - BOILING_POINT) / (MAX_TEMP - BOILING_POINT);
      }
    };

    return (
      <svg ref={svgRef} width={width} height={height} />
    );
  };

  // Get information for the current state
  const info = getProcessInfo();

  // Render the component
  return (
    <Box className="viz-container" sx={{ p: 3 }}>
      <Typography variant="h5" className="viz-container__title" gutterBottom>
        Interactive {process === 'heating' ? 'Heating' : 'Cooling'} Curve
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <HeatingCurveSVG width={600} height={350} />
          </Paper>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography id="temperature-slider" gutterBottom>
              Temperature: {temperature}°C
            </Typography>
            <Slider
              value={temperature}
              onChange={(e, newValue) => setTemperature(newValue)}
              min={MIN_TEMP}
              max={MAX_TEMP}
              step={1}
              aria-labelledby="temperature-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}°C`}
              marks={[
                { value: MIN_TEMP, label: `${MIN_TEMP}°C` },
                { value: MELTING_POINT, label: `${MELTING_POINT}°C` },
                { value: BOILING_POINT, label: `${BOILING_POINT}°C` },
                { value: MAX_TEMP, label: `${MAX_TEMP}°C` }
              ]}
            />
          </Box>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Molecular Behavior
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Current phase: <strong>{currentPhase.replace('-', ' to ')}</strong>
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={showDetails}
                    onChange={(e) => setShowDetails(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show details"
              />
            </Box>

            <AnimationContainer>
              <MoleculeAnimation
                phase={currentPhase}
                temperature={temperature}
                isHeating={process === 'heating'}
              />
              <PhaseLabel sx={{ top: 10, left: 10 }}>
                {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1).replace('-', ' → ')}
              </PhaseLabel>
            </AnimationContainer>
          </Paper>

          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <ToggleButtonGroup
              value={process}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) setProcess(newValue);
              }}
              color="primary"
              aria-label="heating or cooling"
            >
              <ToggleButton value="heating">Heating (Endothermic)</ToggleButton>
              <ToggleButton value="cooling">Cooling (Exothermic)</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={systemType}
              exclusive
              onChange={(e, newValue) => {
                if (newValue) setSystemType(newValue);
              }}
              color="primary"
              aria-label="system type"
            >
              <ToggleButton value="open">Open</ToggleButton>
              <ToggleButton value="closed">Closed</ToggleButton>
              <ToggleButton value="isolated">Isolated</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <Button
                variant={autoPlay ? "contained" : "outlined"}
                color={autoPlay ? "secondary" : "primary"}
                onClick={() => setAutoPlay(!autoPlay)}
                sx={{ mr: 1 }}
              >
                {autoPlay ? "Pause" : "Play"}
              </Button>

              {autoPlay && (
                <Slider
                  value={speed}
                  onChange={(e, newValue) => setSpeed(newValue)}
                  min={0.5}
                  max={5}
                  step={0.5}
                  valueLabelDisplay="auto"
                  valueLabelFormat={value => `${value}x`}
                  aria-labelledby="speed-slider"
                  sx={{ width: 100, ml: 1 }}
                />
              )}
            </Box>
          </Box>
        </Grid>

        {showDetails && (
          <Grid item xs={12} md={4}>
            <InfoCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Process Information
                </Typography>

                <Typography variant="subtitle1" gutterBottom color="secondary">
                  {info.phaseChangeType}
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>Current Temperature:</strong> {temperature}°C
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>Phase:</strong> {currentPhase.replace('-', ' → ')}
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>Energy Transfer:</strong> {info.energyDescription}
                </Typography>

                <Typography variant="body2" paragraph>
                  <strong>System:</strong> {info.systemDescription}
                </Typography>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Concepts
                  </Typography>

                  <Typography variant="body2" paragraph>
                    <strong>Specific Heat Capacity:</strong> The amount of heat needed to raise 1g of a substance by 1°C.
                  </Typography>

                  <Typography variant="body2" paragraph>
                    <strong>Thermal Equilibrium:</strong> When two systems reach the same temperature with no net heat transfer.
                  </Typography>

                  <Typography variant="body2" paragraph>
                    <strong>Enthalpy Change:</strong> {process === 'heating' ? 'Positive (ΔH > 0) for endothermic processes' : 'Negative (ΔH < 0) for exothermic processes'}.
                  </Typography>
                </Box>
              </CardContent>
            </InfoCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default HeatingCurveViz;