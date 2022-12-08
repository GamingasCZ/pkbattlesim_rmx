/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');
const FlinchCondition = require('../conditions/flinchCondition');
const ConfusionCondition = require('../conditions/confusionCondition');

class ConditionEffect extends DefaultEffect {
  condition() {
    switch (this.id) {
      case 32: case 147: case 151: case 274: case 275: case 276: return new FlinchCondition;
      case 77: case 268: case 338: return new ConfusionCondition;
    }
  }

  buildMultiplier(attacker) {
    const condition = this.condition();
    return condition.buildMultiplier(attacker, this.chance); 
  }
  
  battleMultiplier(attacker, defender, damage, lethal) {
    const condition = this.condition();
    if (!condition.isInflicted(defender)) {
      return condition.battleMultiplier(attacker, defender, this.chance);
    } else {
      return 1;
    }
  }
  
  afterDamage(attacker, defender, damage, log) {
    if (!defender.isAlive()) { return; }

    const condition = this.condition();
    if (!condition.isInflicted(defender) && ((Math.random() * 100) < this.chance)) {
      return condition.inflict(defender);
    }
  }
}

module.exports = ConditionEffect;
