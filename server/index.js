const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool, initDb } = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Initialize database on startup
initDb().catch(console.error);

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
  try {
    const { username, password, isAdmin } = req.body;
    
    // Check if username already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, isAdmin]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, isAdmin: user.is_admin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes
app.get('/api/reciters', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reciters ORDER BY id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reciters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/reciters/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { juz } = req.body;
    
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const result = await pool.query(
      'UPDATE reciters SET assigned_juz = $1, completed = false WHERE id = $2 RETURNING *',
      [juz, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error assigning juz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/reciters/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    const result = await pool.query(
      'UPDATE reciters SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating completion status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});