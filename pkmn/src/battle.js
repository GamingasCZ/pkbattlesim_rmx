/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Type = require('./type');
const Move = require('./move');
const Pokemon = require('./pokemon');
const Log = require('./log');
const DamageCalculator = require('./damageCalculator');

class Battle {
  constructor(trainer1, trainer2) {
    let pokemon;
    this.trainer1 = trainer1;
    this.trainer2 = trainer2;
    this.damageCalculator = new DamageCalculator;

    this.trainer1.firstPokemon();
    this.trainer2.firstPokemon();

    for (pokemon of Array.from(this.trainer1.team)) {
      pokemon.subscribeToFaint(this);
    }
  
    for (pokemon of Array.from(this.trainer2.team)) {
      pokemon.subscribeToFaint(this);
    }
  }

  start() {
    this.log = new Log;
    this.winner = null;
    while (this.winner == null) {
      this.nextTurn();
    }
    
    const loser = this.winner === this.trainer1 ? this.trainer2 : this.trainer1;
    this.log.message(this.winner.nameOrYou() + " defeated " + loser.nameOrYou() + "!");
    for (var pokemon of Array.from(this.winner.team)) {
      this.log.message(pokemon.name + ": " + pokemon.hp + " HP (" + Math.round((pokemon.hp / pokemon.maxHp) * 100) + "%) left.");
    }

    return this.log;
  }
  
  nextTurn() {
    let attacker, defender, pkmn1GoesFirst;
    let pokemon1 = this.trainer1.mainPokemon;
    let pokemon2 = this.trainer2.mainPokemon;

    // Choose moves
    pokemon1.chooseMove(pokemon2);
    pokemon2.chooseMove(pokemon1);
    if ((pokemon1.move == null) || (pokemon2.move == null)) { throw new Error("One of the pokemon doesn't have an attack move."); }
    
    // Switch out pokemon?
    const newPokemon1 = pokemon1.trainer.maybeSwitchOut(pokemon1, pokemon2, this.log);
    const newPokemon2 = pokemon2.trainer.maybeSwitchOut(pokemon2, pokemon1, this.log);
    pokemon1 = newPokemon1;
    pokemon2 = newPokemon2;

    // Decide who goes first
    if ((pokemon1.move == null) || (pokemon2.move == null)) {
      pkmn1GoesFirst = true;
    } else if (pokemon1.move.priority === pokemon2.move.priority) {
      pkmn1GoesFirst = (pokemon1.speed() > pokemon2.speed()) || ((pokemon1.speed() === pokemon2.speed()) && (Math.random() < 0.5));
    } else {
      pkmn1GoesFirst = pokemon1.move.priority > pokemon2.move.priority;
    }

    if (pkmn1GoesFirst) {
      attacker = pokemon1;
      defender = pokemon2;
    } else {
      attacker = pokemon2;
      defender = pokemon1;
    }
    
    // Perform the attacks
    if (attacker.move != null) { this.doAttack(attacker, defender); }
    
    attacker = attacker.trainer.mainPokemon; // Moves like U-turn can force a switch
    defender = defender.trainer.mainPokemon; // Defending pokemon could have fainted
    
    if ((defender.move != null) && !this.winner) { this.doAttack(defender, attacker); }

    if (attacker.isAlive() && !this.winner) { attacker.endTurn(this.log); }
    if (defender.isAlive() && !this.winner) { defender.endTurn(this.log); }

    return this.log.endTurn();
  }
  
  doAttack(attacker, defender) {
    if (attacker.canAttack(this.log)) {
      this.log.message(attacker.trainerAndName() + " used " + attacker.move.name + "!");
      const effectiveness = attacker.move.effectiveness(attacker, defender);
      let miss = false;

      if (effectiveness === 0) {
        this.log.message("It doesn't affect " + defender.trainerAndName() + "...");
        miss = true;

      } else {
        if ((Math.random() * 100) > attacker.move.accuracy) {
          this.log.message(attacker.trainerAndName() + "'s attack missed!");
          miss = true;
        
        } else {
          const hits = attacker.move.hits();
          let hit = 0;
          miss = false;
          
          this.stopMultiHit = false;
          while ((hit++ !== hits) && !this.stopMultiHit) {
            var critical = Math.random() < this.criticalChance(attacker.move.criticalRateStage());
            var random = (Math.random() * (1 - 0.85)) + 0.85;

            if (critical) { this.log.message("It's a critical hit!"); }
            if (effectiveness > 1) { this.log.message("It's super effective!"); }
            if (effectiveness < 1) { this.log.message("It's not very effective..."); }
            
            var damage = this.damageCalculator.calculate(attacker.move, attacker, defender, critical, random);
            defender.takeDamage(damage, "%(pokemon) was hit for %(damage)", this.log);
            
            attacker.move.afterDamage(attacker, defender, damage, this.log);
          }
        }
      }
            
      if (miss) {
        attacker.move.afterMiss(attacker, defender, this.log);
      }
    }
    
    return this.log.endAttack();
  }
  
  notifyFaint(pokemon) {
    this.log.message(pokemon.trainerAndName() + " fainted!");
    this.stopMultiHit = true;

    const otherTrainer = pokemon.trainer === this.trainer1 ? this.trainer2 : this.trainer1;
    if (pokemon.trainer.ablePokemon().length === 0) {
      if (!this.winner) { this.winner = otherTrainer; }
    }

    if (!this.winner) { return pokemon.trainer.switchPokemon(otherTrainer.mainPokemon, this.log); }
  }
  
  criticalChance(stage) {
    switch (stage) {
      case 0: return 1/16;
      case 1: return 1/8;
      case 2: return 1/2;
      default: return 1;
    }
  }
}
  

module.exports = Battle;
