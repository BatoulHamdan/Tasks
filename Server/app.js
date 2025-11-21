const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_CONNECTION;

const MOBILE_SERVICE_URL = process.env.MOBILE_SERVICE_URL || 'http://localhost:5001/phoneValidation';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error(err));

app.post('/api/items', async (req, res) => {
  try {
    const { name, description, mobileNumber } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    let mobileDetails = null;
    if (mobileNumber) {
      const resp = await axios.post(MOBILE_SERVICE_URL, { mobile: mobileNumber });
      if (!resp.data || !resp.data.valid) {
        return res.status(400).json({ error: 'Invalid mobile number' });
      }
      mobileDetails = {
        countryCode: resp.data.countryCode,
        countryCallingCode: resp.data.countryCallingCode,
        countryName: resp.data.countryName,
        operatorName: resp.data.operatorName,
      };
    }

    const item = new Item({ name, description, mobileNumber: mobileNumber || null, mobileDetails });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    if (err.response && err.response.status === 400) {
      return res.status(400).json({ error: err.response.data.error || 'Invalid mobile number' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, mobileNumber } = req.body;

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;

    if (mobileNumber !== undefined) {
      if (mobileNumber) {
        const resp = await axios.post(MOBILE_SERVICE_URL, { mobile: mobileNumber });
        if (!resp.data || !resp.data.valid) {
          return res.status(400).json({ error: 'Invalid mobile number' });
        }
        item.mobileNumber = mobileNumber;
        item.mobileDetails = {
          countryCode: resp.data.countryCode,
          countryCallingCode: resp.data.countryCallingCode,
          countryName: resp.data.countryName,
          operatorName: resp.data.operatorName,
        };
      } else {
        item.mobileNumber = null;
        item.mobileDetails = null;
      }
    }

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
