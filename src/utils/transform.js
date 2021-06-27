import { chain, pick } from "lodash";

const makeParent = (parent) => {
  return pick(parent, [
    "InvestorID",
    "InvestorName",
    "SetupType",
    "SetupDate",
    "SetupBy",
  ]);
};

export function transformPayload(payload) {
  const { value } = payload;
  return chain(value)
    .groupBy((x) => x.InvestorID)
    .map((val) => ({
      parent: makeParent(val[0]),
      children: val,
    }))
    .value();
}
