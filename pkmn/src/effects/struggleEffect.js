const RecoilEffect = require('./recoilEffect');

class StruggleEffect extends RecoilEffect {
  recoil(damage, pokemon) { return Math.round(pokemon.maxHp / 4); }
  
  effectiveness(effectiveness, attacker, defender) { return 1; }
}

module.exports = StruggleEffect;
