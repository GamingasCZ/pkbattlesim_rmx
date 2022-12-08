/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DefaultEffect = require('./effects/defaultEffect');
const NoEffect = require('./effects/noEffect');
const DualEffect = require('./effects/dualEffect');
const HealEffect = require('./effects/healEffect');
const RecoilEffect = require('./effects/recoilEffect');
const RecoilOnMissEffect = require('./effects/recoilOnMissEffect');
const StruggleEffect = require('./effects/struggleEffect');
const MultiHitEffect = require('./effects/multiHitEffect');
const DoublePowerEffect = require('./effects/doublePowerEffect');
const WeightDependentEffect = require('./effects/weightDependentEffect');
const CritRateEffect = require('./effects/critRateEffect');
const StatStageEffect = require('./effects/statStageEffect');
const SwitchOutEffect = require('./effects/switchOutEffect');
const BannedEffect = require('./effects/bannedEffect');
const StatusAilmentEffect = require('./effects/statusAilmentEffect');
const ConditionEffect = require('./effects/conditionEffect');

class Effect {
  static make(id, chance) {
    switch (id) {
      case 1: case 35: case 104: return new NoEffect(id);
      
      case 254: case 263: return new DualEffect(id, [(new RecoilEffect(id)), (new StatusAilmentEffect(id, chance))]);
      case 78: return new DualEffect(id, [(new MultiHitEffect(id)), (new StatusAilmentEffect(id, chance))]);
      case 274: case 275: case 276: return new DualEffect(id, [(new ConditionEffect(id, chance)), (new StatusAilmentEffect(id, chance))]);
      case 201: case 210: return new DualEffect(id, [(new CritRateEffect(id)), (new StatusAilmentEffect(id, chance))]);

      // Status Ailments - Also 126
      case 3: case 5: case 6: case 7: case 153: case 203: case 261: return new StatusAilmentEffect(id, chance);
      case 37: case 126: case 153: case 170: case 172: case 198: case 284: case 330: return new DefaultEffect(id);
      
      // Stat Levels
      case 74: case 304: case 305: case 306: case 344: return new DefaultEffect(id);
      
      // Accuracy-related
      case 18: case 79: return new DefaultEffect(id);
      
      // Items
      case 106: case 189: case 225: case 315: return new DefaultEffect(id);
      
      // U-turn
      case 229: return new SwitchOutEffect(id);
      
      // Misc
      case 130: case 148: case 150: case 186: case 187: case 208: case 222: case 224: case 231: case 232: case 258: case 269: case 288: case 290: case 302: case 303: case 311: case 314: case 320: case 350: return new DefaultEffect(id);
      
      // Flinch
      case 32: case 147: case 151: return new ConditionEffect(id, chance);

      // Confusion
      case 77: case 268: case 338: return new ConditionEffect(id, chance);

      // Fully Implemented
      case 4: case 348: case 353: return new HealEffect(id);
      case 49: case 199: case 270: return new RecoilEffect(id);
      case 46: return new RecoilOnMissEffect(id);
      case 255: return new StruggleEffect(id);
      case 30: case 45: return new MultiHitEffect(id);
      case 318: return new DoublePowerEffect(id);
      case 197: return new WeightDependentEffect(id);
      case 44: case 289: return new CritRateEffect(id);
      case 21: case 69: case 70: case 71: case 72: case 73: case 139: case 140: case 141: case 205: case 219: case 230: case 272: case 277: case 296: case 297: case 331: case 335: return new StatStageEffect(id, chance);
      default: return new BannedEffect(id);
    }
  }
}


module.exports = Effect;
