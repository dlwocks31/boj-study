import { Submission } from "../types/submission";
import { getSolveStatusOfProblem } from "./solve-status";

describe("GetSolveStatusOfProblem", () => {
  it("특정 유저의 submission을 주면, 그를 통해 특정 문제의 제출 상태를 확인할 수 있다.", async () => {
    const submissions: Submission[] = [
      {
        problemId: 1000,
        isAccepted: true,
        submittedAt: "2021-01-02 00:00:00",
        userId: "user1",
        submissionId: 1,
      },
      {
        problemId: 1000,
        isAccepted: true,
        submittedAt: "2021-01-01 00:00:00",
        userId: "user1",
        submissionId: 1,
      },
    ];
    const problemId = 1000;
    const result = getSolveStatusOfProblem(
      submissions,
      problemId,
      "2021-01-01"
    );
    expect(result).toEqual({
      hasSubmission: true,
      isAccepted: true,
      firstAcceptedSubmissionAt: "2021-01-01 00:00:00",
    });
  });
});
