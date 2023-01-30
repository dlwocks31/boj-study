import axios from "axios";
import { load } from "cheerio";
import type { Problem } from "../types/problem";

const instance = axios.create({
  baseURL: "https://www.acmicpc.net",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  },
});

export class BojService {
  async fetchProblem(problemId: number): Promise<Problem> {
    const problem = await instance.get(`/problem/${problemId}`);
    const $ = load(problem.data as string);
    const title = $("#problem_title").text();
    return {
      id: problemId,
      title,
    };
  }
}
