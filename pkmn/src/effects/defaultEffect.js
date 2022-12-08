class DefaultEffect {
  constructor(id, chance) {
    this.id = id;
    this.chance = chance;
  }
  
  power(base) { return base; }
  effectiveness(effectiveness, attacker, defender) { return effectiveness; }
  
  hits() { return 1; }
  criticalRateStage() { return 0; }
  
  buildMultiplier(attacker) { return 1; }
  battleMultiplier(attacker, defender, damage, lethal) { return 1; }
  
  afterDamage(attacker, defender, damage, log) {}
  afterMiss(attacker, defender, log) {}
  
  banned() { return false; }
  fullSupport() { return this.constructor.name !== 'DefaultEffect'; }
}

module.exports = DefaultEffect;
