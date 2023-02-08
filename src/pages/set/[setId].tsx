import { groupBy } from "lodash";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { match } from "ts-pattern";
import { problemSet } from "..";
import { prisma } from "../../server/db";
import type { SolveStatus } from "../../server/types/solve-status";
import { getSolveStatusOfProblem } from "../../server/utils/solve-status";
import { api } from "../../utils/api";

const userIds = ["goodboy302", "backchi", "dlwocks31"];
const submittedAfter = "2023-01-01";

type PageProps = {
  initialSolveStatuses: {
    userId: string;
    solveStatuses: SolveStatus[];
  }[];
};
const SetDetail: NextPage<PageProps> = ({ initialSolveStatuses }) => {
  // get setId from path
  const router = useRouter();
  const { setId } = router.query;

  const problemIds = problemSet[setId?.toString() || ""] || [];

  const { data, isFetching } = api.example.getBoj.useQuery(
    {
      userIds,
      problemIds,
      submittedAfter,
    },
    { initialData: initialSolveStatuses }
  );

  const dataMap = new Map<string, SolveStatus[]>();
  data?.forEach((user) => {
    dataMap.set(user.userId, user.solveStatuses);
  });
  return (
    <div className="flex flex-col items-center">
      <h1 className="p-4 text-xl font-bold lg:text-2xl">
        Algorithm Study: Set {setId}
      </h1>
      {isFetching && (
        <div className="text-center">
          <div>최신 데이터 가져오는 중..</div>
          <progress className="progress progress-info w-56"></progress>
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-center">Problem</th>
              {userIds.map((userId) => (
                <th className="text-center" key={userId}>
                  {userId}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {problemIds.map((problemId, i) => (
              <tr key={problemId}>
                <th className="text-center text-sm lg:text-base">
                  <a href={`https://boj.kr/${problemId}`}>{problemId}</a>
                </th>
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
      <td className="bg-success text-center text-sm lg:text-base">
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

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const cachedSubmissions = await prisma.bojSubmission.findMany({
    where: { userId: { in: userIds } },
    orderBy: { submittedAt: "desc" },
  });
  const cachedSubmissionByUser = Object.entries(
    groupBy(cachedSubmissions, (s) => s.userId)
  ).map(([userId, submissions]) => ({ userId, submissions }));

  const { setId } = context?.query;
  const problemIds = problemSet[setId?.toString() || ""] || [];

  const solveStatuses = cachedSubmissionByUser.map((userSubmission) => {
    const solveStatuses = problemIds.map((problemId) =>
      getSolveStatusOfProblem(
        userSubmission.submissions,
        problemId,
        submittedAfter
      )
    );
    return {
      userId: userSubmission.userId,
      solveStatuses,
    };
  });
  return {
    props: {
      initialSolveStatuses: solveStatuses,
    },
  };
};

export default SetDetail;
