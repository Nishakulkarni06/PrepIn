interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

// New types for coding functionality
interface CodingProblem {
  title: string;
  description: string;
  example: string;
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  functionName: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  argNames: string[];
  argTypes: string[];
  testCases: Array<{
    input: (string | number | boolean)[];
    expected: string | number | boolean | (string | number)[];
    description: string;
  }>;
}

interface TestResult {
  description: string;
  input: (string | number | boolean)[];
  expected: string | number | boolean | (string | number)[];
  actual: string | number | boolean | (string | number)[] | null;
  passed: boolean;
  error?: string;
}

interface CodingSession {
  interviewId: string;
  problemIndex: number;
  code: string;
  testResults: TestResult[];
  completed: boolean;
  timestamp: string;
}

interface CodingPadProps {
  interviewId: string;
  problemIndex?: number;
  onComplete?: (results: TestResult[]) => void;
  onNext?: () => void;
}