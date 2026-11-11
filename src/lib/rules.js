import { DEFAULT_RULES } from "../constants.js";

export const getRules = (settings, store) => {
  const v = { ...DEFAULT_RULES, ...((settings && settings.rules) || {}), ...((settings && settings.rulesByStore && store && settings.rulesByStore[store]) || {}) };
  if (!(v.jamPerHari > 0)) v.jamPerHari = 9;
  return v;
};
