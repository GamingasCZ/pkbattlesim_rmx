/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class StatusAilment {
  inflict(pokemon, log) {
    const key = this.constructor.name;
    pokemon.conditions[key] = this;
    return this.whenInflicted(pokemon, log);
  }

  isInflicted(pokemon) {
    const key = this.constructor.name;
    return (pokemon.conditions[key] != null);
  }

  heal(pokemon) {
    const key = this.constructor.name;
    return delete pokemon.conditions[key];
  }

  whenInflicted(pokemon, log) {}
  canAttack(pokemon, log) { return true; }
  endTurn(pokemon, log) {}

  buildMultiplier(attacker, chance) { return 1; }
  battleMultiplier(attacker, defender, chance) { return 1; }
}

module.exports = StatusAilment;