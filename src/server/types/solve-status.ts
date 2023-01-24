export type SolveStatus =
  | {
      hasSubmission: true;
      isAccepted: true;
      firstAcceptedSubmissionAt: string;
    }
  | {
      hasSubmission: true;
      isAccepted: false;
      lastSubmissionAt: string;
    }
  | {
      hasSubmission: false;
      isAccepted: false;
    };
