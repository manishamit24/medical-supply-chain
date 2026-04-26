const express = require('express');
const cors = require('cors');
const medicines = require('./data');

const app = express();
app.use(cors());

const PORT = 3000;

// API route
app.get('/medicine/:id', (req, res) => {
  const id = req.params.id;

  const medicine = medicines.find(m => m.id === id);

  if (medicine) {
    res.json(medicine);
  } else {
    res.json({ message: "Medicine not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});