const express = require('express');
const router = express.Router();
const Category = require('../Models/Category');

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const category = new Category({ name });
    await category.save();

    res.json(category);

  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: "Category already exists" });
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error("Category fetch error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
