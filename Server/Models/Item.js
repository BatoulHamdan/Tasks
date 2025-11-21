const mongoose = require('mongoose');

const MobileDetailsSchema = new mongoose.Schema({
  countryCode: String,
  countryCallingCode: String,
  countryName: String,
  operatorName: String
}, { _id: false });

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  mobileNumber: String,
  mobileDetails: MobileDetailsSchema,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
