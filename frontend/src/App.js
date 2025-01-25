import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    // Add user query to the conversation
    setConversation([...conversation, { sender: 'user', text: query }]);
    setLoading(true);

    try {
      // Send the user query to the backend
      const response = await axios.post('http://localhost:8000/query', { query });

      // Add chatbot response to the conversation
      setConversation([
        ...conversation,
        { sender: 'user', text: query },
        { sender: 'bot', text: response.data.answer }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setConversation([
        ...conversation,
        { sender: 'user', text: query },
        { sender: 'bot', text: "Sorry, I couldn't fetch any data." }
      ]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h4" gutterBottom>AI-powered Product & Supplier Chatbot</Typography>
        <Box sx={{ height: 400, overflowY: 'scroll', marginBottom: 2 }}>
          {conversation.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              <Box
                sx={{
                  maxWidth: '70%',
                  padding: 1,
                  marginBottom: 1,
                  backgroundColor: msg.sender === 'user' ? '#cce7ff' : '#f1f1f1',
                  borderRadius: 2
                }}
              >
                <Typography>{msg.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <TextField
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me about products or suppliers..."
            sx={{ marginRight: 1 }}
          />
          <Button variant="contained" onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
