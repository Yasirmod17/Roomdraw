var register_team = require('./register.routes'),
		users = require('./users.routes'),
		keepAlive = require('./keep-alive.routes');

module.exports = function(app, config) {
  register_team(app, config);
  users(app, config);
  keepAlive(app, config);
};
