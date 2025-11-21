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
  mobileDetails: MobileDetailsSchema
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
