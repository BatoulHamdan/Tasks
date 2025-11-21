const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');

app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

const MONGO = process.env.MONGO_CONNECTION;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch((err) => console.error('Mongo Error:', err));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Main API listening on port ${PORT}`));
}

module.exports = { app };
