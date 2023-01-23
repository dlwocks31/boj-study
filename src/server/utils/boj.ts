import axios from "axios";
import { load } from "cheerio";
import { last } from "lodash";
import { Submission } from "../types/submission";

const instance = axios.create({
  baseURL: "https://www.acmicpc.net",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  },
});

export async function fetchUserSubmittedProblemIds(
  userId: string
): Promise<{ accepted: number[]; wrong: number[] }> {
  console.log("getUserSubmittedProblemIds", userId);
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

export async function fetchUserSubmission(
  userId: string,
  params?: {
    top?: string;
    afterSubmittedAt?: string;
  }
): Promise<Submission[]> {
  console.log("fetchUserSubmission", userId, params?.top || "");
  const url = new URL("https://www.acmicpc.net/status");
  if (params?.top) {
    url.searchParams.append("top", params.top);
  }
  url.searchParams.append("user_id", userId);
  const result = await instance.get(url.toString());
  const $ = load(result.data);
  const submissionElements = $("tbody tr");

  const submissions = submissionElements
    .map((i, e) => {
      const submissionId = +$(e).find("td:nth-child(1)").text();
      const userId = $(e).find("td:nth-child(2)").text();
      const problemId = +$(e).find("td:nth-child(3)").text();
      const isAccepted = $(e).find("td:nth-child(4)").text() === "맞았습니다!!";

      const submittedAt: string =
        $($(e).find("td:nth-child(9)")).find("a").attr("title") || "";
      return { submissionId, problemId, isAccepted, submittedAt, userId };
    })
    .get();

  const lastSubmission = last(submissions);
  const afterSubmittedAt = params?.afterSubmittedAt;
  if (
    !lastSubmission ||
    !afterSubmittedAt ||
    lastSubmission.submittedAt <= afterSubmittedAt
  ) {
    return submissions;
  }

  const nextPageLink = $("a#next_page");
  if (nextPageLink.length > 0) {
    const nextPageUrl = new URL(nextPageLink.attr("href") || "", url);
    const nextTopParam = nextPageUrl.searchParams.get("top");
    if (nextTopParam) {
      return submissions.concat(
        await fetchUserSubmission(userId, {
          top: nextTopParam,
          afterSubmittedAt,
        })
      );
    }
  }
  return submissions;
}
