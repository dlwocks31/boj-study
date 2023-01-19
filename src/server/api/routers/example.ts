import { z } from "zod";
import { getUserSolvedProblemIds } from "../../utils/boj";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  // get list of user ids as input
  getBoj: publicProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
      })
    )
    .query(async ({ input: { userIds } }) => {
      const solvedAcClass2 = [
        1978, 9012, 10828, 2798, 2751, 10250, 2609, 1181, 11650, 1920,
      ];

      const solved = await Promise.all(
        userIds.map(async (id) => ({
          userId: id,
          solved: await getUserSolvedProblemIds(id),
        }))
      );

      return { solved };
    }),
});
