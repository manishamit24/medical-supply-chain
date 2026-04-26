const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const medicines = [];

// GET all medicines
router.get('/', (req, res) => {
  res.json(medicines);
});

// GET single medicine by id
router.get('/:id', (req, res) => {
  const medicine = medicines.find((m) => m.id === req.params.id);
  if (!medicine) {
    return res.status(404).json({ error: 'Medicine not found' });
  }
  res.json(medicine);
});

// POST create a new medicine entry
router.post('/', (req, res) => {
  const { name, manufacturer, batchNumber, expiryDate, quantity, location, status } = req.body;

  if (!name || !manufacturer || !batchNumber || !expiryDate || quantity === undefined || !location) {
    return res.status(400).json({ error: 'Missing required fields: name, manufacturer, batchNumber, expiryDate, quantity, location' });
  }

  const medicine = {
    id: uuidv4(),
    name,
    manufacturer,
    batchNumber,
    expiryDate,
    quantity: Number(quantity),
    location,
    status: status || 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  medicines.push(medicine);
  res.status(201).json(medicine);
});

// PUT update an existing medicine entry
router.put('/:id', (req, res) => {
  const index = medicines.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Medicine not found' });
  }

  const { name, manufacturer, batchNumber, expiryDate, quantity, location, status } = req.body;

  medicines[index] = {
    ...medicines[index],
    ...(name !== undefined && { name }),
    ...(manufacturer !== undefined && { manufacturer }),
    ...(batchNumber !== undefined && { batchNumber }),
    ...(expiryDate !== undefined && { expiryDate }),
    ...(quantity !== undefined && { quantity: Number(quantity) }),
    ...(location !== undefined && { location }),
    ...(status !== undefined && { status }),
    updatedAt: new Date().toISOString(),
  };

  res.json(medicines[index]);
});

// DELETE a medicine entry
router.delete('/:id', (req, res) => {
  const index = medicines.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Medicine not found' });
  }

  medicines.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
