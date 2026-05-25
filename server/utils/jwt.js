const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'braj_dham_divine_sec_108_key_gopala_radhe', {
    expiresIn: '30d'
  });
};

module.exports = { generateToken };
