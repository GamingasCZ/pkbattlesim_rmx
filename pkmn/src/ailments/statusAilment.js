class StatusAilment {
  affects(pokemon) { return true; }
  
  whenInflicted(pokemon, log) {}
  whenSwitchedOut(pokemon) {}
  
  canAttack(pokemon, log) { return true; }
  endTurn(pokemon, log) {}

  statMultiplier(stat) { return 1; }
  battleMultiplier(chance) { return 1; }
}

module.exports = StatusAilment;