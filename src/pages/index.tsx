import { type NextPage } from "next";
import Link from "next/link";

export const problemSet: { [key: string]: number[] } = {
  class2_1: [1978, 9012, 10828, 2798, 2751, 10250, 2609, 1181, 11650, 1920],
  class2_2: [10814, 1018, 10845, 4153, 2164, 10866, 10816, 11050, 11866, 1259],
  week2: [1463, 1260, 11399, 11047, 9095, 2178, 1003, 2606, 2667, 11726],
  week3: [2579, 1012, 1931, 7576, 1697, 9461, 11727, 11724, 1541, 1764],
  week4: [1676, 1927, 11279, 11659, 10026, 7569, 18870, 1074, 5525, 2630],
  week5: [17626, 11403, 5430, 1780, 11723, 9019, 1107, 9375, 1389, 6064],
  week6: [16922, 3182, 2872, 17829, 15989, 16139, 12904, 16987, 17406, 1253],
  week7: [2852, 1347, 18310, 16493, 17086, 15729, 12026, 16139, 1245, 16987],
};

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="p-4 text-2xl font-bold">Link To Problem Set</h1>
      {Object.keys(problemSet).map((key) => {
        return (
          <Link href={`/set/${key}`} key={key}>
            <button className="btn w-48" key={key}>
              {key}
            </button>
          </Link>
        );
      })}
    </div>
  );
};

export default Home;
