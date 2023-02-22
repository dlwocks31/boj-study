import axios from "axios";
import { load } from "cheerio";
import { last } from "lodash";
import type { Submission } from "../types/submission";

const instance = axios.create({
  baseURL: "https://www.acmicpc.net",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  },
});

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
  const $ = load(result.data as string);
  const submissionElements = $("tbody tr");

  const submissions = submissionElements
    .map((i, e) => {
      const submissionId = +$(e).find("td:nth-child(1)").text();
      const userId = $(e).find("td:nth-child(2)").text();
      const problemId = +$(e).find("td:nth-child(3)").text();
      const statusText = $(e).find("td:nth-child(4)").text();
      const statusData = $(e).find("td:nth-child(4) > span").attr("data-color");
      if (statusText.includes("채점") || statusText.includes("기다리는"))
        return null;
      const isAccepted = statusData === "ac";
      const submittedAt: string =
        $($(e).find("td:nth-child(9)")).find("a").attr("title") || "";
      return { submissionId, problemId, isAccepted, submittedAt, userId };
    })
    .get()
    .filter((s): s is Submission => s !== null);

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
