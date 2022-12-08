/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Pokemon = require('./src/pokemon');
const Trainer = require('./src/trainer');
const Battle = require('./src/battle');

let pokemon = {};

pokemon.lookup = function(name) {
  name = name.toLowerCase();
  switch (false) {
    case name !== 'nidoran f': return 29;
    case name !== 'nidoran m': return 32;
    default: return ((() => {
      const result = [];
      for (var id in Pokemon.pokedex) {
        var pkmn = Pokemon.pokedex[id];
        if (name === pkmn.name.toLowerCase()) {
          result.push(id);
        }
      }
      return result;
    })())[0];
  }
};

pokemon.battle = function(team1, team2) {
  // Standarize input
  if (!(team1 instanceof Object) || team1 instanceof Array) { team1 = { trainer: null,      pokemon: team1 }; }
  if (!(team2 instanceof Object) || team2 instanceof Array) { team2 = { trainer: 'the foe', pokemon: team2 }; }
  
  if (!(team1.pokemon instanceof Array)) { team1.pokemon = [ team1.pokemon ]; }
  if (!(team2.pokemon instanceof Array)) { team2.pokemon = [ team2.pokemon ]; }
  
  // Build trainers
  const trainer1 = new Trainer(team1.trainer);
  for (pokemon of Array.from(team1.pokemon)) { trainer1.addPokemon(new Pokemon(pokemon)); }
  
  const trainer2 = new Trainer(team2.trainer);
  for (pokemon of Array.from(team2.pokemon)) { trainer2.addPokemon(new Pokemon(pokemon)); }

  // Fight!  
  const battle = new Battle(trainer1, trainer2);
  return battle.start().toString();
};
  
pokemon.build = function(pokemonId) {
  pokemon = new Pokemon(pokemonId);
  
  return (Array.from(pokemon.moves).map((move) => move.toString())).join("\n").toString();
};
  
pokemon.buildDebug = function(pokemonId) {
  pokemon = new Pokemon(pokemonId);
  
  return (Array.from(pokemon.debug.scoredMoves).map((move) => move.toString() + " " + move.score)).join("\n").toString();
};
  

module.exports = pokemon;
