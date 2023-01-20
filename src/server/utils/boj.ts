import axios from "axios";
import { load } from "cheerio";

const instance = axios.create({
  baseURL: "https://www.acmicpc.net",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  },
});

export async function getUserSolvedProblemIds(
  userId: string
): Promise<number[]> {
  const result = await instance.get(`https://www.acmicpc.net/user/${userId}`);

  const $ = load(result.data);
  const correctList = $(".problem-list")[0];
  if (correctList) {
    const a = load(correctList)("a");
    return a.map((i, e) => +$(e).text()).get();
  }
  return [];
}

export async function getUserSubmittedProblemIds(
  userId: string
): Promise<{ accepted: number[]; wrong: number[] }> {
  const result = await instance.get(`https://www.acmicpc.net/user/${userId}`);

  const $ = load(result.data);
  const correctList = $(".problem-list")[0];
  const wrongList = $(".problem-list")[1];
  const accepted: number[] = [];
  const wrong: number[] = [];
  if (correctList) {
    const a = load(correctList)("a");
    accepted.push(...a.map((i, e) => +$(e).text()).get());
  }
  if (wrongList) {
    const a = load(wrongList)("a");
    wrong.push(...a.map((i, e) => +$(e).text()).get());
  }
  return { accepted, wrong };
}

export async function getUserSubmission(userId: string, problemId: number) {
  const result = await instance.get(
    `https://www.acmicpc.net/status?problem_id=${problemId}&user_id=${userId}`
  );
  const $ = load(result.data);
  const submissionList: {
    submissionId: number;
    isAccepted: boolean;
    submittedAt: string;
  }[] = [];
  const submissions = $("tbody tr");
  submissions.each((i, e) => {
    const submissionId = +$(e).find("td:nth-child(1)").text();
    const isAccepted = $(e).find("td:nth-child(4)").text() === "맞았습니다!!";

    const submittedAt: string =
      $($(e).find("td:nth-child(9)")).find("a").attr("title") || "";
    submissionList.push({ submissionId, isAccepted, submittedAt });
  });

  return submissionList;
}
