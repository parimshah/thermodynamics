import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  RefreshRounded as RefreshIcon,
  LightbulbOutlined as LightbulbIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';

// Styled components
const ReactionsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  position: 'relative',
  borderLeft: `4px solid ${theme.palette.primary.main}`
}));

const EnthalpyPath = styled(Box)(({ theme, active }) => ({
  width: '100%',
  height: 350,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  opacity: active ? 1 : 0.7,
  transition: 'opacity 0.3s, transform 0.3s',
  transform: active ? 'scale(1)' : 'scale(0.98)'
}));

const EquationPaper = styled(Paper)(({ theme, reversed, combined }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: combined
    ? theme.palette.secondary.light
    : (reversed ? '#fff3e0' : '#e3f2fd'),
  border: `1px solid ${combined
    ? theme.palette.secondary.main
    : (reversed ? '#ffe0b2' : '#bbdefb')}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  position: 'relative',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2]
  }
}));

const HintBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: '#fff8e1',
  border: '1px solid #ffe082',
  borderRadius: theme.shape.borderRadius
}));

// Main component
const HessLawViz = () => {
  const [activeExample, setActiveExample] = useState('example1');
  const [showSteps, setShowSteps] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [reversedReactions, setReversedReactions] = useState([false, false, false]);
  const [showHints, setShowHints] = useState(false);

  const pathRef1 = useRef(null);
  const pathRef2 = useRef(null);
  const pathRef3 = useRef(null);

  // Examples of reactions for Hess's Law
  const examples = {
    example1: {
      title: "Formation of CO₂ from C and O₂",
      targetReaction: "C(s) + O₂(g) → CO₂(g)",
      targetDeltaH: -393.5,
      steps: [
        {
          reaction: "2C(s) + O₂(g) → 2CO(g)",
          deltaH: -221.0,
          description: "First, we have a reaction that produces carbon monoxide."
        },
        {
          reaction: "2CO(g) + O₂(g) → 2CO₂(g)",
          deltaH: -566.0,
          description: "Then, we have a reaction that converts carbon monoxide to carbon dioxide."
        }
      ],
      solution: {
        steps: [
          "Step 1: C(s) + ½O₂(g) → CO(g), ΔH = -110.5 kJ/mol (divided by 2)",
          "Step 2: CO(g) + ½O₂(g) → CO₂(g), ΔH = -283.0 kJ/mol (divided by 2)",
          "Add steps: C(s) + ½O₂(g) + ½O₂(g) → CO(g) + CO₂(g)"
        ],
        finalEquation: "C(s) + O₂(g) → CO₂(g)",
        finalDeltaH: "-110.5 + (-283.0) = -393.5 kJ/mol"
      }
    },
    example2: {
      title: "Formation of CH₄ from C and H₂",
      targetReaction: "C(s) + 2H₂(g) → CH₄(g)",
      targetDeltaH: -74.8,
      steps: [
        {
          reaction: "C(s) + O₂(g) → CO₂(g)",
          deltaH: -393.5,
          description: "First, we have the combustion of carbon."
        },
        {
          reaction: "2H₂(g) + O₂(g) → 2H₂O(g)",
          deltaH: -483.6,
          description: "Then, we have the formation of water from hydrogen and oxygen."
        },
        {
          reaction: "CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)",
          deltaH: -802.3,
          description: "Finally, we have the combustion of methane."
        }
      ],
      solution: {
        steps: [
          "Step 1: Keep first reaction as is: C(s) + O₂(g) → CO₂(g), ΔH = -393.5 kJ/mol",
          "Step 2: Keep second reaction as is: 2H₂(g) + O₂(g) → 2H₂O(g), ΔH = -483.6 kJ/mol",
          "Step 3: Reverse third reaction: CO₂(g) + 2H₂O(g) → CH₄(g) + 2O₂(g), ΔH = +802.3 kJ/mol",
          "Add steps: C(s) + O₂(g) + 2H₂(g) + O₂(g) + CO₂(g) + 2H₂O(g) → CO₂(g) + 2H₂O(g) + CH₄(g) + 2O₂(g)"
        ],
        finalEquation: "C(s) + 2H₂(g) → CH₄(g)",
        finalDeltaH: "-393.5 + (-483.6) + (+802.3) = -74.8 kJ/mol"
      }
    },
    example3: {
      title: "Formation of N₂O₄ from NO₂",
      targetReaction: "2NO₂(g) → N₂O₄(g)",
      targetDeltaH: -57.2,
      steps: [
        {
          reaction: "½N₂(g) + O₂(g) → NO₂(g)",
          deltaH: 33.2,
          description: "First, we have the formation of nitrogen dioxide from nitrogen and oxygen."
        },
        {
          reaction: "N₂(g) + 2O₂(g) → N₂O₄(g)",
          deltaH: 9.2,
          description: "Then, we have the direct formation of dinitrogen tetroxide."
        }
      ],
      solution: {
        steps: [
          "Step 1: Multiply the first reaction by 2: N₂(g) + 2O₂(g) → 2NO₂(g), ΔH = 66.4 kJ/mol",
          "Step 2: Reverse the second reaction: N₂O₄(g) → N₂(g) + 2O₂(g), ΔH = -9.2 kJ/mol",
          "Add steps: N₂(g) + 2O₂(g) + N₂O₄(g) → 2NO₂(g) + N₂(g) + 2O₂(g)"
        ],
        finalEquation: "N₂O₄(g) → 2NO₂(g)",
        finalDeltaH: "66.4 + (-9.2) = 57.2 kJ/mol"
      }
    }
  };

  // Handle example change
  const handleExampleChange = (event) => {
    setActiveExample(event.target.value);
    setActiveStep(0);
    setReversedReactions([false, false, false]);
    setShowHints(false);
  };

  // Handle next step
  const handleNext = () => {
    const example = examples[activeExample];
    if (activeStep < example.steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(activeStep > 0 ? activeStep - 1 : 0);
  };

  // Handle reaction reversal
  const handleReverseReaction = (index) => {
    const newReversed = [...reversedReactions];
    newReversed[index] = !newReversed[index];
    setReversedReactions(newReversed);
  };

  // Reset the current example
  const handleReset = () => {
    setActiveStep(0);
    setReversedReactions([false, false, false]);
    setShowHints(false);
  };

  // Calculate the combined enthalpy based on reversed reactions
  const calculateCombinedEnthalpy = () => {
    const example = examples[activeExample];
    let total = 0;

    for (let i = 0; i < example.steps.length; i++) {
      const deltaH = example.steps[i].deltaH;
      total += reversedReactions[i] ? -deltaH : deltaH;
    }

    return total.toFixed(1);
  };

  // Check if the calculated result matches the target
  const isResultCorrect = () => {
    const example = examples[activeExample];
    return Math.abs(parseFloat(calculateCombinedEnthalpy()) - example.targetDeltaH) < 0.1;
  };

  // Render energy diagram for Hess's Law
  const renderEnergyDiagram = (containerId, reactions, reversed, isActive) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous SVG
    d3.select(container).selectAll('*').remove();

    // Get container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up margins
    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group for chart elements
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for the energy diagram
    let pathData = [];
    let minEnergy = 0;
    let maxEnergy = 0;
    let currentEnergy = 0;

    // Starting point
    pathData.push({ x: 0, y: currentEnergy, label: 'Initial' });

    // Process each reaction step
    for (let i = 0; i < reactions.length; i++) {
      const isReversed = Array.isArray(reversed) ? reversed[i] : false;
      const deltaH = isReversed ? -reactions[i].deltaH : reactions[i].deltaH;

      // Calculate new energy level
      currentEnergy += deltaH;

      // Add to path
      pathData.push({
        x: (i + 1) * (innerWidth / (reactions.length)),
        y: currentEnergy,
        label: `Step ${i + 1}`,
        deltaH: deltaH
      });

      // Track min/max for y-axis scaling
      minEnergy = Math.min(minEnergy, currentEnergy);
      maxEnergy = Math.max(maxEnergy, currentEnergy);
    }

    // Add some padding to the y-axis
    minEnergy -= 50;
    maxEnergy += 50;

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, innerWidth])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([minEnergy, maxEnergy])
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveStepAfter);

    // Draw reaction path
    g.append('path')
      .datum(pathData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Draw points at each energy level
    pathData.forEach((d, i) => {
      g.append('circle')
        .attr('cx', x(d.x))
        .attr('cy', y(d.y))
        .attr('r', 6)
        .attr('fill', i === 0 ? '#4caf50' : (i === pathData.length - 1 ? '#f44336' : '#2196f3'));

      // Add energy level labels
      g.append('text')
        .attr('x', x(d.x))
        .attr('y', y(d.y) - 15)
        .attr('text-anchor', 'middle')
        .text(`${d.y.toFixed(1)} kJ`);

      // Add step labels
      g.append('text')
        .attr('x', x(d.x))
        .attr('y', innerHeight + 20)
        .attr('text-anchor', 'middle')
        .text(d.label);

      // Add delta H arrows for transitions (except for the first point)
      if (i > 0) {
        const prevD = pathData[i - 1];
        const arrowX = (x(prevD.x) + x(d.x)) / 2;
        const arrowStartY = y(Math.min(prevD.y, d.y));
        const arrowEndY = y(Math.max(prevD.y, d.y));
        const arrowDir = d.y > prevD.y ? 1 : -1; // 1 for endothermic, -1 for exothermic

        if (prevD.y !== d.y) {
          // Draw arrow
          g.append('line')
            .attr('x1', arrowX)
            .attr('y1', arrowStartY)
            .attr('x2', arrowX)
            .attr('y2', arrowEndY)
            .attr('stroke', arrowDir > 0 ? '#f44336' : '#4caf50')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');

          // Add delta H label
          g.append('text')
            .attr('x', arrowX + 15)
            .attr('y', (arrowStartY + arrowEndY) / 2)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('fill', arrowDir > 0 ? '#f44336' : '#4caf50')
            .text(`ΔH = ${d.deltaH > 0 ? '+' : ''}${d.deltaH.toFixed(1)} kJ`);
        }
      }
    });

    // Draw axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(0));

    g.append('g')
      .call(d3.axisLeft(y));

    // Add y-axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text('Enthalpy (kJ)');

    // Add arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#333');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
      .text('Hess\'s Law Energy Diagram');
  };

  // Render diagrams when component mounts or updates
  useEffect(() => {
    const example = examples[activeExample];

    if (pathRef1.current) {
      renderEnergyDiagram('path1', example.steps.slice(0, 1), [reversedReactions[0]], activeStep >= 1);
    }

    if (pathRef2.current && example.steps.length >= 2) {
      renderEnergyDiagram('path2', example.steps.slice(0, 2), [reversedReactions[0], reversedReactions[1]], activeStep >= 2);
    }

    if (pathRef3.current && example.steps.length >= 3) {
      renderEnergyDiagram('path3', example.steps, reversedReactions, activeStep >= 3);
    }
  }, [activeExample, activeStep, reversedReactions]);

  // Get current example data
  const currentExample = examples[activeExample];

  return (
    <Box className="viz-container">
      <Typography variant="h5" className="viz-container__title" gutterBottom>
        Hess's Law Pathways and Calculations
      </Typography>

      <Paper sx={{ p: 2, mb: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Hess's Law States:
        </Typography>
        <Typography variant="body1" paragraph>
          The enthalpy change of a reaction is the same whether it occurs in one step or in multiple steps.
          This means that if a reaction can be expressed as the sum of several steps, the enthalpy change of the
          reaction will equal the sum of the enthalpy changes of the individual steps.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="example-select-label">Select Example</InputLabel>
            <Select
              labelId="example-select-label"
              value={activeExample}
              label="Select Example"
              onChange={handleExampleChange}
            >
              <MenuItem value="example1">Formation of CO₂</MenuItem>
              <MenuItem value="example2">Formation of CH₄</MenuItem>
              <MenuItem value="example3">Formation of N₂O₄</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RefreshIcon />}
          >
            Reset Example
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={showSteps}
                onChange={(e) => setShowSteps(e.target.checked)}
              />
            }
            label="Show step-by-step guide"
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Goal: {currentExample.title}
          </Typography>

          <Paper sx={{ p: 2, mb: 3, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9' }}>
            <Typography variant="subtitle1" gutterBottom>
              Target Reaction:
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
              {currentExample.targetReaction}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              ΔH = {currentExample.targetDeltaH} kJ/mol
            </Typography>
          </Paper>

          {showSteps && (
            <Stepper activeStep={activeStep} orientation="vertical">
              {currentExample.steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{`Step ${index + 1}: ${step.reaction.substring(0, 30)}${step.reaction.length > 30 ? '...' : ''}`}</StepLabel>
                  <StepContent>
                    <ReactionsContainer>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {step.description}
                      </Typography>

                      <EquationPaper reversed={reversedReactions[index]}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                            {reversedReactions[index] ? reverseReaction(step.reaction) : step.reaction}
                          </Typography>

                          <Box>
                            <Typography variant="body2" color={reversedReactions[index] ? "error.main" : "primary.main"}>
                              ΔH = {reversedReactions[index] ? -step.deltaH : step.deltaH} kJ/mol
                            </Typography>

                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleReverseReaction(index)}
                              startIcon={reversedReactions[index] ? <RefreshIcon /> : <RefreshIcon />}
                            >
                              {reversedReactions[index] ? "Revert" : "Reverse"}
                            </Button>
                          </Box>
                        </Box>
                      </EquationPaper>

                      {index < currentExample.steps.length - 1 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                          >
                            Continue
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Now we can combine the reactions to find the target reaction!
                          </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                          >
                            Combine Reactions
                          </Button>
                        </Box>
                      )}
                    </ReactionsContainer>
                  </StepContent>
                </Step>
              ))}

              <Step>
                <StepLabel>Final Result</StepLabel>
                <StepContent>
                  <EquationPaper combined>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                        {currentExample.targetReaction}
                      </Typography>

                      <Typography variant="body1" fontWeight="bold" color={isResultCorrect() ? "success.main" : "error.main"}>
                        ΔH = {calculateCombinedEnthalpy()} kJ/mol
                        {isResultCorrect() ? " ✓" : " ✗"}
                      </Typography>
                    </Box>
                  </EquationPaper>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Checking the Result:</Typography>
                    <Typography variant="body2" paragraph>
                      Target value: {currentExample.targetDeltaH} kJ/mol
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Our calculation: {calculateCombinedEnthalpy()} kJ/mol
                    </Typography>

                    {!isResultCorrect() && (
                      <HintBox>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LightbulbIcon color="warning" sx={{ mr: 1 }} />
                          <Typography variant="subtitle2">
                            Hint: Try reversing different reactions or adjusting the combinations to match the target.
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => setShowHints(!showHints)}
                        >
                          {showHints ? "Hide Solution" : "Show Solution"}
                        </Button>

                        {showHints && (
                          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid #ffe082' }}>
                            {currentExample.solution.steps.map((step, i) => (
                              <Typography key={i} variant="body2" paragraph>
                                {step}
                              </Typography>
                            ))}
                            <Typography variant="body2" paragraph>
                              <strong>Final equation:</strong> {currentExample.solution.finalEquation}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Final ΔH:</strong> {currentExample.solution.finalDeltaH}
                            </Typography>
                          </Box>
                        )}
                      </HintBox>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleReset}
                        startIcon={<RefreshIcon />}
                      >
                        Try Again
                      </Button>
                    </Box>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          )}

          {/* Energy diagrams */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Energy Diagrams
            </Typography>

            <Grid container spacing={2}>
              {activeStep >= 1 && (
                <Grid item xs={12}>
                  <EnthalpyPath id="path1" ref={pathRef1} active={activeStep === 1} />
                </Grid>
              )}

              {activeStep >= 2 && currentExample.steps.length >= 2 && (
                <Grid item xs={12}>
                  <EnthalpyPath id="path2" ref={pathRef2} active={activeStep === 2} />
                </Grid>
              )}

              {activeStep >= 3 && (
                <Grid item xs={12}>
                  <EnthalpyPath id="path3" ref={pathRef3} active={activeStep >= 3} />
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Using Hess's Law to Calculate Enthalpy Changes
              </Typography>

              <Typography variant="body1" paragraph>
                Hess's Law allows us to calculate enthalpy changes for reactions that are difficult to measure directly
                by breaking them down into simpler steps with known enthalpy values.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Key Rules to Remember:
              </Typography>

              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" paragraph>
                  If a reaction is reversed, the sign of ΔH is also reversed
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  If a reaction is multiplied by a factor, ΔH is also multiplied by that factor
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  If reactions are added together, their ΔH values are also added
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Strategy for Solving Problems:
              </Typography>

              <Box component="ol" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" paragraph>
                  Identify the target reaction and its unknown ΔH
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Find reactions with known ΔH values that contain the same compounds
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Manipulate these reactions (reverse, multiply, combine) to obtain the target reaction
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Apply the same operations to the ΔH values and calculate the final enthalpy change
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Practice Problem:
              </Typography>

              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" paragraph>
                  Calculate the enthalpy change for the reaction:
                </Typography>

                <Typography variant="body1" sx={{ fontFamily: 'monospace', my: 1 }}>
                  2NO(g) + O₂(g) → 2NO₂(g)
                </Typography>

                <Typography variant="body2" paragraph>
                  Given the following reactions and their enthalpy changes:
                </Typography>

                <Box component="ol" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2">
                    N₂(g) + O₂(g) → 2NO(g)         ΔH = +180.6 kJ
                  </Typography>
                  <Typography component="li" variant="body2">
                    N₂(g) + 2O₂(g) → 2NO₂(g)       ΔH = +66.4 kJ
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, p: 1, border: '1px dashed #aaa', borderRadius: 1 }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">Show Solution</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        Step 1: We want to calculate ΔH for the reaction 2NO(g) + O₂(g) → 2NO₂(g)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Step 2: Looking at the given reactions, we can see that:
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" paragraph>
                          - Reaction 1 contains NO as a product, but we need it as a reactant
                        </Typography>
                        <Typography variant="body2" paragraph>
                          - Reaction 2 contains NO₂ as a product, which matches our target
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Step 3: We can reverse reaction 1: 2NO(g) → N₂(g) + O₂(g)   ΔH = -180.6 kJ
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Step 4: Now we add this to reaction 2:
                      </Typography>
                      <Box sx={{ pl: 2, fontFamily: 'monospace' }}>
                        <Typography variant="body2">
                          2NO(g) → N₂(g) + O₂(g)         ΔH = -180.6 kJ
                        </Typography>
                        <Typography variant="body2">
                          N₂(g) + 2O₂(g) → 2NO₂(g)       ΔH = +66.4 kJ
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, borderTop: '1px solid #ddd', pt: 1 }}>
                          2NO(g) + O₂(g) → 2NO₂(g)       ΔH = -114.2 kJ
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                        Therefore, ΔH = -114.2 kJ for the reaction.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper function to reverse a chemical reaction string
const reverseReaction = (reaction) => {
  // Split the reaction by the arrow
  const parts = reaction.split('→');
  if (parts.length !== 2) return reaction;

  // Swap reactants and products
  const reactants = parts[0].trim();
  const products = parts[1].trim();

  // Return the reversed reaction
  return `${products} → ${reactants}`;
};

export default HessLawViz;