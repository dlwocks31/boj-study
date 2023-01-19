import { load } from "cheerio";
import got from "got";

export async function getUserSolvedProblemIds(
  userId: string
): Promise<number[]> {
  const result = await got(`https://www.acmicpc.net/user/${userId}`);

  const $ = load(result.body);
  const boj = $(".problem-list")[0];
  if (boj) {
    const a = load(boj)("a");
    return a.map((i, e) => +$(e).text()).get();
  }
  return [];
}
