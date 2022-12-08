/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class RecoilOnMissEffect extends DefaultEffect {
  buildMultiplier(attacker) { return 0.9; }
  
  battleMultiplier(attacker, defender, damage, lethal) { return 0.9; }
  
  afterMiss(attacker, defender, log) {
    const recoil = Math.min(Math.floor(attacker.maxHp / 2), attacker.hp);
    
    attacker.hp -= recoil;
    return log.message(attacker.trainerAndName() + " kept going and crashed for " + recoil + " HP (" + Math.round((recoil / attacker.maxHp) * 100) + "%)!");
  }
}


module.exports = RecoilOnMissEffect;
