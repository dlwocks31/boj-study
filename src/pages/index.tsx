import { type NextPage } from "next";
import Link from "next/link";

export const problemSet: { [key: string]: number[] } = {
  class2_1: [1978, 9012, 10828, 2798, 2751, 10250, 2609, 1181, 11650, 1920],
  class2_2: [10814, 1018, 10845, 4153, 2164, 10866, 10816, 11050, 11866, 1259],
  week2: [1463, 1260, 11399, 11047, 9095, 2178, 1003, 2606, 2667, 11726],
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
