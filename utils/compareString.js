const { timingSafeEqual } = require('crypto');

const compareString = async (a, b) => {
  try {
    return timingSafeEqual(Buffer.from(a, 'utf-8'), Buffer.from(b, 'utf-8'));
  } catch {
    return false;
  }
};

module.exports = compareString;
