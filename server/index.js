const express = require('express');
const cors = require('cors');
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

// Get all reciters
app.get('/api/reciters', (req, res) => {
  res.json(reciters);
});

// Assign Juz to reciter
app.put('/api/reciters/:id/assign', (req, res) => {
  const { id } = req.params;
  const { juz } = req.body;
  
  reciters = reciters.map(reciter =>
    reciter.id === parseInt(id)
      ? { ...reciter, assignedJuz: juz, completed: false }
      : reciter
  );
  
  res.json(reciters.find(r => r.id === parseInt(id)));
});

// Update completion status
app.put('/api/reciters/:id/complete', (req, res) => {
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