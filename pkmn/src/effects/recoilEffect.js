/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class RecoilEffect extends DefaultEffect {
  recoil(damage, pokemon) {
    switch (this.id) {
      case 49: return Math.round(damage / 4);
      case 199: case 254: case 263: return Math.round(damage / 3);
      case 270: return Math.round(damage / 2);
      default: return 0;
    }
  }

  buildMultiplier(attacker) {
    switch (this.id) {
      case 49: case 199: case 254: case 263: return 0.85;
      case 270: return 0.5;
    }
  }
  
  battleMultiplier(attacker, defender, damage, lethal) {
    return 1 - (this.recoil(damage, attacker) / attacker.hp / 1.5);
  }
  
  afterDamage(attacker, defender, damage, log) {
    return attacker.takeDamage((this.recoil(damage, attacker)), "%(pokemon) was hurt %(damage) by recoil!", log);
  }
}

  
module.exports = RecoilEffect;
