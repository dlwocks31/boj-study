import { SolveStatus } from "../types/solve-status";
import { Submission } from "../types/submission";

export function getSolveStatusOfProblem(
  submissions: Submission[],
  problemId: number
): SolveStatus {
  const filteredSubmissions = submissions.filter(
    (s) => s.problemId === problemId
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
    return {
      hasSubmission: true,
      isAccepted: false,
    };
  }
}
