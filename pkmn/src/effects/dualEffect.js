/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./defaultEffect');

class DualEffect extends DefaultEffect {
  constructor(id, effects) {
    super()
    this.id = id;
    this.effects = effects;
  }

  power(base) { return base; } // No dual-effect attack has this
  effectiveness(attacker, defender) { return this.multiply((Array.from(this.effects).map((effect) => effect.effectiveness(attacker, defender)))); }
  
  hits() { return this.max((Array.from(this.effects).map((effect) => effect.hits()))); }
  criticalRateStage() { return this.max((Array.from(this.effects).map((effect) => effect.criticalRateStage()))); }
  
  buildMultiplier(attacker) { return this.multiply((Array.from(this.effects).map((effect) => effect.buildMultiplier(attacker)))); }
  battleMultiplier(attacker, defender, damage, lethal) { return this.multiply((Array.from(this.effects).map((effect) => effect.battleMultiplier(attacker, defender, damage, lethal)))); }
  
  afterDamage(attacker, defender, damage, log) { return Array.from(this.effects).map((effect) => effect.afterDamage(attacker, defender, damage, log)); }
  afterMiss(attacker, defender, log) { return Array.from(this.effects).map((effect) => effect.afterMiss(attacker, defender, log)); }

  // Aux functions
  max(list) {  return Math.max.apply(null, list); }
  multiply(list) { return list.reduce(((a, b) => a*b), 1); }
}

module.exports = DualEffect;
