const express = require('express');
const bodyParser = require('body-parser');
const { parsePhoneNumberFromString, getCountryCallingCode } = require('libphonenumber-js');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5001;

async function getOperator(number) {
  //...
  return null;
}

app.post('/phoneValidation', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ valid: false, error: 'Missing mobile field' });

    
    let phoneNumber = parsePhoneNumberFromString(mobile);

    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ valid: false, error: 'Invalid phone number' });
    }

    const countryCode = phoneNumber.country; 
    const countryCallingCode = '+' + phoneNumber.countryCallingCode; 

    let operatorName = null;
    if (process.env.USE_THIRD_PARTY === 'true') {
      operatorName = await getOperator(phoneNumber.number);
    }

    return res.json({
      valid: true,
      countryCode,
      countryCallingCode,
      countryName: getCountryNameFromCode(countryCode),
      operatorName,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false, error: 'Server error' });
  }
});

function getCountryNameFromCode(code) {
  try {
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
      default: 'N/A'
    };
    return map[code] || code;
  } catch {
    return code;
  }
}

app.get('/', (req, res) => res.send('Mobile Validation Microservice is running'));

app.listen(PORT, () => {
  console.log(`Mobile validation microservice listening on port ${PORT}`);
});

module.exports = app;