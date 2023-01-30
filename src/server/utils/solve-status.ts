import type { SolveStatus } from "../types/solve-status";
import type { Submission } from "../types/submission";

export function getSolveStatusOfProblem(
  submissions: Submission[],
  problemId: number,
  afterSubmittedAt: string
): SolveStatus {
  const filteredSubmissions = submissions.filter(
    (s) => s.problemId === problemId && s.submittedAt > afterSubmittedAt
  );
  if (filteredSubmissions.length === 0) {
    return { hasSubmission: false, isAccepted: false };
  }
  filteredSubmissions.sort((a, b) =>
    a.submittedAt.localeCompare(b.submittedAt)
  );
  const firstAcceptedSubmission = filteredSubmissions.find((s) => s.isAccepted);
  if (firstAcceptedSubmission) {
    return {
      hasSubmission: true,
      isAccepted: true,
      firstAcceptedSubmissionAt: firstAcceptedSubmission.submittedAt,
    };
  } else {
    const lastSubmission = filteredSubmissions[filteredSubmissions.length - 1];
    if (!lastSubmission) throw new Error("lastSubmission is null");
    return {
      hasSubmission: true,
      isAccepted: false,
      lastSubmissionAt: lastSubmission.submittedAt,
    };
  }
}
