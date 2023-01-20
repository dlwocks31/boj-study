import { z } from "zod";
import { getUserSolvedProblemIds } from "../../utils/boj";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getBoj: publicProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
      })
    )
    .query(async ({ input: { userIds } }) => {
      const solved = await Promise.all(
        userIds.map(async (id) => ({
          userId: id,
          solved: await getUserSolvedProblemIds(id),
        }))
      );

      return { solved };
    }),
});
