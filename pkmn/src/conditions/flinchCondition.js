/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Condition = require('./condition');

class FlinchCondition extends Condition {
  endTurn(pokemon, log) {
    return this.heal(pokemon);
  }

  canAttack(pokemon, log) {
    log.message(pokemon.trainerAndName() + " flinched and couldn't move!");
    return false;
  }

  buildMultiplier(attacker, chance) {
    if (attacker.stats.base.speed >= 80) {
      return 1 + ((0.2 * chance) / 30);
    } else {
      return 1;
    }
  }

  battleMultiplier(attacker, defender, chance) {
    if (attacker.speed() > defender.speed()) {
      return 1 + ((0.2 * chance) / 30);
    } else {
      return 1;
    }
  }
}

module.exports = FlinchCondition;