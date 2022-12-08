/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const StatusAilment = require('./statusAilment');

class BurnStatusAilment extends StatusAilment {
  affects(pokemon) {
  	let needle;
  	return (needle = 'Fire', !Array.from((Array.from(pokemon.types).map((type) => type.name))).includes(needle));
}
  
  whenInflicted(pokemon, log) {
    return log.message(pokemon.trainerAndName() + " was burned!");
  }

  endTurn(pokemon, log) {
    return pokemon.takeDamage(Math.round(pokemon.maxHp / 8), "%(pokemon) was hurt %(damage) by its burn!", log);
  }

  statMultiplier(stat) {
    switch (stat) {
      case 'attack': return 0.5;
      default: return 1;
    }
  }

  battleMultiplier(chance) { return 1 + ((0.5 * chance) / 100); }
}

module.exports = BurnStatusAilment;