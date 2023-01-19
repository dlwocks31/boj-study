import { getUserSolvedProblemIds } from "../../utils/boj";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  getBoj: publicProcedure.query(async ({ ctx }) => {
    const solvedAcClass2 = [
      1018, 1181, 1259, 1920, 1978, 2164, 2609, 2751, 2798, 4153, 9012, 10250,
      10814, 10816, 10828, 10845, 10866, 11050, 11650, 11866,
    ];

    const solved = await getUserSolvedProblemIds("goodboy302");
    const classSolved = solved.filter((id) => solvedAcClass2.includes(id));
    const classNotSolved = solvedAcClass2.filter(
      (id) => !classSolved.includes(id)
    );
    return { classSolved, classNotSolved };
  }),
});
