/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PoisonStatusAilment = require('./poisonStatusAilment');

class BadPoisonStatusAilment extends PoisonStatusAilment {
  constructor() {
    super()
    this.multiplier = 1/16;
  }
  
  whenSwitchedOut(pokemon) {
    return this.multiplier = 1/16;
  }

  whenInflicted(pokemon, log) {
    return log.message(pokemon.trainerAndName() + " was badly poisoned!");
  }

  endTurn(pokemon, log) {
    super.endTurn(pokemon, log);
    return this.multiplier += 1 / 16;
  }

  battleMultiplier(chance) { return 1 + ((0.66 * chance) / 100); }
}

module.exports = BadPoisonStatusAilment;
