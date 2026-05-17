const express = require('express');
const cors = require('cors');
const logic = require('./logic');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/items', async (req, res) => {
  const items = await logic.listItems();
  res.status(200).json(items);
});

app.post('/items', async (req, res) => {
  const result = await logic.createItem(req.body);
  if (result && result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

app.get('/stats', async (req, res) => {
  const stats = await logic.getStats();
  
  res.status(200).header('X-Cache',stats.cached ? 'HIT' : 'MISS').json(stats.data);
});

app.get('/health', async (req, res) => {
  const health = await logic.getServerHealth();
  res.status(200).json(health);
});

app.get('/ready', async (req, res) => {
  const health = await logic.checkServerReadiness();
  res.status(200).json(health);
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
