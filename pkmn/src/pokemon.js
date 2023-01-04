/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const fs = require('fs');
const Type = require('./type');
const Move = require('./move');
const Strategy = require('./strategy');

class Pokemon {
  static initClass() {
    this.pokedex = JSON.parse(fs.readFileSync(__dirname + '/../data/pokemon.json').toString());
  }

  constructor(id) {
    const pokemon = this.constructor.pokedex[id];
    if (pokemon == null) { throw new Error("Pokemon not found: " + id); }
    
    this.name = pokemon.name;
    this.id = id;
    this.types = (Array.from(pokemon.types).map((typeId) => new Type(typeId)));
    this.weight = pokemon.weight / 10;
    this.height = pokemon.height / 10;
    
    this.stats = {
        base: pokemon.stats,
        stage: {
            attack: 0,
            defense: 0,
            spattack: 0,
            spdefense: 0,
            speed: 0,
        },
    };
    
    this.maxHp = 141 + (2 * pokemon.stats.hp);
    this.hp = this.maxHp;

    this.conditions = {};
    this.ailment = null;
    
    this.faintObservers = [];
    this.strategy = new Strategy(this);
    this.moves = this.strategy.chooseBuild((Array.from(pokemon.moves).map((moveId) => new Move(moveId))));
  }
  
  trainerAndName() {
    if ((this.trainer.name == null)) {
      return "your " + this.name;
    } else {
      return this.trainer.name + "'s " + this.name;
    }
  }
  
  attack() { return this.stat('attack'); }
  defense() { return this.stat('defense'); }
  spattack() { return this.stat('spattack'); }
  spdefense() { return this.stat('spdefense'); }
  speed() { return this.stat('speed'); }
  
  chooseMove(defender) {
    return this.move = this.strategy.chooseMove(defender);
  }

  takeDamage(damage, message, log) {
    if (damage > this.hp) { damage = this.hp; }
    this.hp -= damage;

    message = message.replace('%(pokemon)', this.trainerAndName());
    message = message.replace('%(damage)', damage + " HP (" + Math.round((damage / this.maxHp) * 100) + "%)");
    log.message(message);

    if (!this.isAlive()) {
      for (var observer of Array.from(this.faintObservers)) { observer.notifyFaint(this); }
    }

    return damage;
  }

  isAlive() { return this.hp > 0; }

  subscribeToFaint(observer) {
    return this.faintObservers.push(observer);
  }

  stat(stat, options) {
    if (options == null) { options = {}; }
    if (options.ingorePositive == null) { options.ingorePositive = false; }
    if (options.ingoreNegative == null) { options.ingoreNegative = false; }
  
    let stageMultiplier = this.statStageMultiplier(this.stats.stage[stat]);
    if ((stageMultiplier > 1) && options.ingorePositive) { stageMultiplier = 1; }
    if ((stageMultiplier < 1) && options.ingoreNegative) { stageMultiplier = 1; }

    let ailmentMultiplier = 1;
    if (this.ailment != null) { ailmentMultiplier = this.ailment.statMultiplier(stat); }

    return 36 + (2 * this.stats.base[stat] * stageMultiplier * ailmentMultiplier);
  }
    
  statStageMultiplier(stage) {
    switch (stage) {
      case -6: return 2/8;
      case -5: return 2/7;
      case -4: return 2/6;
      case -3: return 2/5;
      case -2: return 2/4;
      case -1: return 2/3;
      case 0: return 1;
      case 1: return 1.5;
      case 2: return 2;
      case 3: return 2.5;
      case 4: return 3;
      case 5: return 3.5;
      case 6: return 4;
    }
  }
  
  statName(stat) {
    switch (stat) {
      case 'attack': return 'Attack';
      case 'defense': return 'Defense';
      case 'spattack': return 'Special Attack';
      case 'spdefense': return 'Special Defense';
      case 'speed': return 'Speed';
    }
  }
  
  modifyStatStage(stat, change, log) {
    const statName = this.statName(stat);
    switch (false) {
      case (this.stats.stage[stat] !== 6) || !(change > 0):
        return log.message(this.trainerAndName()("'s " + statName + " cannot rise any higher."));
      case (this.stats.stage[stat] !== -6) || !(change < 0):
        return log.message(this.trainerAndName()("'s " + statName + " cannot fall any lower."));
      default:
        if ((this.stats.stage[stat] + change) > 6) { change = 6 - this.stats.stage[stat]; }
        if ((this.stats.stage[stat] + change) < -6) { change = -6 - this.stats.stage[stat]; }
        this.stats.stage[stat] += change;
        switch (change) {
          case 1: return log.message(this.trainerAndName() + "'s " + statName + " rose!");
          case 2: return log.message(this.trainerAndName() + "'s " + statName + " sharply rose!");
          case 3: return log.message(this.trainerAndName() + "'s " + statName + " drastically rose!");
          case -1: return log.message(this.trainerAndName() + "'s " + statName + " fell!");
          case -2: return log.message(this.trainerAndName() + "'s " + statName + " harshly fell!");
          case -3: return log.message(this.trainerAndName() + "'s " + statName + " severely fell!");
        }
    }
  }
  
  typeAdvantageAgainst(pokemon) {
    return ((() => {
      const result = [];
       for (var type of Array.from(this.types)) {         if (type.effectiveAgainst(pokemon.types)) {
          result.push(type);
        }
      } 
      return result;
    })()).length > 0;
  }
  
  canAttack(log) {
    if ((this.ailment != null) && !this.ailment.canAttack(this, log)) {
      return false; 
    }

    for (var _ in this.conditions) {
      var condition = this.conditions[_];
      if (!condition.canAttack(this, log)) { return false; }
    }

    return true;
  }

  whenSwitchedOut() { 
    this.move = null;
    if (this.ailment) { this.ailment.whenSwitchedOut(this); }
    return this.conditions = {};
  }

  endTurn(log) {
    if (this.ailment != null) { this.ailment.endTurn(this, log); }

    return (() => {
      const result = [];
      for (var _ in this.conditions) {
        var condition = this.conditions[_];
        result.push(condition.endTurn(this, log));
      }
      return result;
    })();
  }

  toString() {
    return this.name;
  }
}
Pokemon.initClass();
    
    
module.exports = Pokemon;
