/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');
const BurnStatusAilment = require('../ailments/burnStatusAilment');
const ParalysisStatusAilment = require('../ailments/paralysisStatusAilment');
const FreezeStatusAilment = require('../ailments/freezeStatusAilment');
const PoisonStatusAilment = require('../ailments/poisonStatusAilment');
const BadPoisonStatusAilment = require('../ailments/badPoisonStatusAilment');

class StatusAilmentEffect extends DefaultEffect {
  ailment() {
    switch (this.id) {
      case 3: case 78: case 210: return new PoisonStatusAilment;
      case 5: case 201: case 254: case 274: return new BurnStatusAilment;
      case 6: case 261: case 275: return new FreezeStatusAilment;
      case 7: case 153: case 263: case 276: return new ParalysisStatusAilment;
      case 203: return new BadPoisonStatusAilment;
    }
  }

  buildMultiplier(attacker) {
    const ailment = this.ailment();
    return ailment.battleMultiplier(this.chance);
  }
  
  battleMultiplier(attacker, defender, damage, lethal) {
    const ailment = this.ailment();
    if ((defender.ailment == null) && ailment.affects(defender)) {
      return ailment.battleMultiplier(this.chance);
    } else {
      return 1;
    }
  }
  
  afterDamage(attacker, defender, damage, log) {
    // Ailments cannot be overwritten
    if ((defender.ailment != null) || !defender.isAlive()) { return; }

    const ailment = this.ailment();
    if (ailment.affects(defender) && ((Math.random() * 100) < this.chance)) {
      defender.ailment = ailment;
      return ailment.whenInflicted(defender, log);
    }
  }
}

module.exports = StatusAilmentEffect;
