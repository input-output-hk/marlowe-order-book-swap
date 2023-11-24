import {
  type Action,
  type Contract,
  type Deposit,
  type Party,
  type Role,
  type When,
} from "@marlowe.io/language-core-v1";

export const isWhen = (contract: Contract): contract is When => {
  if (typeof contract === "string") return false;
  return "when" in contract;
};

export const isDeposit = (action: Action): action is Deposit => {
  return "deposits" in action;
};

export const isParty = (party: Party): party is Role => {
  return "role_token" in party;
};
