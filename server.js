const express = require('express');
const path = require('path');
const medicinesRouter = require('./routes/medicines');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/medicines', medicinesRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Medical Supply Chain server running on http://localhost:${PORT}`);
});

module.exports = app;
