/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Trainer {
  constructor(name) {
    this.name = name;
    this.team = [];
  }
  
  addPokemon(pokemon) {
    pokemon.trainer = this;
    return this.team.push(pokemon);
  }
  
  ablePokemon() {
    return (() => {
      const result = [];
      for (var pokemon of Array.from(this.team)) {         if (pokemon.isAlive()) {
          result.push(pokemon);
        }
      }
      return result;
    })();
  }
  
  firstPokemon() {
    return this.mainPokemon = this.team[0];
  }
  
  maybeSwitchOut(own, opponent, log) {
    // 67% chance to not switch out
    if (Math.random() < 0.67) {
      return own;
    }
    
    // Only switch out against pokemon strong against you
    if (!opponent.typeAdvantageAgainst(own)) {
      return own;
    }
    
    // Also make sure you have at least a neutral alternative
    if (!(((() => {
      const result = [];
      for (var pokemon of Array.from(this.ablePokemon())) {         if (!opponent.typeAdvantageAgainst(pokemon)) {
          result.push(pokemon);
        }
      }
      return result;
    })()).length > 0)) {
      return own;
    }

    log.message(this.nameOrYou() + " withdrew " + own + ".");
    this.switchPokemon(opponent, log);

    return this.mainPokemon;
  }
  
  switchPokemon(opponent, log) {
    // Reset current pokemon's stats
    let pokemon;
    this.mainPokemon.stats.stage = {
      attack: 0,
      defense: 0,
      spattack: 0,
      spdefense: 0,
      speed: 0,
    };
  
    //TODO Maybe consider fast pokemon against low-HP pokemon?
    const candidates = ((() => {
      const result = [];
      for (pokemon of Array.from(this.ablePokemon())) {         if (pokemon !== this.mainPokemon) {
          result.push(pokemon);
        }
      }
      return result;
    })());
    let maxScore = -1;
    
    for (pokemon of Array.from(candidates)) {
      pokemon.score = 0;
      
      if (pokemon.typeAdvantageAgainst(opponent)) {
        pokemon.score += 1;
      }
      
      if (opponent.typeAdvantageAgainst(pokemon)) {
        pokemon.score -= 1;
      }
        
      if (pokemon.score > maxScore) {
        maxScore = pokemon.score;
      }
    }
    
    const bestChoices = ((() => {
      const result1 = [];
      for (pokemon of Array.from(candidates)) {         if (pokemon.score === maxScore) {
          result1.push(pokemon);
        }
      }
      return result1;
    })());
    this.mainPokemon = bestChoices[Math.floor(Math.random() * bestChoices.length)];
    if (this.mainPokemon != null) { this.mainPokemon.whenSwitchedOut(); }
    
    log.message(this.nameOrYou() + " took out " + this.mainPokemon + ".");
    return this.mainPokemon;
  }
  
  nameOrYou() { if (this.name != null) { return this.name; } else { return 'you'; } }
}


module.exports = Trainer;
