/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Type = require('./type');
const Move = require('./move');
const DamageCalculator = require('./damageCalculator');

class Strategy {
  
  constructor(pokemon) {
    let type;
    this.pokemon = pokemon;
    this.helpfulTypes = [];
    for (var weakness of Array.from(((() => {
      const result = [];
      for (type of Array.from(Type.all())) {         if (type.effectiveAgainst(this.pokemon.types)) {
          result.push(type);
        }
      }
      return result;
    })()))) {
      this.helpfulTypes = this.helpfulTypes.concat(((() => {
        const result1 = [];
        for (type of Array.from(Type.all())) {           if (type.effectiveAgainst(weakness)) {
            result1.push(type.id);
          }
        }
        return result1;
      })()));
    }
  }
    

  chooseBuild(moves) {
    // Score each move the pokemon can learn
    let move;
    const scoredMoves = [];
    for (move of Array.from(moves)) {
      if (move.banned()) { continue; }
      this.scoreMoveForBuild(move);
      
      scoredMoves.push(move);
    }
    
    scoredMoves.sort((a, b) => b.score - a.score);
    
    // And keep the best four without repeating types
    let chosenMoves = [];
    const typesCovered = [];
    for (move of Array.from(scoredMoves)) {
      if (!Array.from(typesCovered).includes(move.type.id)) {
        chosenMoves.push(move);
        typesCovered.push(move.type.id);
        if (typesCovered.length === 4) { break; }
      }
    }

    // If no valid move exists, use Struggle
    if (chosenMoves.length === 0) {
      chosenMoves = [ Move.Struggle ];
    }

    return chosenMoves;
  }

  scoreMoveForBuild(move) {
    const typeMultiplier = (() => { let needle;
    switch (false) {
      case (needle = move.type.id, !Array.from((this.pokemon.types.map(type => type.id))).includes(needle)): return 1.5;
      case !Array.from(this.helpfulTypes).includes(move.type.id): return 1.2;
      default: switch (move.type.strengths().length) {
        case 0:case 1:case 2: return 0.9;
        case 3: return 1;
        default: return 1.1;
      }
    } })();
      
    const stat = this.pokemon.stat(move.attackStat());
    return move.score = move.power(this.pokemon) * typeMultiplier * stat * move.accuracy * move.buildMultiplier(this.pokemon);
  }


  chooseMove(defender) {
    let move;
    const damageCalculator = new DamageCalculator;

    let bestMove = null;
    let bestDamage = -1;
    for (move of Array.from(this.pokemon.moves)) {
      var damage = damageCalculator.calculate(move, this.pokemon, defender);
      if (defender.hp < damage) { damage = defender.hp; } 
      
      damage *= move.battleMultiplier(this.pokemon, defender, damage);
      
      if (damage > bestDamage) {
        bestMove = move;
        bestDamage = damage;
      }
    }
    
    return this.pokemon.move = bestMove;
  }
}


module.exports = Strategy;
