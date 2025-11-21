const express = require('express');
const bodyParser = require('body-parser');
const { parsePhoneNumberFromString, getCountryCallingCode } = require('libphonenumber-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Mobile Validation Microservice is running'));

app.post('/phoneValidation', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ valid: false, error: 'Missing mobile field' });

    const phoneNumber = parsePhoneNumberFromString(mobile);

    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ valid: false, error: 'Invalid phone number' });
    }

    const countryCode = phoneNumber.country;
    const countryCallingCode = '+' + phoneNumber.countryCallingCode;

    return res.json({
      valid: true,
      countryCode,
      countryCallingCode,
      countryName: getCountryNameFromCode(countryCode),
      operatorName: null, 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false, error: 'Server error' });
  }
});

function getCountryNameFromCode(code) {
  const map = {
    US: 'United States',
    GB: 'United Kingdom',
    IN: 'India',
    LB: 'Lebanon',
    CN: 'China',
    DE: 'Germany',
    FR: 'France',
    ES: 'Spain',
    IT: 'Italy',
  };
  return map[code] || code;
}

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Microservice running on port ${PORT}`));
}

module.exports = { app };
