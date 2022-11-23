const getCode = () => {
  return process.env.SECRET_STRING;
};

module.exports = getCode;
