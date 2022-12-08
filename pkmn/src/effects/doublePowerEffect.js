const DefaultEffect = require('./defaultEffect');

class DoublePowerEffect extends DefaultEffect {
  power(base, attacker, defender) { return base * 2; }
}

module.exports = DoublePowerEffect;
