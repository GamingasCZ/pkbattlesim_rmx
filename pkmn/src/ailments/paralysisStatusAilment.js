/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const StatusAilment = require('./statusAilment');

class ParalysisStatusAilment extends StatusAilment {
  affects(pokemon) {
    let needle;
    return (needle = 'Electric', !Array.from((Array.from(pokemon.types).map((type) => type.name))).includes(needle));
  }
  
  whenInflicted(pokemon, log) {
    return log.message(pokemon.trainerAndName() + " was paralyzed! It may be unable to move!");
  }

  canAttack(pokemon, log) {
    if (Math.random() < 0.25) {
      log.message(pokemon.trainerAndName() + " is paralyzed! It can't move!");
      return false;
    }
  }

  statMultiplier(stat) {
    switch (stat) {
      case 'speed': return 0.25;
      default: return 1;
    }
  }

  // This makes Discharge slightly worse than Thunderbolt
  battleMultiplier(chance) { return 1 + ((0.5 * chance) / 100); }
}

module.exports = ParalysisStatusAilment;