import { fetchUserSubmission } from "./boj";

describe("getUserSubmission", () => {
  it("한 유저의 특정 날짜 이후로의 제출들을 가져올 수 있다", async () => {
    const submissionList = await fetchUserSubmission("goodboy302", {
      afterSubmittedAt: "2023-01-01",
    });
    console.log(submissionList);
  });

  it("한 유저의 첫 페이지의 제출을 가져올 수 있다", async () => {
    const submissionList = await fetchUserSubmission("dlwocks31");
    console.log(submissionList);
  });
});
