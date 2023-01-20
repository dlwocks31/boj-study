import { z } from "zod";
import { getUserSubmission, getUserSubmittedProblemIds } from "../../utils/boj";
import { createTRPCRouter, publicProcedure } from "../trpc";

type SolvedStatus =
  | {
      hasSubmission: true;
      isAccepted: true;
      lastAcceptedSubmissionId: number;
      lastAcceptedSubmissionAt: string;
    }
  | {
      hasSubmission: boolean;
      isAccepted: false;
    };

export const exampleRouter = createTRPCRouter({
  getBoj: publicProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        problemIds: z.array(z.number()),
        submittedAfter: z.string().optional(),
      })
    )
    .query(
      async ({
        input: { userIds, problemIds, submittedAfter },
      }): Promise<
        {
          userId: string;
          problems: {
            problemId: number;
            status: SolvedStatus;
          }[];
        }[]
      > => {
        const solved = await Promise.all(
          userIds.map(async (userId) => ({
            userId,
            problems: await getUserSubmittedProblemIds(userId)
              .then(({ accepted, wrong }) =>
                problemIds.filter(
                  (id) => accepted.includes(id) || wrong.includes(id)
                )
              )
              .then((solvedIds) =>
                Promise.all(
                  solvedIds.map((id) =>
                    getUserSubmission(userId, id).then(
                      (
                        submissions
                      ): { problemId: number; status: SolvedStatus } => ({
                        problemId: id,
                        status: getSolveStatus(submissions, submittedAfter),
                      })
                    )
                  )
                )
              ),
          }))
        );

        return solved;
      }
    ),
});

function getSolveStatus(
  submissions: {
    submissionId: number;
    isAccepted: boolean;
    submittedAt: string;
  }[],
  submittedAfter?: string
):
  | {
      hasSubmission: true;
      isAccepted: true;
      lastAcceptedSubmissionId: number;
      lastAcceptedSubmissionAt: string;
    }
  | { hasSubmission: boolean; isAccepted: false } {
  const filteredSubmissions = submissions.filter(
    (s) => !submittedAfter || s.submittedAt > submittedAfter
  );
  const firstAcceptedSubmission = filteredSubmissions.find((s) => s.isAccepted);
  if (firstAcceptedSubmission) {
    return {
      hasSubmission: true,
      isAccepted: true,
      lastAcceptedSubmissionAt: firstAcceptedSubmission.submittedAt,
      lastAcceptedSubmissionId: firstAcceptedSubmission.submissionId,
    };
  } else {
    return { hasSubmission: filteredSubmissions.length > 0, isAccepted: false };
  }
}
