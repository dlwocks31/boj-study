import { getUserSubmission, getUserSubmittedProblemIds } from "./boj";

describe("getUserSubmission", () => {
  it("should return submission list", async () => {
    const submissionList = await getUserSubmission("backchi", 1978);
    console.log(submissionList);
  });

  it("should return submitted problem list", async () => {
    const problems = await getUserSubmittedProblemIds("goodboy302");
    console.log(problems);
  });
});
