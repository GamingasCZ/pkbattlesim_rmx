/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class HealEffect extends DefaultEffect {
  heal(damage) {
    switch (this.id) {
      case 4: case 348: return Math.round(damage * 0.5);
      case 353: return Math.round(damage * 0.75);
    }
  }

  buildMultiplier(attacker) {
    switch (this.id) {
      case 4: case 348: return 1.25;
      case 353: return 1.5;
    }
  }
  
  battleMultiplier(attacker, defender, damage, lethal) {
    if (attacker.hp < attacker.maxHp) {
        return 1 + (this.heal(damage) / (attacker.maxHp - attacker.hp) / 1.5);
    } else {
        return 1;
      }
  }
  
  afterDamage(attacker, defender, damage, log) {
    const heal = Math.min((this.heal(damage)), attacker.maxHp - attacker.hp);
    if (heal === 0) { return; }
    
    attacker.hp += heal;
    return log.message(attacker.trainerAndName() + " healed " +  heal + " HP (" + Math.round((heal / attacker.maxHp) * 100) + "%)!");
  }
}


module.exports = HealEffect;
