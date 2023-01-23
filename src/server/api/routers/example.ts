import { z } from "zod";
import { getUserSubmission } from "../../utils/boj";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const exampleRouter = createTRPCRouter({
  getBoj: publicProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        problemIds: z.array(z.number()),
        submittedAfter: z.string(),
      })
    )
    .query(async ({ input: { userIds, problemIds, submittedAfter } }) => {
      const userSubmissions = await Promise.all(
        userIds.map((userId) => ({
          userId,
          submissions: getUserSubmission(userId, {
            afterSubmittedAt: submittedAfter,
          }),
        }))
      );
    }),
});
