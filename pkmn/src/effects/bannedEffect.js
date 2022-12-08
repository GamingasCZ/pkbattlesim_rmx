const DefaultEffect = require('./defaultEffect');

class BannedEffect extends DefaultEffect {
  banned() { return true; }
}


module.exports = BannedEffect;
