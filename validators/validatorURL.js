const { regularValidetUrl } = require('../utils/constants');

function validatorURL(v) {
  return regularValidetUrl.test(v);
}

module.exports = {
  validatorURL,
};
