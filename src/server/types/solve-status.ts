export type SolveStatus =
  | {
      hasSubmission: true;
      isAccepted: true;
      firstAcceptedSubmissionAt: string;
    }
  | {
      hasSubmission: boolean;
      isAccepted: false;
    };
