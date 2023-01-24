import { concat, first, groupBy } from "lodash";
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
    .query(async ({ ctx, input: { userIds, problemIds, submittedAfter } }) => {
      // first, get submission in database
      const cachedSubmissions = await ctx.prisma.bojSubmission.findMany({
        where: { userId: { in: userIds } },
        orderBy: { submittedAt: "desc" },
      });
      const cachedSubmissionByUser = groupBy(
        cachedSubmissions,
        (s) => s.userId
      );

      // then, merge with new submissions
      const userSubmissions = await Promise.all(
        userIds.map(async (userId) => {
          const lastCachedSubmission = first(cachedSubmissionByUser[userId]);
          const afterSubmittedAt = lastCachedSubmission
            ? lastCachedSubmission.submittedAt
            : submittedAfter;

          console.log("afterSubmittedAt", afterSubmittedAt);

          const newSubmissions = (
            await fetchUserSubmission(userId, {
              afterSubmittedAt,
            })
          ).filter((s) => s.submittedAt > afterSubmittedAt);

          console.log("newSubmissions", newSubmissions.length);
          return {
            userId,
            newSubmissions,
            submissions: concat(
              newSubmissions,
              cachedSubmissionByUser[userId] || []
            ),
          };
        })
      );

      // finally, save new submissions to database
      userSubmissions.forEach((userSubmission) => {
        userSubmission.newSubmissions.forEach(async (submission) => {
          await ctx.prisma.bojSubmission.create({ data: submission });
        });
      });

      return userSubmissions.map((userSubmission) => {
        const solveStatuses = problemIds.map((problemId) =>
          getSolveStatusOfProblem(
            userSubmission.submissions,
            problemId,
            submittedAfter
          )
        );
        return {
          userId: userSubmission.userId,
          solveStatuses,
        };
      });
    }),
});
