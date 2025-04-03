import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import Fundamentals from './pages/Fundamentals';
import HeatingCooling from './pages/HeatingCooling';
import EnthalpyPage from './pages/EnthalpyPage';
import HessLawPage from './pages/HessLawPage';
import PracticeProblems from './pages/PracticeProblems';
import AiTutor from './components/AiTutor';
import './styles/main.scss';

// Create a custom theme with science/chemistry inspired colors
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e88e5', // energetic blue for energy concepts
    },
    secondary: {
      main: '#ff6d00', // orange/amber for heat concepts
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
    info: {
      main: '#5e35b1', // purple for academic concepts
    },
    success: {
      main: '#2e7d32', // green for exothermic reactions
    },
    error: {
      main: '#d32f2f', // red for endothermic reactions
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
          }
        }
      }
    }
  }
});

function App() {
  const [aiTutorOpen, setAiTutorOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Navigation />
          <main className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/fundamentals" element={<Fundamentals />} />
              <Route path="/heating-cooling" element={<HeatingCooling />} />
              <Route path="/enthalpy" element={<EnthalpyPage />} />
              <Route path="/hess-law" element={<HessLawPage />} />
              <Route path="/practice" element={<PracticeProblems />} />
            </Routes>
          </main>
          <button
            className="ai-tutor-button"
            onClick={() => setAiTutorOpen(true)}
            aria-label="Open AI Tutor"
          >
            <span className="tutor-icon">🧪</span>
            <span className="tutor-text">Ask Chevin</span>
          </button>
          <AiTutor open={aiTutorOpen} onClose={() => setAiTutorOpen(false)} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;