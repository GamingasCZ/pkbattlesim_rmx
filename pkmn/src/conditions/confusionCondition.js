/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Condition = require('./condition');
const DamageCalculator = require('../damageCalculator');

class ConfusionCondition extends Condition {
  whenInflicted(pokemon, log) {
    return this.turnsLeft = Math.ceil(Math.random() * 4);
  }

  canAttack(pokemon, log) {
    if (this.turnsLeft === 0) {
      log.message(pokemon.trainerAndName() + " snapped out its confusion!");
      this.heal(pokemon);

    } else {
      log.message(pokemon.trainerAndName() + " is confused!");
      this.turnsLeft--;
      
      if (Math.random() < 0.5) {
        const damageCalculator = new DamageCalculator;
        const damage = damageCalculator.confusionDamage(pokemon);

        pokemon.takeDamage(damage, "It hurn itself %(damage) in its confusion!", log);
        return false;
      }
    }

    return true;
  }

  buildMultiplier(attacker, chance) { return 1 + ((0.4 * chance) / 100); }
  battleMultiplier(attacker, defender, chance) {
    return this.buildMultiplier(attacker, chance);
  }
}

module.exports = ConfusionCondition;