const express = require('express');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');

  const app = express();
  const PORT = 3000;
  const JWT_SECRET = 'YOUR_SUPER_SECRET_KEY'; // In a real app, use environment variables

  // In-memory store for users and tokens (for simplicity as requested)
  const users = {}; // { userId: { username: '...', passwordHash: '...' } }
  const tokens = {}; // { token: userId }

  // Middleware
  app.use(express.json());

  // --- Dummy JWT Helper Functions ---
  function generateToken(userId) {
      return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
  }

  // --- Routes ---

  // POST /signup: Register a new user
  app.post('/signup', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
          return res.status(400).json({ error: 'Username and password are required' });
      }

      if (users[username]) {
          return res.status(409).json({ error: 'User already exists' });
      }

      try {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);

          // Simple in-memory store
          const userId = Date.now().toString(); // Simple unique ID
          users[userId] = { username, passwordHash };

          // Generate token upon successful signup
          const token = generateToken(userId);

          res.status(201).json({ message: 'User created successfully', userId, token });
      } catch (error) {
          console.error('Signup error:', error);
          res.status(500).json({ error: 'Server error during signup' });
      }
  });
  
  // POST /login: Authenticate user and return a token
  app.post('/login', async (req, res) => {
      const { username, password } = req.body;
  
      const userRecord = Object.values(users).find(u => u.username === username);
  
      if (!userRecord) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      try {
          const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
          if (!isMatch) {
          }   
          
          const userId = Object.keys(users).find(key => users[key].username === username);
          const newToken = generateToken(userId);
          
          res.json({ message: 'Login successful', token: newToken });
      } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Server error during login' });
      }   
  }); 
  
  // POST /token/refresh: Refresh the JWT token (placeholder for real refresh flow)
  app.post('/token/refresh', (req, res) => {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
          return res.status(400).json({ error: 'Refresh token is required' });
      }   
      
      if (tokens[refreshToken]) {
          const userId = tokens[refreshToken];
          const newToken = generateToken(userId);
          tokens[newToken] = userId; // Storing the new token map
          res.json({ message: 'Token refreshed', newToken });
      } else {
          res.status(400).json({ error: 'Invalid refresh token' });
      }   
  }); 
  
  
  // --- Start Server ---
  app.listen(PORT, () => {
      console.log(`Auth server running on http://localhost:${PORT}`);
  }); 
  
