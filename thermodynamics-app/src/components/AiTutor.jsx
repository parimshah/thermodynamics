import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Avatar,
  Slide,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { aiTutorService } from '../utils/aiTutorService';

// Styled components
const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1.5),
  maxWidth: '80%',
  borderRadius: sender === 'user'
    ? theme.spacing(2, 0, 2, 2)
    : theme.spacing(0, 2, 2, 2),
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  backgroundColor: sender === 'user'
    ? theme.palette.primary.light
    : theme.palette.background.paper,
  color: sender === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: theme.shadows[1]
}));

const MessagesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  flexGrow: 1,
  height: '400px',
  padding: '16px'
});

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AiTutor = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, I'm Chevin, your thermodynamics tutor! I can help explain concepts or provide hints for practice problems. What would you like to learn about today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('geminiApiKey'));
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Here we use the aiTutorService to call the Gemini API
      const response = await aiTutorService.askQuestion(input, apiKey);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error querying Gemini API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please check your API key or try again later.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    setShowSettings(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PsychologyIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Chevin - Your Thermodynamics Tutor</Typography>
        </Box>
        <Box>
          <Tooltip title="Settings">
            <IconButton
              color="inherit"
              onClick={() => setShowSettings(!showSettings)}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <IconButton color="inherit" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {showSettings ? (
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Gemini API Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              To use Chevin, you need to provide a Gemini API key. You can get one from the Google AI Studio.
            </Typography>
            <TextField
              label="Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
              helperText="Your API key is stored locally and never sent to our servers"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={saveApiKey}
              disabled={!apiKey.trim()}
              sx={{ mt: 2 }}
            >
              Save API Key
            </Button>
          </Box>
        </DialogContent>
      ) : (
        <>
          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '500px' }}>
            <MessagesContainer>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  {message.sender === 'bot' && (
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32,
                        mr: 1,
                        mt: 0.5
                      }}
                    >
                      <PsychologyIcon fontSize="small" />
                    </Avatar>
                  )}
                  <MessageBubble sender={message.sender} elevation={1}>
                    <Typography variant="body1">
                      {message.text}
                    </Typography>
                  </MessageBubble>
                  {message.sender === 'user' && (
                    <Avatar
                      sx={{
                        bgcolor: 'secondary.main',
                        width: 32,
                        height: 32,
                        ml: 1,
                        mt: 0.5
                      }}
                    >
                      <QuestionAnswerIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', my: 2, ml: 6 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Chevin is thinking...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Ask about thermodynamics concepts..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !apiKey}
              multiline
              maxRows={3}
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading || !apiKey}
                  >
                    <SendIcon />
                  </IconButton>
                )
              }}
            />
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AiTutor;