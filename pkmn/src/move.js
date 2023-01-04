/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const fs = require('fs');
const Type = require('./type');
const Effect = require('./effect');

class Move {
  static initClass() {
    this.DAMAGE_NONE = 'non-damaging';
    this.DAMAGE_PHYSICAL = 'physical';
    this.DAMAGE_SPECIAL = 'special';
    
    this.movedex = JSON.parse(fs.readFileSync(__dirname + '/../data/moves.json').toString());
    
    this.Struggle = new (this)(165);
  }
  
  constructor(id) {
    const move = this.constructor.movedex[id];
    if (move == null) { throw new Error("Move not found: " + id); }
    
    this.id = move.id;
    this.name = move.name;
    this.type = new Type(move.type);
    this.basePower = move.power;
    this.accuracy = move.accuracy > 0 ? move.accuracy : 100;
    this.priority = move.priority;
    this.effect = Effect.make(move.effect, move.effect_chance);
    this.damageClass = move.damage_class;
    this.pp = move.pp;
  }
  
  banned() {
    return (this.damageClass === this.constructor.DAMAGE_NONE) || this.effect.banned() || (this.power() < 2);
  }
  
  attackStat() { if (this.damageClass === this.constructor.DAMAGE_PHYSICAL) { return 'attack'; } else { return 'spattack'; } }
  defenseStat() { if (this.damageClass === this.constructor.DAMAGE_PHYSICAL) { return 'defense'; } else { return 'spdefense'; } }
  
  buildMultiplier(attacker) {
    let base = this.effect.buildMultiplier(attacker);
    
    if (this.priority > 0) { base *= 1.33; }
    if (this.priority < 0) { base *= 0.9; }
    
    return base;
  }
  
  battleMultiplier(attacker, defender, damage) {
    const lethal = damage >= defender.hp;
  
    let base = this.accuracy / 100;
    if ((this.priority > 0) && lethal) {
      base *= 5;
    }
      
    base *= this.effect.battleMultiplier(attacker, defender, damage, lethal);
    
    return base;
  }
  
  effectiveness(attacker, defender) {
    const effectiveness = this.type.effectivenessAgainst(defender.types);
    return this.effect.effectiveness(effectiveness, attacker, defender);
  }
  
  power(attacker, defender) {
    return this.effect.power(this.basePower, attacker, defender);
  }
  
  hits() {
    return this.effect.hits();
  }
  
  criticalRateStage() {
    return this.effect.criticalRateStage();
  }
  
  afterDamage(attacker, defender, damage, log) {
    return this.effect.afterDamage(attacker, defender, damage, log);
  }
    
  afterMiss(attacker, defender, log) {
    return this.effect.afterMiss(attacker, defender, log);
  }

  toString() {
    return this.name + " (" + this.type.name + " - " + (this.basePower === 1 ? 'X' : this.basePower) + " power - " + this.accuracy + " accuracy)";
  }
}
Move.initClass();


module.exports = Move;
