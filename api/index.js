const app = require('../web-app/server/server.cjs');

module.exports = (req, res) => {
  return app(req, res);
};
