import { contractId } from "@marlowe.io/runtime-core";
import { z } from "zod";
import { env } from "~/env.mjs";
import { SWAP_TAG } from ".";

export const contractHeaderSchema = z.object({
  contractId: z
    .string()
    .min(64)
    .transform((x: string) => contractId(x)),
  tags: z.union([
    z
      .object({
        [env.NEXT_PUBLIC_DAPP_ID]: z.object({
          startDate: z.string().optional(),
          expiryDate: z.string().optional(),
          createdBy: z.string().optional(),
        }),
      })
      .required(),
    z.record(
      z.string().startsWith(env.NEXT_PUBLIC_DAPP_ID + `-${SWAP_TAG}-`),
      z.string(),
    ),
  ]),
  status: z.union([
    z.literal("unsigned"),
    z.literal("submitted"),
    z.literal("confirmed"),
  ]),
});

export const contractSchema = z.array(contractHeaderSchema);

export const caseSchema = z.object({
  deposits: z.bigint(),
  into_account: z.object({
    address: z.string(),
  }),
  of_token: z.object({
    currency_symbol: z.string(),
    token_name: z.string(),
  }),
  party: z.object({
    address: z.string(),
  }),
});

export const swapperSchema = z.object({
  case: z.object({
    deposits: z.bigint(),
    into_account: z.object({
      role_token: z.string(),
    }),
    of_token: z.object({
      currency_symbol: z.string(),
      token_name: z.string(),
    }),
    party: z.object({
      role_token: z.string(),
    }),
  }),
  then: z.object({}),
});

export const retractSchema = z.object({
  case: z.object({
    choose_between: z
      .array(z.object({ from: z.bigint(), to: z.bigint() }))
      .nonempty(),
  }),
  then: z.literal("close"),
});

export const thenSchema = z.object({
  when: z.tuple([swapperSchema, retractSchema]),
});

export const whenSchema = z.object({
  case: caseSchema,
  then: thenSchema,
});

export const addressSchema = z.tuple([
  z.tuple([
    z.object({ address: z.string() }),
    z.object({
      token_name: z.string(),
      currency_symbol: z.string(),
    }),
  ]),
  z.bigint(),
]);

export const initialContractSchema = z.object({
  when: z.array(whenSchema).nonempty(),
  timeout: z.bigint(),
});

export const contractDetailsSchema = z.object({
  tags: z.union([
    z
      .object({
        [env.NEXT_PUBLIC_DAPP_ID]: z.object({
          startDate: z.string().optional(),
          expiryDate: z.string().optional(),
        }),
      })
      .required(),
    z.record(
      z.string().startsWith(env.NEXT_PUBLIC_DAPP_ID + `-${SWAP_TAG}-`),
      z.string(),
    ),
  ]),
  contractId: z
    .string()
    .min(64)
    .transform((x: string) => contractId(x)),
  initialContract: initialContractSchema,
  state: z
    .object({
      value: z
        .object({
          accounts: z.array(
            z.union([
              addressSchema,
              z.tuple([
                z.tuple([
                  z.object({ role_token: z.string() }),
                  z.object({
                    token_name: z.string(),
                    currency_symbol: z.string(),
                  }),
                ]),
                z.bigint(),
              ]),
            ]),
          ),
        })
        .optional(),
    })
    .optional(),
});

export type OfferedType = z.infer<typeof caseSchema>;
export type DesiredType = z.infer<typeof thenSchema>;
