import { contractId } from "@marlowe.io/runtime-core";
import { z } from "zod";
import { env } from "~/env.mjs";
import { SWAP_TAG } from ".";

export const swapTag = "-swap-";

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
    role_token: z.string(),
  }),
  of_token: z.object({
    currency_symbol: z.string(),
    token_name: z.string(),
  }),
  party: z.object({
    role_token: z.string(),
  }),
});

export const thenSchema = z.object({
  when: z
    .array(
      z.object({
        case: caseSchema,
        then: z.object({
          from_account: z.object({
            role_token: z.string(),
          }),
          pay: z.bigint(),
          token: z.object({
            currency_symbol: z.string(),
            token_name: z.string(),
          }),
        }),
      }),
    )
    .nonempty(),
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
  contractId: z
    .string()
    .min(64)
    .transform((x: string) => contractId(x)),
  initialContract: initialContractSchema,
  state: z.object({
    value: z
      .object({
        accounts: z
          .array(addressSchema)
          .nonempty()
          .or(
            z.tuple([
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
  }),
});

export type OfferedType = z.infer<typeof caseSchema>;
export type DesiredType = z.infer<typeof thenSchema>;
