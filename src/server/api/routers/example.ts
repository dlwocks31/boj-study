import { z } from "zod";
import { fetchUserSubmission } from "../../utils/boj";
import { getSolveStatusOfProblem } from "../../utils/solve-status";
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
        userIds.map(async (userId) => ({
          userId,
          submissions: await fetchUserSubmission(userId, {
            afterSubmittedAt: submittedAfter,
          }),
        }))
      );

      return userSubmissions.map((userSubmission) => {
        const solveStatuses = problemIds.map((problemId) =>
          getSolveStatusOfProblem(userSubmission.submissions, problemId)
        );
        return {
          userId: userSubmission.userId,
          solveStatuses,
        };
      });
    }),
});
