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
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';

// Styled components
const ReactionCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const EnthalpyDiagram = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 400,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

const FormulaPaper = styled(Paper)(({ theme, isProduct }) => ({
  padding: theme.spacing(2),
  backgroundColor: isProduct ? '#e3f2fd' : '#fff3e0',
  border: `1px solid ${isProduct ? '#bbdefb' : '#ffe0b2'}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative'
}));

// Main component
const EnthalpyViz = () => {
  const [reactionType, setReactionType] = useState('exothermic');
  const [viewType, setViewType] = useState('energy');
  const [customValues, setCustomValues] = useState({
    reactantEnergy: 0,
    productEnergy: reactionType === 'exothermic' ? -100 : 100,
    activationEnergy: 50
  });
  const [showActivation, setShowActivation] = useState(true);
  const [reaction, setReaction] = useState('combustion');

  const diagramRef = useRef(null);

  // Update product energy when reaction type changes
  useEffect(() => {
    setCustomValues(prev => ({
      ...prev,
      productEnergy: reactionType === 'exothermic' ? -100 : 100
    }));
  }, [reactionType]);

  // Update diagram when values change
  useEffect(() => {
    renderEnthalpyDiagram();
  }, [customValues, reactionType, viewType, showActivation, reaction]);

  const handleValueChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setCustomValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const toggleReactionType = () => {
    const newType = reactionType === 'exothermic' ? 'endothermic' : 'exothermic';
    setReactionType(newType);
  };

  // Render the enthalpy diagram
  const renderEnthalpyDiagram = () => {
    if (!diagramRef.current) return;

    // Clear previous SVG
    d3.select(diagramRef.current).selectAll('*').remove();

    // Get container dimensions
    const container = diagramRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up margins
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create main group for chart elements
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate energy values based on reaction type and custom values
    const reactantEnergy = customValues.reactantEnergy;
    const productEnergy = customValues.productEnergy;
    const activationEnergy = reactantEnergy + Math.abs(customValues.activationEnergy);

    // Determine if it's exothermic or endothermic
    const isExothermic = productEnergy < reactantEnergy;

    // Calculate min and max values for y scale
    const minEnergy = Math.min(reactantEnergy, productEnergy) - 20;
    const maxEnergy = Math.max(
      reactantEnergy,
      productEnergy,
      showActivation ? activationEnergy : 0
    ) + 20;

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([minEnergy, maxEnergy])
      .range([innerHeight, 0]);

    // Create reaction path data
    let pathData;

    if (showActivation) {
      // With activation energy
      pathData = [
        { x: 20, y: reactantEnergy },
        { x: 50, y: activationEnergy },
        { x: 80, y: productEnergy }
      ];
    } else {
      // Direct transition
      pathData = [
        { x: 20, y: reactantEnergy },
        { x: 80, y: productEnergy }
      ];
    }

    // Create line for reaction path
    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveCardinal);

    // Draw reaction path
    g.append('path')
      .datum(pathData)
      .attr('fill', 'none')
      .attr('stroke', isExothermic ? '#ff5722' : '#2196f3')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Draw axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x)
        .tickFormat(() => '')
        .tickSize(0));

    g.append('g')
      .call(d3.axisLeft(y)
        .tickFormat(d => `${d} kJ/mol`));

    // Add axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .text('Reaction Progress');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text(viewType === 'energy' ? 'Enthalpy (kJ/mol)' : 'Free Energy (kJ/mol)');

    // Add reactant and product labels
    g.append('text')
      .attr('x', x(20))
      .attr('y', y(reactantEnergy) - 15)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Reactants');

    g.append('text')
      .attr('x', x(80))
      .attr('y', y(productEnergy) - 15)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Products');

    // Add activation energy label if showing
    if (showActivation) {
      g.append('text')
        .attr('x', x(50))
        .attr('y', y(activationEnergy) - 15)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('Transition State');

      // Add activation energy arrow and label
      const arrowStartX = x(35);
      const arrowEndX = x(50);
      const arrowY = y((reactantEnergy + activationEnergy) / 2);

      g.append('line')
        .attr('x1', arrowStartX)
        .attr('y1', arrowY)
        .attr('x2', arrowEndX)
        .attr('y2', arrowY)
        .attr('stroke', '#9c27b0')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

      g.append('text')
        .attr('x', (arrowStartX + arrowEndX) / 2)
        .attr('y', arrowY - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#9c27b0')
        .text(`Ea = ${Math.abs(customValues.activationEnergy)} kJ/mol`);
    }

    // Add delta H arrow and label
    const deltaH = productEnergy - reactantEnergy;
    const arrowStartY = y(Math.max(reactantEnergy, productEnergy));
    const arrowEndY = y(Math.min(reactantEnergy, productEnergy));
    const arrowX = x(90);

    g.append('line')
      .attr('x1', arrowX)
      .attr('y1', arrowStartY)
      .attr('x2', arrowX)
      .attr('y2', arrowEndY)
      .attr('stroke', isExothermic ? '#d32f2f' : '#2e7d32')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    g.append('text')
      .attr('x', arrowX + 15)
      .attr('y', (arrowStartY + arrowEndY) / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', isExothermic ? '#d32f2f' : '#2e7d32')
      .text(`ΔH = ${deltaH.toFixed(1)} kJ/mol`);

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

    // Add background for reactants area
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', x(35))
      .attr('height', innerHeight)
      .attr('fill', '#fff3e0')
      .attr('opacity', 0.3)
      .lower();

    // Add background for products area
    g.append('rect')
      .attr('x', x(65))
      .attr('y', 0)
      .attr('width', x(35))
      .attr('height', innerHeight)
      .attr('fill', '#e3f2fd')
      .attr('opacity', 0.3)
      .lower();

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('font-weight', 'bold')
      .text(`${isExothermic ? 'Exothermic' : 'Endothermic'} Reaction Energy Diagram`);
  };

  // Get sample reaction data based on selected reaction
  const getReactionData = () => {
    const reactions = {
      combustion: {
        title: 'Combustion of Methane',
        reactants: 'CH₄ + 2O₂',
        products: 'CO₂ + 2H₂O',
        deltaH: -890,
        equation: 'CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)',
        type: 'exothermic'
      },
      neutralization: {
        title: 'Neutralization Reaction',
        reactants: 'HCl + NaOH',
        products: 'NaCl + H₂O',
        deltaH: -56.2,
        equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
        type: 'exothermic'
      },
      photosynthesis: {
        title: 'Photosynthesis',
        reactants: '6CO₂ + 6H₂O',
        products: 'C₆H₁₂O₆ + 6O₂',
        deltaH: 2802,
        equation: '6CO₂(g) + 6H₂O(l) → C₆H₁₂O₆(s) + 6O₂(g)',
        type: 'endothermic'
      },
      decomposition: {
        title: 'Thermal Decomposition of Calcium Carbonate',
        reactants: 'CaCO₃',
        products: 'CaO + CO₂',
        deltaH: 178,
        equation: 'CaCO₃(s) → CaO(s) + CO₂(g)',
        type: 'endothermic'
      }
    };

    return reactions[reaction] || reactions.combustion;
  };

  const reactionData = getReactionData();

  // Handle reaction selection change
  const handleReactionChange = (event) => {
    const newReaction = event.target.value;
    setReaction(newReaction);

    // Update reaction type based on selected reaction
    const newReactionData = getReactionData();
    setReactionType(newReactionData.type);
  };

  return (
    <Box className="viz-container">
      <Typography variant="h5" className="viz-container__title" gutterBottom>
        Enthalpy & Energy Changes in Reactions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Energy Diagram
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <ToggleButtonGroup
                value={reactionType}
                exclusive
                onChange={() => toggleReactionType()}
                color="primary"
                aria-label="reaction type"
                size="small"
              >
<ToggleButton value="exothermic">Exothermic (ΔH &lt; 0)</ToggleButton>
<ToggleButton value="endothermic">Endothermic (ΔH &gt; 0)</ToggleButton>              </ToggleButtonGroup>

              <ToggleButtonGroup
                value={viewType}
                exclusive
                onChange={(e, newValue) => newValue && setViewType(newValue)}
                color="primary"
                aria-label="view type"
                size="small"
              >
                <ToggleButton value="energy">Enthalpy (H)</ToggleButton>
                <ToggleButton value="gibbs">Gibbs Free Energy (G)</ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant={showActivation ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                onClick={() => setShowActivation(!showActivation)}
              >
                {showActivation ? 'Hide' : 'Show'} Activation Energy
              </Button>
            </Box>

            <EnthalpyDiagram ref={diagramRef} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Customize Energy Values:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Reactants Energy (kJ/mol)"
                    type="number"
                    fullWidth
                    value={customValues.reactantEnergy}
                    onChange={(e) => handleValueChange('reactantEnergy', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Products Energy (kJ/mol)"
                    type="number"
                    fullWidth
                    value={customValues.productEnergy}
                    onChange={(e) => handleValueChange('productEnergy', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                {showActivation && (
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Activation Energy (kJ/mol)"
                      type="number"
                      fullWidth
                      value={customValues.activationEnergy}
                      onChange={(e) => handleValueChange('activationEnergy', e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Sample Reactions
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="reaction-select-label">Select Reaction</InputLabel>
              <Select
                labelId="reaction-select-label"
                value={reaction}
                label="Select Reaction"
                onChange={handleReactionChange}
              >
                <MenuItem value="combustion">Combustion of Methane</MenuItem>
                <MenuItem value="neutralization">Acid-Base Neutralization</MenuItem>
                <MenuItem value="photosynthesis">Photosynthesis</MenuItem>
                <MenuItem value="decomposition">Decomposition of CaCO₃</MenuItem>
              </Select>
            </FormControl>

            <ReactionCard>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {reactionData.title}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={5}>
                    <FormulaPaper>
                      <Typography variant="subtitle1" gutterBottom>
                        Reactants
                      </Typography>
                      <Typography variant="h5" sx={{ fontFamily: 'monospace' }}>
                        {reactionData.reactants}
                      </Typography>
                    </FormulaPaper>
                  </Grid>

                  <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4">→</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: reactionData.type === 'exothermic' ? 'success.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {reactionData.type === 'exothermic'
                          ? `ΔH = ${reactionData.deltaH} kJ/mol`
                          : `ΔH = +${reactionData.deltaH} kJ/mol`}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={5}>
                    <FormulaPaper isProduct>
                      <Typography variant="subtitle1" gutterBottom>
                        Products
                      </Typography>
                      <Typography variant="h5" sx={{ fontFamily: 'monospace' }}>
                        {reactionData.products}
                      </Typography>
                    </FormulaPaper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #ccc' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Balanced Equation:
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    {reactionData.equation}
                  </Typography>
                </Box>
              </CardContent>
            </ReactionCard>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Understanding Enthalpy
              </Typography>

              <Typography variant="body1" paragraph>
                Enthalpy (H) is a measure of the total energy in a thermodynamic system, including both internal energy and the energy needed to create space for the system and establish its pressure and volume.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Enthalpy of Reaction (ΔH<sub>rxn</sub>)
              </Typography>

              <Typography variant="body2" paragraph>
                The enthalpy change for a reaction is the difference between the enthalpies of the products and the reactants:
              </Typography>

              <Box sx={{
                bgcolor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                textAlign: 'center',
                my: 2
              }}>
                <Typography variant="h6">
                  ΔH<sub>rxn</sub> = Σ H<sub>products</sub> - Σ H<sub>reactants</sub>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="error.main">
                    Endothermic Reactions:
                  </Typography>
                  <Typography variant="body2">
                    • Absorb heat energy<br />
                    • ΔH is positive (+)<br />
                    • Products have higher energy than reactants
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    Exothermic Reactions:
                  </Typography>
                  <Typography variant="body2">
                    • Release heat energy<br />
                    • ΔH is negative (-)<br />
                    • Products have lower energy than reactants
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Enthalpy of Formation (ΔH<sub>f</sub>)
                <Tooltip title="The energy change when one mole of a compound forms from its constituent elements in their standard states">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>

              <Typography variant="body2" paragraph>
                The enthalpy of formation is the energy change when 1 mole of a compound forms from its elements in their standard states.
              </Typography>

              <Box sx={{
                bgcolor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                mb: 2
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  Example Problem:
                </Typography>
                <Typography variant="body2">
                  Calculate ΔH<sub>rxn</sub> for the combustion of methane using standard enthalpies of formation:
                </Typography>
                <Box sx={{ fontFamily: 'monospace', mt: 1 }}>
                  CH<sub>4</sub>(g) + 2O<sub>2</sub>(g) → CO<sub>2</sub>(g) + 2H<sub>2</sub>O(g)
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Given:<br />
                    ΔH<sub>f</sub>° [CH<sub>4</sub>(g)] = -74.8 kJ/mol<br />
                    ΔH<sub>f</sub>° [O<sub>2</sub>(g)] = 0 kJ/mol<br />
                    ΔH<sub>f</sub>° [CO<sub>2</sub>(g)] = -393.5 kJ/mol<br />
                    ΔH<sub>f</sub>° [H<sub>2</sub>O(g)] = -241.8 kJ/mol
                  </Typography>
                </Box>
                <Box sx={{
                  mt: 2,
                  p: 1,
                  border: '1px dashed #aaa',
                  borderRadius: 1
                }}>
                  <Typography variant="body2">
                    Solution:<br />
                    ΔH<sub>rxn</sub> = Σ ΔH<sub>f</sub>°(products) - Σ ΔH<sub>f</sub>°(reactants)<br />
                    ΔH<sub>rxn</sub> = [ΔH<sub>f</sub>°(CO<sub>2</sub>) + 2 × ΔH<sub>f</sub>°(H<sub>2</sub>O)] - [ΔH<sub>f</sub>°(CH<sub>4</sub>) + 2 × ΔH<sub>f</sub>°(O<sub>2</sub>)]<br />
                    ΔH<sub>rxn</sub> = [(-393.5) + 2(-241.8)] - [(-74.8) + 2(0)]<br />
                    ΔH<sub>rxn</sub> = -877.1 - (-74.8)<br />
                    ΔH<sub>rxn</sub> = -802.3 kJ/mol
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Activation Energy (E<sub>a</sub>)
              </Typography>

              <Typography variant="body2">
                The minimum energy required for a reaction to occur. Even exothermic reactions often require an initial energy input to overcome this energy barrier.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnthalpyViz;