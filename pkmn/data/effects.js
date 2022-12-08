/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const csv = require('csv');
const fs = require('fs');
const Move = require('../src/move');
const Effect = require('../src/effect');


const path = process.argv[2] != null ? process.argv[2] : __dirname +  '/pokedex/pokedex/data/csv';
const options = { delimiter: ',', escape: '"', columns: true };

const printEffect = function(effect) {
  if ((effect.examples.length === 0) || !effect.damages) { return ''; }
  return effect.id + ": " + effect.effect + " (" +  effect.examples.slice(0, 3).join(", ") + (effect.examples.length > 3 ? '...' : '') +  ")  \n";
};

fs.exists(path, function(exists) {
  if (exists) {
    return csv()
    .from.path(path + "/move_effect_prose.csv", options)
    .to.array(function(rows) {
      let effect, id;
      const effects = {};
      for (var row of Array.from(rows)) {
        if (row.move_effect_id < 10000) {
          effects[row.move_effect_id] = {
            id: +row.move_effect_id,
            effect: row.short_effect.replace(/\$effect_chance% /g, '')
                                    .replace(/\[(.*?)\]{.+?:(.+?)}/g, function(match, name, href) { if (name.length > 0) { return name; } else { return href; } }),
            damages: false,
            state: null,
            examples: [],
          };
        }
      }
      
      for (id in Move.movedex) {
        var move = Move.movedex[id];
        effect = Effect.make(move.effect);
        effects[effect.id].state = (() => { switch (false) {
          case !effect.banned(): return 'banned';
          case !effect.fullSupport(): return 'supported';
          default: return 'partly-supported';
        } })();
        
        effects[effect.id].damages = effects[effect.id].damages || (move.damage_class !== 'non-damaging');
        effects[effect.id].examples.push(move.name);
      }
      
      
      let output = '';
      output += "## Supported Effects ##\n";
      output += "The following moves are fully supported.\n\n";
      for (id in effects) {
        effect = effects[id];
        if (effect.state === 'supported') { output += printEffect(effect); }
      }
        
      output += "\n## Partly Supported Effects ##\n";
      output += "The following moves can be used but not all side effects will take place.\n\n";
      for (id in effects) {
        effect = effects[id];
        if (effect.state === 'partly-supported') { output += printEffect(effect); }
      }
        
      output += "\n## Banned Effects ##\n";
      output += "The following moves cannot be used in battle.\n\n";
      for (id in effects) {
        effect = effects[id];
        if (effect.state === 'banned') { output += printEffect(effect); }
      }
        
      return fs.writeFile(__dirname + '/../docs/effects.md', output.trim());
    });
      
  } else {
    return console.log("Usage: coffe " + process.argv[1] + " path/to/csvs\n");
  }
});
