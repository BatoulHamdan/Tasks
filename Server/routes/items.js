const express = require('express');
const router = express.Router();
const Item = require('../Models/Item');
const axios = require('axios');

const MOBILE_SERVICE_URL =
  process.env.MOBILE_SERVICE_URL ||
  "http://localhost:5001/phoneValidation";

router.post('/', async (req, res) => {
  try {
    const { name, description, mobileNumber } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    let mobileDetails = null;

    if (mobileNumber) {
      const resp = await axios.post(MOBILE_SERVICE_URL, { mobile: mobileNumber });

      if (!resp.data.valid) {
        return res.status(400).json({ error: "Invalid mobile number" });
      }

      mobileDetails = resp.data;
    }

    const item = new Item({
      name,
      description,
      mobileNumber: mobileNumber || null,
      mobileDetails,
    });

    await item.save();
    res.json(item);

  } catch (err) {
    console.error("Item create error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description, mobileNumber } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;

    if (mobileNumber !== undefined) {
      if (!mobileNumber) {
        item.mobileNumber = null;
        item.mobileDetails = null;
      } else {
        const resp = await axios.post(MOBILE_SERVICE_URL, { mobile: mobileNumber });

        if (!resp.data.valid) {
          return res.status(400).json({ error: "Invalid mobile number" });
        }

        item.mobileNumber = mobileNumber;
        item.mobileDetails = resp.data;
      }
    }

    await item.save();
    res.json(item);

  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json({ success: true });

  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
