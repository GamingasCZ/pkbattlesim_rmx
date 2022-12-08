/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class CritRateEffect extends DefaultEffect {
  criticalRateStage() {
    switch (this.id) {
      case 44: case 201: case 210: return 1;
      case 289: return 50;
    }
  }

  buildMultiplier(attacker) {
    switch (this.id) {
      case 44: case 201: case 210: return 1.03;
      case 289: return 1.5;
    }
  }
  
  battleMultiplier(attacker, defender, damage, lethal) {
    switch (this.id) {
      case 44: case 201: case 210: return 1.03;
      case 289: return 1.5;
    }
  }
}
  
module.exports = CritRateEffect;
