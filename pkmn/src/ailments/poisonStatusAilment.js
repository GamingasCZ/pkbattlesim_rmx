/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const StatusAilment = require('./statusAilment');

class PoisonStatusAilment extends StatusAilment {
  constructor() {
    super()
    this.multiplier = 1/8;
  }

  affects(pokemon) {
    const types = (Array.from(pokemon.types).map((type) => type.name));
    return (!Array.from(types).includes('Poison')) && (!Array.from(types).includes('Steel'));
  }
  
  whenInflicted(pokemon, log) {
    return log.message(pokemon.trainerAndName() + " was poisoned!");
  }

  endTurn(pokemon, log) {
    return pokemon.takeDamage(Math.round(pokemon.maxHp * this.multiplier), "%(pokemon) was hurt %(damage) by poison!", log);
  }

  battleMultiplier(chance) { return 1 + ((0.4 * chance) / 100); }
}

module.exports = PoisonStatusAilment;
