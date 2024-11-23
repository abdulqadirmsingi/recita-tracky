const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage (replace with a database in production)
let reciters = [
  { id: 1, name: "Reciter 1", assignedJuz: null, completed: false },
  { id: 2, name: "Reciter 2", assignedJuz: null, completed: false },
  { id: 3, name: "Reciter 3", assignedJuz: null, completed: false },
  { id: 4, name: "Reciter 4", assignedJuz: null, completed: false },
  { id: 5, name: "Reciter 5", assignedJuz: null, completed: false },
  { id: 6, name: "Reciter 6", assignedJuz: null, completed: false },
];

let users = [];
let admins = [];

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  
  // Check if username already exists
  if (users.find(u => u.username === username) || admins.find(a => a.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, password: hashedPassword };

  if (isAdmin) {
    admins.push(newUser);
  } else {
    users.push(newUser);
  }

  res.status(201).json({ message: 'User created successfully' });
});

app.post('/api/login', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const usersList = isAdmin ? admins : users;
  const user = usersList.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, isAdmin }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, isAdmin });
});

// Protected routes
app.get('/api/reciters', authenticateToken, (req, res) => {
  res.json(reciters);
});

app.put('/api/reciters/:id/assign', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { juz } = req.body;
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  reciters = reciters.map(reciter =>
    reciter.id === parseInt(id)
      ? { ...reciter, assignedJuz: juz, completed: false }
      : reciter
  );
  
  res.json(reciters.find(r => r.id === parseInt(id)));
});

app.put('/api/reciters/:id/complete', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  reciters = reciters.map(reciter =>
    reciter.id === parseInt(id)
      ? { ...reciter, completed }
      : reciter
  );
  
  res.json(reciters.find(r => r.id === parseInt(id)));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});