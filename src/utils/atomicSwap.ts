import {
  close,
  datetoTimeout,
  type Address,
  type Contract,
  type IChoice,
  type IDeposit,
  type INotify,
  type Input,
  type MarloweState,
  type Party,
  type PayeeParty,
  type Role,
  type Timeout,
  type TokenValue,
} from "@marlowe.io/language-core-v1";
import * as G from "@marlowe.io/language-core-v1/guards";

type IReduce = void;
const iReduce: void = undefined;

/* #region Scheme */

export type Scheme = {
  participants: {
    seller: Address;
    buyer: Role;
  };
  offer: {
    deadline: Timeout;
    asset: TokenValue;
  };
  ask: {
    deadline: Timeout;
    asset: TokenValue;
  };
  swapConfirmation: {
    deadline: Timeout;
  };
};

/* #endregion */

/* #region State */
export type State =
  | WaitingSellerOffer
  | NoSellerOfferInTime
  | WaitingForAnswer
  | WaitingForSwapConfirmation
  | Closed;

export type WaitingSellerOffer = {
  typeName: "WaitingSellerOffer";
  scheme: Scheme;
  action: ProvisionOffer;
};

export type NoSellerOfferInTime = {
  typeName: "NoSellerOfferInTime";
  scheme: Scheme;
  action: RetrieveMinimumLovelaceAdded;
};

export type WaitingForAnswer = {
  typeName: "WaitingForAnswer";
  scheme: Scheme;
  actions: [Swap, Retract];
};

export type WaitingForSwapConfirmation = {
  typeName: "WaitingForSwapConfirmation";
  scheme: Scheme;
  action: ConfirmSwap;
};

export type Closed = {
  typeName: "Closed";
  scheme: Scheme;
  reason: CloseReason;
};

/* #region Action  */
export type Action =
  /* When Contract Created (timed out > NoOfferProvisionnedOnTime) */
  | ProvisionOffer // > OfferProvisionned
  /* When NoOfferProvisionnedOnTime (timed out > no timeout (need to be reduced to be closed))*/
  | RetrieveMinimumLovelaceAdded // > closed
  /* When OfferProvisionned (timed out > NotNotifiedOnTime) */
  | Retract // > closed
  | Swap // > Swapped
  /* When Swapped  (timed out > NotNotifiedOnTime) */
  | ConfirmSwap; // > closed

export type ActionParticipant = "buyer" | "seller" | "anybody";

export type RetrieveMinimumLovelaceAdded = {
  typeName: "RetrieveMinimumLovelaceAdded";
  owner: ActionParticipant;
  input: IReduce;
};

export type ProvisionOffer = {
  typeName: "ProvisionOffer";
  owner: ActionParticipant;
  input: IDeposit;
};

export type Swap = {
  typeName: "Swap";
  owner: ActionParticipant;
  input: IDeposit;
};

export type ConfirmSwap = {
  typeName: "ConfirmSwap";
  owner: ActionParticipant;
  input: INotify;
};

export type Retract = {
  typeName: "Retract";
  owner: ActionParticipant;
  input: IChoice;
};

/* #endregion */

/* #region Close Reason */
export type CloseReason =
  | NoOfferProvisionnedOnTime
  | SellerRetracted
  | NotAnsweredOnTime
  | Swapped
  | NotNotifiedOnTime;

export type NoOfferProvisionnedOnTime = {
  typeName: "NoOfferProvisionnedOnTime";
};
export type SellerRetracted = { typeName: "SellerRetracted" };
export type NotAnsweredOnTime = { typeName: "NotAnsweredOnTime" };
export type NotNotifiedOnTime = { typeName: "NotNotifiedOnTime" };
export type Swapped = { typeName: "Swapped" };

/* #endregion */

export class UnexpectedSwapContractState extends Error {
  public type = "UnexpectedSwapContractState" as const;
  public scheme: Scheme;
  public state?: MarloweState;
  constructor(scheme: Scheme, state?: MarloweState) {
    super("Swap Contract / Unexpected State");
    this.scheme = scheme;
    this.state = state;
  }
}

/* #endregion */
export const getState = (
  scheme: Scheme,
  inputHistory: Input[],
  state?: MarloweState,
): State => {
  /* #region Closed State */
  if (state === undefined) {
    // The Contract is closed when the State is undefined
    if (inputHistory.length === 0) {
      // Offer Provision Deadline has passed and there is one reduced applied to close the contract
      return {
        typeName: "Closed",
        scheme: scheme,
        reason: { typeName: "NoOfferProvisionnedOnTime" },
      };
    }
    if (inputHistory.length === 1) {
      return {
        typeName: "Closed",
        scheme: scheme,
        reason: { typeName: "NotAnsweredOnTime" },
      };
    }
    if (inputHistory.length === 2) {
      const isRetracted =
        1 ===
        inputHistory
          .filter((input) => G.IChoice.is(input))
          .map((input) => input as IChoice)
          .filter((choice) => choice.for_choice_id.choice_name === "retract")
          .length;
      const nbDeposits = inputHistory.filter((input) =>
        G.IDeposit.is(input),
      ).length;
      if (isRetracted && nbDeposits === 1) {
        return {
          typeName: "Closed",
          scheme: scheme,
          reason: { typeName: "SellerRetracted" },
        };
      }
      if (nbDeposits === 2) {
        return {
          typeName: "Closed",
          scheme: scheme,
          reason: { typeName: "NotNotifiedOnTime" },
        };
      }
    }
    if (inputHistory.length === 3) {
      const nbDeposits = inputHistory.filter((input) =>
        G.IDeposit.is(input),
      ).length;
      const nbNotify = inputHistory.filter((input) =>
        G.INotify.is(input),
      ).length;
      if (nbDeposits === 2 && nbNotify === 1) {
        return {
          typeName: "Closed",
          scheme: scheme,
          reason: { typeName: "Swapped" },
        };
      }
    }
  }
  /* #endregion */

  const now: Timeout = datetoTimeout(new Date());

  if (inputHistory.length === 0) {
    if (now < scheme.offer.deadline) {
      const offerInput: IDeposit = {
        input_from_party: scheme.participants.seller,
        that_deposits: scheme.offer.asset.amount,
        of_token: scheme.offer.asset.token,
        into_account: scheme.participants.seller,
      };
      return {
        typeName: "WaitingSellerOffer",
        scheme,
        action: {
          typeName: "ProvisionOffer",
          owner: "seller",
          input: offerInput,
        },
      };
    } else {
      return {
        typeName: "NoSellerOfferInTime",
        scheme,
        action: {
          typeName: "RetrieveMinimumLovelaceAdded",
          owner: "anybody",
          input: iReduce,
        },
      };
    }
  }

  if (inputHistory.length === 1) {
    if (now < scheme.ask.deadline) {
      const askInput: IDeposit = {
        input_from_party: scheme.participants.buyer,
        that_deposits: scheme.ask.asset.amount,
        of_token: scheme.ask.asset.token,
        into_account: scheme.participants.buyer,
      };
      const retractInput: IChoice = {
        for_choice_id: {
          choice_name: "retract",
          choice_owner: scheme.participants.seller,
        },
        input_that_chooses_num: BigInt(0),
      };
      return {
        typeName: "WaitingForAnswer",
        scheme: scheme,
        actions: [
          {
            typeName: "Swap",
            owner: "buyer",
            input: askInput,
          },
          {
            typeName: "Retract",
            owner: "seller",
            input: retractInput,
          },
        ],
      };
    } else {
      // Closed (handled upstream)
    }
  }

  if (inputHistory.length === 2) {
    const nbDeposits = inputHistory.filter((input) =>
      G.IDeposit.is(input),
    ).length;
    if (nbDeposits === 2 && now < scheme.swapConfirmation.deadline) {
      return {
        typeName: "WaitingForSwapConfirmation",
        scheme: scheme,
        action: {
          typeName: "ConfirmSwap",
          owner: "anybody",
          input: "input_notify",
        },
      };
    } else {
      // Closed (handled upstream)
    }
  }

  throw new UnexpectedSwapContractState(scheme, state);
};
export function mkContract(scheme: Scheme): Contract {
  const mkOffer = (ask: Contract): Contract => {
    const depositOffer = {
      party: scheme.participants.seller,
      deposits: scheme.offer.asset.amount,
      of_token: scheme.offer.asset.token,
      into_account: scheme.participants.seller,
    };

    return {
      when: [{ case: depositOffer, then: ask }],
      timeout: scheme.offer.deadline,
      timeout_continuation: close,
    };
  };

  const mkAsk = (confirmSwap: Contract): Contract => {
    const asPayee = (party: Party): PayeeParty => ({ party: party });
    const depositAsk = {
      party: scheme.participants.buyer,
      deposits: scheme.ask.asset.amount,
      of_token: scheme.ask.asset.token,
      into_account: scheme.participants.buyer,
    };
    const chooseToRetract = {
      choose_between: [{ from: BigInt(0), to: BigInt(0) }],
      for_choice: {
        choice_name: "retract",
        choice_owner: scheme.participants.seller,
      },
    };
    return {
      when: [
        {
          case: depositAsk,
          then: {
            pay: scheme.offer.asset.amount,
            token: scheme.offer.asset.token,
            from_account: scheme.participants.seller,
            to: asPayee(scheme.participants.buyer),
            then: {
              pay: scheme.ask.asset.amount,
              token: scheme.ask.asset.token,
              from_account: scheme.participants.buyer,
              to: asPayee(scheme.participants.seller),
              then: confirmSwap,
            },
          },
        },
        {
          case: chooseToRetract,
          then: close,
        },
      ],
      timeout: scheme.ask.deadline,
      timeout_continuation: close,
    };
  };

  const mkSwapConfirmation = (): Contract => {
    return {
      when: [{ case: { notify_if: true }, then: close }],
      timeout: scheme.swapConfirmation.deadline,
      timeout_continuation: close,
    };
  };

  return mkOffer(mkAsk(mkSwapConfirmation()));
}
