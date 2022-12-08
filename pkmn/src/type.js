/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const fs = require('fs');

class Type {
  static initClass() {
    this.typedex = JSON.parse(fs.readFileSync(__dirname + '/../data/types.json').toString());
  }
  
  static all() {
    return (() => {
      const result = [];
      for (var typeId in this.typedex) {
        var dummy = this.typedex[typeId];
        result.push(new Type(typeId));
      }
      return result;
    })();
  }
  
  constructor(id) {
    const type = this.constructor.typedex[id];
    if (type == null) { throw new Error("Type not found: " + id); }
    
    this.id = type.id;
    this.name = type.name;
    this.offense = type.offense;
    this.defense = type.defense;
  }
  
  effectivenessAgainst(types) {
    if (!(types instanceof Array)) {
      types = [ types ];
    }
    
    return types.reduce((multiplier, type) => {
      return multiplier * this.offense[type.id];
    }
    , 1);
  }
    
  effectiveAgainst(types) { return (this.effectivenessAgainst(types)) > 1; }
  
  weaknesses() {
    return (() => {
      const result = [];
      for (var typeId in this.defense) {
        var effectiveness = this.defense[typeId];
        if (effectiveness > 1) {
          result.push(new this.constructor(typeId));
        }
      }
      return result;
    })();
  }
  
  strengths() {
    return (() => {
      const result = [];
      for (var typeId in this.offense) {
        var effectiveness = this.offense[typeId];
        if (effectiveness > 1) {
          result.push(new this.constructor(typeId));
        }
      }
      return result;
    })();
  }
  
  toString() {
    return this.name;
  }
}
Type.initClass();


module.exports = Type;
