/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const StatusAilment = require('./statusAilment');

class FreezeStatusAilment extends StatusAilment {
  whenInflicted(pokemon, log) {
    return log.message(pokemon.trainerAndName() + " was frozen solid!");
  }

  canAttack(pokemon, log) {
    if (Math.random() < 0.20) {
      log.message(pokemon.trainerAndName() + " thawed out!");
      pokemon.ailment = null;
      return true;
      
    } else {
      log.message(pokemon.trainerAndName() + " is frozen solid!");
      return false;
    }
  }

  battleMultiplier(chance) { return 1 + ((0.5 * chance) / 100); }
}

module.exports = FreezeStatusAilment;