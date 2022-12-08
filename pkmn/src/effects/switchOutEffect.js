/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class SwitchOutEffect extends DefaultEffect {
  battleMultiplier(attacker, defender, damage, lethal) {
    const hasOtherPokemon = attacker.trainer.ablePokemon().length > 1;
    if ((defender.typeAdvantageAgainst(attacker)) && (attacker.speed() > defender.speed()) && hasOtherPokemon) { return 2; } else { return 1; }
  }
  
  afterDamage(attacker, defender, damage, log) {
    const {
      trainer
    } = attacker;
    if (trainer.ablePokemon().length > 1) {
      return trainer.switchPokemon(defender, log);
    }
  }
}

  
module.exports = SwitchOutEffect;
