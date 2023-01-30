import { useRouter } from "next/router";
import { match } from "ts-pattern";
import { problemSet } from "..";
import type { SolveStatus } from "../../server/types/solve-status";
import { api } from "../../utils/api";

const SetDetail = () => {
  // get setId from path
  const router = useRouter();
  const { setId } = router.query;

  const problemIds = problemSet[setId?.toString() || ""] || [];
  const userIds = ["goodboy302", "backchi", "dlwocks31"];
  const { data } = api.example.getBoj.useQuery({
    userIds,
    problemIds,
    submittedAfter: "2023-01-01",
  });

  const dataMap = new Map<string, SolveStatus[]>();
  data?.forEach((user) => {
    dataMap.set(user.userId, user.solveStatuses);
  });
  return (
    <div className="flex flex-col items-center">
      <h1 className="p-4 text-2xl font-bold">Algorithm Study: Set {setId}</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th className="w-1/6 text-center">Problem</th>
            {userIds.map((userId) => (
              <th className="w-3/12 text-center" key={userId}>
                {userId}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {problemIds.map((problemId, i) => (
            <tr key={problemId}>
              <td className="text-center">
                <a href={`https://boj.kr/${problemId}`}>{problemId}</a>
              </td>
              {userIds.map((userId) => {
                const status = dataMap.get(userId)?.[i];
                return (
                  <SolveItem
                    userId={userId}
                    problemId={problemId}
                    status={status}
                    key={userId}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SolveItem = ({
  userId,
  problemId,
  status,
}: {
  userId: string;
  problemId: number;
  status: SolveStatus | undefined;
}) => {
  return match(status)
    .with({ isAccepted: true }, (s) => (
      <td className="bg-success text-center">
        <a
          href={`https://www.acmicpc.net/status?problem_id=${problemId}&user_id=${userId}`}
          className="text-gray-700"
        >
          {s.firstAcceptedSubmissionAt}
        </a>
      </td>
    ))
    .with({ hasSubmission: true }, (s) => (
      <td className="bg-error text-center">
        <a
          href={`https://www.acmicpc.net/status?problem_id=${problemId}&user_id=${userId}`}
          className="text-gray-700"
        >
          {s.lastSubmissionAt}
        </a>
      </td>
    ))
    .otherwise(() => <td></td>);
};

export default SetDetail;
