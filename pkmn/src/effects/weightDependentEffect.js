/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class WeightDependentEffect extends DefaultEffect {
  power(base, attacker, defender) {
    if (defender == null) { return 60; }

    switch (false) {
      case !(defender.weight < 10): return 20;
      case !(defender.weight < 25): return 40;
      case !(defender.weight < 50): return 60;
      case !(defender.weight < 100): return 80;
      case !(defender.weight < 200): return 100;
      default: return 200;
    }
  }
}
 

module.exports = WeightDependentEffect;
