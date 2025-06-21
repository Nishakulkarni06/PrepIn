"use client";

import { useState, useEffect } from 'react';
import { getCodingSession } from '@/lib/actions/coding.action';

interface DSAFeedbackProps {
  interviewId: string;
  problemIndex: number;
}

export function DSAFeedback({ interviewId, problemIndex }: DSAFeedbackProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getCodingSession(interviewId, problemIndex);
      setSession(sessionData);
      setLoading(false);
    };
    fetchSession();
  }, [interviewId, problemIndex]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading results...</div>;
  }

  if (!session) {
    return <div className="container mx-auto p-6">No session found.</div>;
  }

  const passedTests = session.testResults.filter((test: any) => test.passed).length;
  const totalTests = session.testResults.length;
  const score = Math.round((passedTests / totalTests) * 100);

  return (
    <div>
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4">Coding Interview Results</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
          <div className="text-3xl font-bold text-blue-600">{score}%</div>
          <p className="text-gray-600">{passedTests} out of {totalTests} tests passed</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>
          <div className="space-y-3">
            {session.testResults.map((test: any, index: number) => (
              <div key={index} className={`p-3 rounded-lg ${test.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="font-semibold">{test.description}</div>
                <div className="text-sm text-gray-600">
                  Input: {JSON.stringify(test.input)}
                </div>
                <div className="text-sm text-gray-600">
                  Expected: {JSON.stringify(test.expected)}
                </div>
                <div className="text-sm text-gray-600">
                  Actual: {JSON.stringify(test.actual)}
                </div>
                {test.error && (
                  <div className="text-sm text-red-600">
                    Error: {test.error}
                  </div>
                )}
                <div className={`font-semibold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {test.passed ? 'PASSED' : 'FAILED'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Code</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{session.code}</code>
          </pre>
        </div>

        <div className="flex justify-center">
          <a
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}