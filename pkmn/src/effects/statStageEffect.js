/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class StatStageEffect extends DefaultEffect {
  target(attacker, defender) {
    switch (this.id) {
      case 139: case 140: case 141: case 205: case 219: case 230: case 277: case 296: case 335: return attacker;
      case 21: case 69: case 70: case 71: case 72: case 73: case 272: case 297: case 331: return defender;
    }
  }
    
  stats() {
    switch  (this.id) {
      case 69: return { attack: -1 };
      case 70: return { defense: -1 };
      case 72: return { spattack: -1 };
      case 73: return { spdefense: -1 };
      case 21: case 71: case 331: return { speed: -1 };
      
      case 140: return { attack: 1 };
      case 139: return { defense: 1 };
      case 277: return { spattack: 1 };
      case 219: case 296: return { speed: 1 };
      
      case 205: return { spattack: -2 };
      case 272: case 297: return { spdefense: -2 };
      case 230: return { defense: -1, spdefense: -1 };
      case 335: return { defense: -1, spdefense: -1, speed: -1 };
      case 141: return { attack: 1, defense: 1, spattack: 1, spdefense: 1, speed: 1 };
    }
  }
    
  buildMultiplier(attacker) {
    const totalChanges = ((() => {
      const result = [];
      const object = this.stats();
      for (var stat in object) {
        var change = object[stat];
        result.push(change);
      }
      return result;
    })()).reduce((x, y) => x+y);
    if (this.target(true, false)) {
      // If targets self
      return 1 + ((0.25 * totalChanges * this.chance) / 100);
    } else {
      // If targets enemy
      return 1 - ((0.25 * totalChanges * this.chance) / 100);
    }
  }
      
  battleMultiplier(attacker, defender, damage, lethal) { return this.buildMultiplier(attacker); }
  
  afterDamage(attacker, defender, damage, log) {
    const target = this.target(attacker, defender);
    if (((Math.random() * 100) < this.chance) && target.isAlive()) {
      return (() => {
        const result = [];
        const object = this.stats();
        for (var stat in object) {
          var change = object[stat];
          result.push(target.modifyStatStage(stat, change, log));
        }
        return result;
      })();
    }
  }
}

  
module.exports = StatStageEffect;
