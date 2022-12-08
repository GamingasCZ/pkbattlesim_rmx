/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class DamageCalculator {
  calculate(move, attacker, defender, critical, random) {
    let needle;
    if (critical == null) { critical = false; }
    if (random == null) { random = 0.9; }
    const attack = attacker.stat(move.attackStat(), {ingoreNegative: critical});
    const defense = defender.stat(move.defenseStat(), {ingorePositive: critical});
    
    const stab = (needle = move.type.id, Array.from((attacker.types.map(type => type.id))).includes(needle)) ? 1.5 : 1;
    const type = move.effectiveness(attacker, defender);
    const crit = critical ? 1.5 : 1;
    
    return this.formula(move.power(attacker, defender), attack, defense, stab * type * crit * random);
  }

  confusionDamage(pokemon) {
    const attack = pokemon.stat('attack');
    const defense = pokemon.stat('defense');
    const random = (Math.random() * (1 - 0.85)) + 0.85;

    return this.formula(40, attack, defense, random);
  }

  formula(power, attack, defense, multipliers) {
    return Math.round(((0.88 * (attack / defense) * power) + 2 ) * multipliers);
  }
}


module.exports = DamageCalculator;
