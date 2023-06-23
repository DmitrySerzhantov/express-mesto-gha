function validatorEmail(v) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(v);
}

module.exports = {
  validatorEmail,
};
