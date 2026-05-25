const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// In-memory stores
const users = {};  // { userId: { username, passwordHash } }
const tokens = {}; // { token: userId }

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

// POST /signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existing = Object.values(users).find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    users[userId] = { username, passwordHash };
    const token = generateToken(userId);
    tokens[token] = userId;
    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const userEntry = Object.entries(users).find(([, u]) => u.username === username);
  if (!userEntry) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const [userId, userRecord] = userEntry;

  try {
    const isMatch = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(userId);
    tokens[token] = userId;
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /token/refresh
app.post('/token/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const userId = tokens[refreshToken];
  if (!userId) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  delete tokens[refreshToken];
  const token = generateToken(userId);
  tokens[token] = userId;
  res.json({ message: 'Token refreshed', token });
});

app.listen(PORT, () => {
  console.log(`Auth server running at http://localhost:${PORT}`);
});
