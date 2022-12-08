/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class MultiHitEffect extends DefaultEffect {
  hits() {
    switch (this.id) {
      case 30: return [2,2,3,3,4,5][Math.floor(Math.random() * 6)];
      case 45: case 78: return 2;
    }
  }

  buildMultiplier(attacker) {
    switch (this.id) {
      case 30: return 3.166;
      case 45: case 78: return 2;
    }
  }
  
  battleMultiplier(attacker, defender, damage, lethal) {
    if (!lethal) {  
      switch (this.id) {
        case 30: return 3.166;
        case 45: case 78: return 2;
      }
    } else {
      return 1;
    }
  }
}
      

module.exports = MultiHitEffect;
