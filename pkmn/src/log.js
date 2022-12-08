/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Log {
  constructor() {
    this.log = [];
    this.turn = 0;
    this.attack = 0;
  }
  
  message(str) {
    if (this.log[this.turn] == null) { this.log[this.turn] = []; }
    if (this.log[this.turn][this.attack] == null) { this.log[this.turn][this.attack] = []; }
    
    return this.log[this.turn][this.attack].push(this.upperFirst(str));
  }
  
  endAttack() {
    return this.attack++;
  }
    
  endTurn() {
    this.turn++;
    return this.attack = 0;
  }
  
  toString() {
    let str = '';
    for (var turn of Array.from(this.log)) {
      for (var attack of Array.from(turn)) {
        for (var message of Array.from(attack)) {
          str += message + "\n";
        }
        
        str += "\n";
      }
      str += "\n";
    }
      
          
    return str.trim();
  }

  upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}


module.exports = Log;
