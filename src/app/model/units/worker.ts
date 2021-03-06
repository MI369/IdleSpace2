import { Unit } from "./unit";
import { ModStack } from "./modStack";
import { Game } from "../game";
import {
  ONE,
  ZERO,
  MOD_COMPONENTS,
  MOD_RECYCLING,
  MAX_RECYCLING,
  COMPONENT_PRICE,
  MAX_DRONES_PRESTIGE,
  EXTREME_MOD_TOTAL_MULTI,
  EXTREME_MOD_TOTAL_EXP
} from "../CONSTANTS";
import { IUnitData } from "../data/iUnitData";
import { Technology } from "../researches/technology";
import { Research } from "../researches/research";
import { AutoWorker } from "../automation/autoWorker";
import { AutoMod } from "../automation/autoMod";
import { Building } from "./building";

const ASSEMBLY_PRIORITY = 50;
const ASSEMBLY_PRIORITY_ENDING = 500;
export class Worker extends Unit {
  modStack: ModStack;
  maxMods: Decimal = ZERO;
  maxModsTemp: Decimal = ZERO;
  unusedMods: Decimal = ZERO;
  maxTechMods: { technology: Technology; multi: number }[];
  recycle = ZERO;
  recycleTemp = ZERO;
  assemblyPriority = ASSEMBLY_PRIORITY;
  assemblyPriorityEnding = ASSEMBLY_PRIORITY_ENDING;
  modsResearches: Research[];
  autoBuyer: AutoWorker;
  autoMod: AutoMod;
  modPage = false;

  storedComponents = ZERO;
  needComponents = ZERO;
  componentBasePrice = COMPONENT_PRICE;
  components = COMPONENT_PRICE;
  componentsTemp = COMPONENT_PRICE;
  componentPercent = 0;
  extremeModLevel = 0;
  extremeModLevelUi = 0;
  extremeBonus = 0;
  extremeMauls = ZERO;
  relativeBuilding: Building;
  constructor(public unitData: IUnitData) {
    super(unitData);
    if ("componentsPrice" in unitData) {
      this.componentBasePrice = new Decimal(unitData.componentsPrice);
    }
  }
  reloadComponentPrice() {
    const baseRecycling = Game.getGame().baseRecycling;
    const recyclingMulti = Game.getGame().recyclingMulti.totalBonus;
    this.components = this.componentBasePrice;
    this.componentsTemp = this.componentBasePrice;
    if (this.modStack && this.modStack.componentsMod) {
      this.components = this.components.minus(
        this.modStack.componentsMod.quantity.times(MOD_COMPONENTS)
      );
      this.componentsTemp = this.componentsTemp.minus(
        this.modStack.componentsMod.uiQuantity.times(MOD_COMPONENTS)
      );
    }
    this.recycle = baseRecycling;
    this.recycleTemp = baseRecycling;
    if (this.modStack && this.modStack.recyclingMod) {
      this.recycle = this.recycle.plus(
        this.modStack.recyclingMod.quantity.times(MOD_RECYCLING)
      );
      this.recycleTemp = this.recycleTemp.plus(
        this.modStack.recyclingMod.uiQuantity.times(MOD_RECYCLING)
      );
    }
    this.recycle = Decimal.min(
      this.recycle.times(recyclingMulti),
      this.components.times(MAX_RECYCLING)
    );
    this.recycleTemp = Decimal.min(
      this.recycleTemp.times(recyclingMulti),
      this.componentsTemp.times(MAX_RECYCLING)
    );

    if (Game.getGame().prestigeManager.extremeModsCard.active) {
      this.extremeMauls = Decimal.pow(
        EXTREME_MOD_TOTAL_EXP,
        this.extremeModLevelUi
      );
      const extremeMultiComp = Decimal.pow(
        EXTREME_MOD_TOTAL_EXP,
        this.extremeModLevel
      );
      this.components = this.components.times(extremeMultiComp);
      this.componentsTemp = this.componentsTemp.times(this.extremeMauls);
    } else {
      this.extremeMauls = ZERO;
    }
  }
  makeMods() {
    this.modStack = new ModStack(this.id !== "e");
  }
  reloadMaxMods() {
    this.maxMods = ZERO;
    for (let i = 0, n = this.maxTechMods.length; i < n; i++) {
      this.maxMods = this.maxMods.plus(
        this.maxTechMods[i].technology.quantity.times(this.maxTechMods[i].multi)
      );
    }
    let multi = ONE;
    if (this.modsResearches) {
      for (let i = 0, n = this.modsResearches.length; i < n; i++) {
        if (this.modsResearches[i].quantity.gt(0)) {
          for (
            let k = 0, n2 = this.modsResearches[i].modPoints.length;
            k < n2;
            k++
          ) {
            if (this.modsResearches[i].modPoints[k].unit === this) {
              multi = multi.times(
                this.modsResearches[i].quantity.times(
                  1 + this.modsResearches[i].modPoints[k].multi
                )
              );
            }
          }
        }
      }
    }
    if (Game.getGame().prestigeManager.doubleModsCard.active) {
      this.maxMods = this.maxMods.times(1.5);
    }
    this.maxMods = this.maxMods.times(
      ONE.plus(
        Game.getGame().prestigeManager.maxMods.quantity.times(
          MAX_DRONES_PRESTIGE
        )
      )
    );
    this.maxModsTemp = new Decimal(this.maxMods);

    if (Game.getGame().prestigeManager.extremeModsCard.active) {
      this.extremeBonus = this.extremeModLevelUi * EXTREME_MOD_TOTAL_MULTI;
      this.maxMods = this.maxMods.times(
        1 + this.extremeModLevel * EXTREME_MOD_TOTAL_MULTI
      );
      this.maxModsTemp = this.maxModsTemp.times(
        1 + this.extremeModLevelUi * EXTREME_MOD_TOTAL_MULTI
      );
    } else {
      this.extremeBonus = 0;
    }

    this.maxMods = this.maxMods.times(multi).floor();
    this.maxModsTemp = this.maxModsTemp.times(multi).floor();
  }
  confirmMods(auto = false) {
    let recycle = this.recycle.plus(Game.getGame().baseRecycling);
    recycle = recycle.times(Game.getGame().recyclingMulti.totalBonus);
    recycle = recycle.min(this.components.times(0.9));
    this.quantity = ONE;
    if (!auto) {
      this.modStack.mods.forEach((mod) => {
        mod.quantity = mod.uiQuantity;
      });
    }
    this.manualBought = ZERO;
    this.reloadAll();
    let toAdd = this.quantity.times(recycle);
    let newDrones = toAdd.div(this.components).floor();
    newDrones = newDrones.min(this.limit.minus(ONE));
    toAdd = toAdd.minus(newDrones.times(this.components));

    this.quantity = this.quantity.plus(newDrones);
    const components = Game.getGame().resourceManager.components;
    components.quantity = components.quantity.plus(toAdd);
    Game.getGame().resourceManager.deployComponents();
    Game.getGame().researchManager.robotics.inspire();
    if (Game.getGame().prestigeManager.modWarp.active) {
      Game.getGame().timeToWarp =
        Game.getGame().timeToWarp + (this.modStack.used.log10() + 1);
    }
    this.reloadAll();
  }
  reloadLimit() {
    if (!super.reloadLimit()) return false;
    if (this.modStack && this.modStack.droneMod) {
      this.limitTemp = this.limit
        .times(this.modStack.droneMod.totalBonusTemp)
        .floor();
      this.limit = this.limit.times(this.modStack.droneMod.totalBonus).floor();
    }
  }
  reloadAll() {
    this.modStack.reload();
    this.reloadComponentPrice();
    this.production.forEach((prod) => {
      prod.reloadMod();
    });
    this.production.forEach((prod) => {
      prod.reloadMod();
    });
    super.reloadAll();
  }
  reloadNeedComponent() {
    this.needComponents = this.limit
      .minus(this.quantity)
      .times(this.components)
      .minus(this.storedComponents)
      .max(0);
    if (this.components.gt(0)) {
      this.componentPercent = this.storedComponents
        .div(this.components)
        .toNumber();
    } else this.componentPercent = 1;
  }
  postUpdate() {
    super.postUpdate();
    this.reloadNeedComponent();
  }
  loadTempAutoMods(actual = true) {
    for (const mod of this.modStack.mods) {
      mod.uiQuantity = ZERO;
    }
    for (let i = 0; i < 7; i++) {
      let priSumPos = 0;
      let priSumNeg = 0;
      let positiveMods = this.maxModsTemp;

      //  Reload priorities
      for (const mod of this.modStack.mods) {
        positiveMods = positiveMods.minus(mod.uiQuantity);
        if (mod.getPriority(actual) === 0) continue;
        if (mod.getPriority(actual) > 0) {
          if (
            mod.uiQuantity.lt(mod.max) &&
            mod.uiQuantity.lt(this.maxModsTemp)
          ) {
            priSumPos += mod.getPriority(actual);
          }
        } else {
          if (
            mod.uiQuantity.gt(mod.min) &&
            mod.uiQuantity.gt(this.maxModsTemp.times(-1))
          ) {
            priSumNeg += mod.getPriority(actual);
          }
        }
      }
      //  Positive mods
      if (priSumNeg < 0 && i === 0) {
        for (const mod of this.modStack.mods) {
          if (mod.getPriority(actual) >= 0) continue;
          if (
            mod.uiQuantity.lte(mod.min) ||
            mod.uiQuantity.lte(this.maxModsTemp.times(-1))
          ) {
            continue;
          }

          const modPerPriority = this.maxModsTemp.div(priSumPos);
          let toAdd = modPerPriority.times(mod.getPriority(actual));
          toAdd = toAdd.max(mod.min.minus(mod.uiQuantity));
          toAdd = toAdd.max(this.maxModsTemp.times(-1).minus(mod.uiQuantity));
          toAdd = toAdd.floor();
          if (toAdd.gte(0)) toAdd = ZERO;
          if (toAdd.lt(0)) {
            mod.uiQuantity = mod.uiQuantity.plus(toAdd);
            positiveMods = positiveMods.minus(toAdd);
          }
        }
      }
      //  Negative Mods
      if (priSumPos > 0) {
        for (const mod of this.modStack.mods) {
          if (mod.getPriority(actual) <= 0) continue;
          if (
            mod.uiQuantity.gte(mod.max) ||
            mod.uiQuantity.gte(this.maxModsTemp)
          ) {
            continue;
          }

          const modPerPriority = positiveMods.div(priSumPos);
          let toAdd = modPerPriority.times(mod.getPriority(actual));
          toAdd = toAdd.min(mod.max.minus(mod.uiQuantity));
          toAdd = toAdd.min(this.maxModsTemp.minus(mod.uiQuantity));
          toAdd = toAdd.floor();
          if (toAdd.lte(0)) toAdd = ZERO;
          if (toAdd.gt(0)) {
            mod.uiQuantity = mod.uiQuantity.plus(toAdd);
          }
        }
      }
    }
    let used = ZERO;
    for (const mod of this.modStack.mods) {
      used = mod.uiQuantity.plus(used);
    }
    let toUse = this.maxModsTemp.minus(used);
    for (let i = 0; i < 7; i++) {
      const sortedMods = this.modStack.mods
        .filter(
          (m) => m.getPriority(actual) > 0 && m.uiQuantity.lt(this.maxModsTemp)
        )
        .sort((a, b) => a.getPriority(actual) - b.getPriority(actual));
      sortedMods.forEach((m) => {
        if (
          toUse.gt(0) &&
          m.uiQuantity.lte(this.maxModsTemp) &&
          m.uiQuantity.lte(m.max)
        ) {
          m.uiQuantity = m.uiQuantity.plus(1);
          toUse = toUse.minus(1);
        }
      });
    }
  }
  prestige() {
    super.prestige();
    this.modStack.mods.forEach((mod) => {
      mod.quantity = ZERO;
    });
    this.modStack.reload();
    this.reloadAll();
  }
  getSave(): any {
    const ret = super.getSave();
    if (this.modStack) {
      ret.t = this.modStack.getSave();
    }
    if (ASSEMBLY_PRIORITY_ENDING !== this.assemblyPriority) {
      ret.p1 = this.assemblyPriority;
    }
    if (ASSEMBLY_PRIORITY_ENDING !== this.assemblyPriorityEnding) {
      ret.p2 = this.assemblyPriorityEnding;
    }
    ret.ex = this.extremeModLevel;
    return ret;
  }
  load(save: any) {
    if (!super.load(save)) return false;
    if ("t" in save) {
      this.modStack.load(save.t);
    }
    if ("p1" in save && typeof save.p1 === "number") {
      this.assemblyPriority = save.p1;
    }
    if ("p2" in save && typeof save.p2 === "number") {
      this.assemblyPriorityEnding = save.p2;
    }
    if ("ex" in save && typeof save.ex === "number") {
      this.extremeModLevel = save.ex;
    }
  }
}
