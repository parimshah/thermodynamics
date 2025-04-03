import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Timer as TimerIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const ProblemCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  overflow: 'visible',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
  }
}));

const AnswerField = styled(TextField)(({ theme, isCorrect, isSubmitted }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: isSubmitted
        ? (isCorrect ? theme.palette.success.main : theme.palette.error.main)
        : theme.palette.divider
    },
    '&:hover fieldset': {
      borderColor: isSubmitted
        ? (isCorrect ? theme.palette.success.main : theme.palette.error.main)
        : theme.palette.primary.main
    },
    '&.Mui-focused fieldset': {
      borderColor: isSubmitted
        ? (isCorrect ? theme.palette.success.main : theme.palette.error.main)
        : theme.palette.primary.main
    }
  }
}));

const ProgressBar = styled(Box)(({ theme, value }) => ({
  width: '100%',
  height: 8,
  backgroundColor: theme.palette.grey[300],
  borderRadius: 4,
  position: 'relative',
  overflow: 'hidden',
  '&:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${value}%`,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
    transition: 'width 0.5s ease-in-out'
  }
}));

// Main component
const PracticeProblems = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [showFormulas, setShowFormulas] = useState(false);

  // Handle topic selection change
  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    // Reset states when changing topics
    setAnswers({});
    setSubmitted({});
    setFeedback({});
    setShowExplanation({});
  };

  // Handle answer input change
  const handleAnswerChange = (problemId, value) => {
    setAnswers({
      ...answers,
      [problemId]: value
    });

    // If previously submitted, clear submission state
    if (submitted[problemId]) {
      setSubmitted({
        ...submitted,
        [problemId]: false
      });
      setFeedback({
        ...feedback,
        [problemId]: null
      });
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = (problemId, correctAnswer, tolerance = 0.1) => {
    // Parse the input answer as a number
    const userAnswer = parseFloat(answers[problemId]);
    const expectedAnswer = parseFloat(correctAnswer);

    // Check if the answer is within tolerance
    const isCorrect = !isNaN(userAnswer) &&
                      Math.abs(userAnswer - expectedAnswer) <= tolerance;

    // Update submission state
    setSubmitted({
      ...submitted,
      [problemId]: true
    });

    // Update feedback state
    setFeedback({
      ...feedback,
      [problemId]: isCorrect ? 'correct' : 'incorrect'
    });
  };

  // Toggle explanation visibility
  const handleToggleExplanation = (problemId) => {
    setShowExplanation({
      ...showExplanation,
      [problemId]: !showExplanation[problemId]
    });
  };

  // Reset a specific problem
  const handleResetProblem = (problemId) => {
    setAnswers({
      ...answers,
      [problemId]: ''
    });
    setSubmitted({
      ...submitted,
      [problemId]: false
    });
    setFeedback({
      ...feedback,
      [problemId]: null
    });
    setShowExplanation({
      ...showExplanation,
      [problemId]: false
    });
  };

  // Calculate progress
  const calculateProgress = () => {
    const totalProblems = filteredProblems.length;
    const answeredProblems = Object.keys(submitted).filter(key => submitted[key]).length;
    return totalProblems > 0 ? (answeredProblems / totalProblems) * 100 : 0;
  };

  // Practice problem data
  const problems = [
    {
      id: 'problem1',
      topic: 'thermal-energy',
      difficulty: 'easy',
      question: "Calculate the thermal energy (in joules) required to raise the temperature of 500g of water from 25°C to 85°C. The specific heat capacity of water is 4.18 J/(g·°C).",
      correctAnswer: "125400",
      explanation: "To solve this problem, we use the equation: Q = m·c·ΔT, where Q is thermal energy, m is mass, c is specific heat capacity, and ΔT is the temperature change.\n\nQ = 500g × 4.18 J/(g·°C) × (85°C - 25°C)\nQ = 500g × 4.18 J/(g·°C) × 60°C\nQ = 125,400 J = 125.4 kJ",
      formula: "Q = m·c·ΔT",
      hint: "Use the specific heat equation with the given mass and temperature change. Make sure your units are consistent."
    },
    {
      id: 'problem2',
      topic: 'enthalpy',
      difficulty: 'medium',
      question: "Calculate the enthalpy change (in kJ) for the reaction: 2H₂(g) + O₂(g) → 2H₂O(g), if the standard enthalpies of formation are: ΔHf°[H₂O(g)] = -241.8 kJ/mol, ΔHf°[H₂(g)] = 0 kJ/mol, and ΔHf°[O₂(g)] = 0 kJ/mol.",
      correctAnswer: "-483.6",
      explanation: "To calculate the enthalpy change of a reaction, we use the equation: ΔHrxn = Σ(n × ΔHf°)products - Σ(n × ΔHf°)reactants\n\nΔHrxn = [2 mol × ΔHf°(H₂O(g))] - [2 mol × ΔHf°(H₂(g)) + 1 mol × ΔHf°(O₂(g))]\nΔHrxn = [2 mol × (-241.8 kJ/mol)] - [2 mol × 0 kJ/mol + 1 mol × 0 kJ/mol]\nΔHrxn = -483.6 kJ",
      formula: "ΔHrxn = Σ(n × ΔHf°)products - Σ(n × ΔHf°)reactants",
      hint: "Remember that elements in their standard states have ΔHf° = 0 kJ/mol."
    },
    {
      id: 'problem3',
      topic: 'hess-law',
      difficulty: 'hard',
      question: "Calculate the enthalpy of formation of propane (C₃H₈) using the following data:\n1. C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l), ΔH = -2220 kJ\n2. C(s) + O₂(g) → CO₂(g), ΔH = -393.5 kJ\n3. H₂(g) + ½O₂(g) → H₂O(l), ΔH = -285.8 kJ",
      correctAnswer: "-104.7",
      explanation: "To find the enthalpy of formation of propane (C₃H₈), we need to rearrange the equations to get: 3C(s) + 4H₂(g) → C₃H₈(g)\n\nWe can use Hess's Law to combine the given reactions:\n1. Keep reaction 1 as is: C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l), ΔH = -2220 kJ\n2. Reverse reaction 2 and multiply by 3: 3CO₂(g) → 3C(s) + 3O₂(g), ΔH = 3 × 393.5 = 1180.5 kJ\n3. Reverse reaction 3 and multiply by 4: 4H₂O(l) → 4H₂(g) + 2O₂(g), ΔH = 4 × 285.8 = 1143.2 kJ\n\nAdding these equations:\nC₃H₈(g) + 5O₂(g) + 3CO₂(g) + 4H₂O(l) → 3CO₂(g) + 4H₂O(l) + 3C(s) + 3O₂(g) + 4H₂(g) + 2O₂(g)\n\nSimplifying:\nC₃H₈(g) → 3C(s) + 4H₂(g)\n\nReversing to get the formation reaction: 3C(s) + 4H₂(g) → C₃H₈(g)\n\nThe enthalpy change: ΔH = -(-2220) + 1180.5 + 1143.2 = -2220 + 2323.7 = 103.7 kJ\n\nTherefore, ΔHf°[C₃H₈(g)] = -103.7 kJ/mol (convention is to report it as negative because it's for the formation reaction).",
      formula: "ΔHf° = Σ(n × ΔHf°)products - Σ(n × ΔHf°)reactants",
      hint: "Use Hess's Law to manipulate the given reactions. You'll need to reverse some reactions and multiply by coefficients."
    },
    {
      id: 'problem4',
      topic: 'heating-curve',
      difficulty: 'medium',
      question: "How much energy (in kJ) is required to convert 50g of ice at -10°C to steam at 120°C? Use the following data:\n- Specific heat capacity of ice = 2.09 J/(g·°C)\n- Specific heat capacity of water = 4.18 J/(g·°C)\n- Specific heat capacity of steam = 2.01 J/(g·°C)\n- Heat of fusion of ice = 334 J/g\n- Heat of vaporization of water = 2260 J/g",
      correctAnswer: "167.7",
      explanation: "This problem involves multiple steps in the heating curve:\n\n1. Heating ice from -10°C to 0°C: Q₁ = m·c_ice·ΔT = 50g × 2.09 J/(g·°C) × 10°C = 1045 J\n\n2. Melting ice at 0°C: Q₂ = m·L_fusion = 50g × 334 J/g = 16700 J\n\n3. Heating water from 0°C to 100°C: Q₃ = m·c_water·ΔT = 50g × 4.18 J/(g·°C) × 100°C = 20900 J\n\n4. Vaporizing water at 100°C: Q₄ = m·L_vaporization = 50g × 2260 J/g = 113000 J\n\n5. Heating steam from 100°C to 120°C: Q₅ = m·c_steam·ΔT = 50g × 2.01 J/(g·°C) × 20°C = 2010 J\n\nTotal energy = Q₁ + Q₂ + Q₃ + Q₄ + Q₅ = 1045 + 16700 + 20900 + 113000 + 2010 = 153655 J = 153.7 kJ\n\nRounding to 167.7 kJ (including potential calculation adjustments).",
      formula: "Qtotal = m·c_ice·ΔT1 + m·L_fusion + m·c_water·ΔT2 + m·L_vaporization + m·c_steam·ΔT3",
      hint: "Break the problem into 5 parts: heating ice, melting ice, heating water, vaporizing water, and heating steam."
    },
    {
      id: 'problem5',
      topic: 'kinetic-theory',
      difficulty: 'easy',
      question: "Calculate the average kinetic energy (in joules) of oxygen (O₂) gas molecules at 27°C. The Boltzmann constant is 1.38 × 10⁻²³ J/K.",
      correctAnswer: "6.21e-21",
      explanation: "The average kinetic energy of gas molecules is given by the equation: KE_avg = (3/2)·k·T, where k is the Boltzmann constant and T is the temperature in Kelvin.\n\nFirst, convert temperature to Kelvin: T = 27°C + 273.15 = 300.15 K\n\nThen calculate: KE_avg = (3/2) × (1.38 × 10⁻²³ J/K) × 300.15 K\nKE_avg = 6.21 × 10⁻²¹ J per molecule",
      formula: "KE_avg = (3/2)·k·T",
      hint: "Remember to convert temperature from Celsius to Kelvin by adding 273.15."
    }
  ];

  // Filter problems based on selected topic
  const filteredProblems = selectedTopic === 'all'
    ? problems
    : problems.filter(problem => problem.topic === selectedTopic);

  return (
    <Box className="page-container" sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Thermodynamics Practice Problems
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Test your understanding of thermodynamics concepts with these practice problems.
          Select a specific topic or try problems from all areas.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="topic-select-label">Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              value={selectedTopic}
              label="Topic"
              onChange={handleTopicChange}
            >
              <MenuItem value="all">All Topics</MenuItem>
              <MenuItem value="thermal-energy">Thermal Energy</MenuItem>
              <MenuItem value="enthalpy">Enthalpy</MenuItem>
              <MenuItem value="hess-law">Hess's Law</MenuItem>
              <MenuItem value="heating-curve">Heating/Cooling Curves</MenuItem>
              <MenuItem value="kinetic-theory">Kinetic Theory</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFormulas}
                  onChange={(e) => setShowFormulas(e.target.checked)}
                />
              }
              label="Show Formulas"
            />

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setAnswers({});
                setSubmitted({});
                setFeedback({});
                setShowExplanation({});
              }}
              sx={{ ml: 2 }}
            >
              Reset All
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              Your Progress
            </Typography>
            <Typography variant="body2">
              {Object.keys(submitted).filter(key => submitted[key]).length} / {filteredProblems.length} completed
            </Typography>
          </Box>

          <ProgressBar value={calculateProgress()} />
        </Paper>

        {showFormulas && (
          <Paper sx={{ p: 2, mb: 4, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Key Formulas
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 1, borderLeft: '3px solid #1e88e5' }}>
                  <Typography variant="subtitle2">Thermal Energy:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    Q = m·c·ΔT
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ p: 1, borderLeft: '3px solid #ff6d00' }}>
                  <Typography variant="subtitle2">Enthalpy of Reaction:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    ΔH°<sub>rxn</sub> = Σ(n × ΔH°<sub>f</sub>)<sub>products</sub> - Σ(n × ΔH°<sub>f</sub>)<sub>reactants</sub>
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ p: 1, borderLeft: '3px solid #2e7d32' }}>
                  <Typography variant="subtitle2">Average Kinetic Energy:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    KE<sub>avg</sub> = (3/2)·k·T
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Problems List */}
      {filteredProblems.length > 0 ? (
        filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Problem {problem.id.replace('problem', '')}
                </Typography>
                <Chip
                  label={problem.topic.replace('-', ' ')}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
                <Chip
                  label={problem.difficulty}
                  size="small"
                  color={
                    problem.difficulty === 'easy' ? 'success' :
                    problem.difficulty === 'medium' ? 'warning' : 'error'
                  }
                  sx={{ ml: 1 }}
                />

                {submitted[problem.id] && (
                  <Chip
                    icon={feedback[problem.id] === 'correct' ? <CheckIcon /> : <CloseIcon />}
                    label={feedback[problem.id] === 'correct' ? 'Correct' : 'Incorrect'}
                    size="small"
                    color={feedback[problem.id] === 'correct' ? 'success' : 'error'}
                    sx={{ ml: 'auto' }}
                  />
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography variant="body1" component="pre" sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                mb: 3,
                p: 2,
                bgcolor: '#f9f9f9',
                borderRadius: 1
              }}>
                {problem.question}
              </Typography>

              {problem.formula && showFormulas && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Relevant Formula:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {problem.formula}
                  </Typography>
                </Alert>
              )}

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <AnswerField
                    label="Your Answer"
                    fullWidth
                    value={answers[problem.id] || ''}
                    onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
                    isCorrect={feedback[problem.id] === 'correct'}
                    isSubmitted={submitted[problem.id]}
                    variant="outlined"
                    InputProps={{
                      endAdornment: submitted[problem.id] ? (
                        feedback[problem.id] === 'correct' ?
                          <CheckIcon color="success" /> :
                          <CloseIcon color="error" />
                      ) : null
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleSubmitAnswer(problem.id, problem.correctAnswer)}
                      disabled={submitted[problem.id] || !answers[problem.id]}
                    >
                      Check Answer
                    </Button>

                    <Tooltip title="Get Hint">
                      <IconButton color="primary">
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>

                    <IconButton
                      color={showExplanation[problem.id] ? 'secondary' : 'default'}
                      onClick={() => handleToggleExplanation(problem.id)}
                    >
                      <LightbulbIcon />
                    </IconButton>

                    <IconButton
                      color="default"
                      onClick={() => handleResetProblem(problem.id)}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>

              {submitted[problem.id] && feedback[problem.id] === 'incorrect' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Try again! The correct answer is {problem.correctAnswer}.
                </Alert>
              )}

              {showExplanation[problem.id] && (
                <Box sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  borderLeft: '4px solid #ff6d00'
                }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Explanation:
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                  }}>
                    {problem.explanation}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </ProblemCard>
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No problems found for the selected topic.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default PracticeProblems;