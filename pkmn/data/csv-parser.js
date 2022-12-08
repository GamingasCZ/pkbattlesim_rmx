/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const csv = require('csv');
const fs = require('fs');

const path = process.argv[2] != null ? process.argv[2] : __dirname + '/pokedex/pokedex/data/csv';
const options = { delimiter: ',', escape: '"', columns: true };

const language = '9';
const version_group = '15';

const write_json = (filename, object) => fs.writeFile(__dirname + '/' + filename, JSON.stringify(object, null, 2));

Array.prototype.unique = function() {
  let key;
  let asc, end;
  const output = {};
  for (key = 0, end = this.length, asc = 0 <= end; asc ? key < end : key > end; asc ? key++ : key--) { output[this[key]] = this[key]; }
  return (() => {
    const result = [];
    for (key in output) {
      var value = output[key];
      result.push(value);
    }
    return result;
  })();
};

fs.exists(path, function(exists) {
  if (exists) {
    // Pokemon
    csv()
    .from.path(path + "/pokemon.csv", options)
    .to.array(function(rows) {
      let row;
      const pokemons = {};
      for (row of Array.from(rows)) {
        if (row.is_default === '1') {
          pokemons[row.id] = {
            id: +row.id,
            name: '',
            types: [],
            stats: {},
            moves: [],
            weight: +row.weight,
            height: +row.height,
          };
        }
      }
      
      return csv()
      .from.path(path + "/pokemon_species_names.csv", options)
      .to.array(function(rows) {
        for (row of Array.from(rows)) {
          if (row.local_language_id === language) {
            pokemons[row.pokemon_species_id].name = row.name;
          }
        }
            
        return csv()
        .from.path(path + "/pokemon_types.csv", options)
        .to.array(function(rows) {
          for (row of Array.from(rows)) {
            if (pokemons[row.pokemon_id]) { pokemons[row.pokemon_id].types.push(+row.type_id); }
          }

          return csv()
          .from.path(path + "/pokemon_stats.csv", options)
          .to.array(function(rows) {
            const stats = { 1: 'hp', 2: 'attack', 3: 'defense', 4: 'spattack', 5: 'spdefense', 6: 'speed' };
            for (row of Array.from(rows)) {
              if (pokemons[row.pokemon_id]) { pokemons[row.pokemon_id].stats[stats[row.stat_id]] = +row.base_stat; }
            }
            
            return csv()
            .from.path(path + "/pokemon_moves.csv", options)
            .to.array(function(rows) {
              for (row of Array.from(rows)) {
                var middle;
                if ((row.version_group_id === version_group) && (+row.pokemon_move_method_id < (middle = 5 +row.move_id) && middle < 10000)) {
                  if (pokemons[row.pokemon_id]) { pokemons[row.pokemon_id].moves.push(+row.move_id); }
                }
              }
              
              return csv()
              .from.path(path + "/pokemon_species.csv", options)
              .to.array(function(rows) {
                const evolutions = {};
                for (row of Array.from(rows)) {
                  evolutions[row.id] = {
                    id: +row.id,
                    chain: +row.evolution_chain_id,
                    preevolution: +row.evolves_from_species_id,
                  };
                }
                
                return csv()
                .from.path(path + "/evolution_chains.csv", options)
                .to.array(function(rows) {
                  for (row of Array.from(rows)) {
                    var chain = ((() => {
                      const result = [];
                      for (var id in evolutions) {
                        var evolution = evolutions[id];
                        if (evolution.chain === +row.id) {
                          result.push(evolution);
                        }
                      }
                      return result;
                    })());
                    chain.sort(function(a,b) {
                      switch (false) {
                        case (a.preevolution !== 0) && (b.preevolution !== a.id): return -1;
                        case (b.preevolution !== 0) && (a.preevolution !== b.id): return 1;
                        default: return 0;
                      }
                    });
                    
                    for (var link of Array.from(chain)) {
                      if (link.preevolution !== 0) { pokemons[link.id].moves = pokemons[link.id].moves.concat(pokemons[link.preevolution].moves); }
                      pokemons[link.id].moves = pokemons[link.id].moves.unique();
                    }
                  }
                    
                  return write_json('pokemon.json', pokemons);
                });
              });
            });
          });
        });
      });
    });
    
    
    // Moves
    csv()
    .from.path(path + "/moves.csv", options)
    .to.array(function(rows) {
      let row;
      const moves = {};
      const damages = { 1: 'non-damaging', 2:'physical', 3:'special' };
      for (row of Array.from(rows)) {
        if ((row.id < 10000) && (+row.effect_id < 10000)) {
          moves[row.id] = {
            id: +row.id,
            name: '',
            type: +row.type_id,
            power: +row.power,
            accuracy: +row.accuracy,
            pp: +row.pp,
            priority: +row.priority,
            damage_class: damages[+row.damage_class_id],
            effect: +row.effect_id,
            effect_chance: +row.effect_chance,
          };
        }
      }
      
      return csv()
      .from.path(path + "/move_names.csv", options)
      .to.array(function(rows) {
        for (row of Array.from(rows)) {
          if (row.local_language_id === language) {
            if (moves[row.move_id] != null) { moves[row.move_id].name = row.name; }
          }
        }
      
        return write_json('moves.json', moves);
      });
    });
       
    // Types
    return csv()
    .from.path(path + "/type_names.csv", options)
    .to.array(function(rows) {
      let row;
      const types = {};
      for (row of Array.from(rows)) {
        if ((row.local_language_id === language) && (row.type_id < 10000)) {
          types[row.type_id] = {
            id: +row.type_id,
            name: row.name,
            offense: {},
            defense: {},
          };
        }
      }
      
      return csv()
      .from.path(path + "/type_efficacy.csv", options)
      .to.array(function(rows) {
        for (row of Array.from(rows)) {
          types[row.damage_type_id].offense[row.target_type_id] = row.damage_factor / 100;
          types[row.target_type_id].defense[row.damage_type_id] = row.damage_factor / 100;
        }
          
        return write_json('types.json', types);
      });
    });
    
  } else {
    return console.log("Usage: coffe " + process.argv[1] + " path/to/csvs\n");
  }
});
