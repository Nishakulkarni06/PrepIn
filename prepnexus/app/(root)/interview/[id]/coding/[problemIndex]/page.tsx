"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { getInterviewById } from '@/lib/actions/general.action';
import { saveCodingSession } from '@/lib/actions/coding.action';
import { DSAFeedback } from '@/components/DSAFeedback';
// import { DSAFeedback } from '../../../../components/DSAFeedback';

// Dynamically import Monaco editor to avoid SSR issues
const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" /> }
);

// DSA problems data
const dsaProblems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    example: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109", 
      "-109 <= target <= 109",
      "Only one valid answer exists."
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`
    },
    functionName: {
      javascript: "twoSum",
      python: "two_sum", 
      java: "twoSum",
      cpp: "twoSum"
    },
    argNames: ["nums", "target"],
    argTypes: ["number[]", "number"],
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        description: "Basic case"
      },
      {
        input: [[3, 2, 4], 6],
        expected: [1, 2],
        description: "Numbers in middle"
      },
      {
        input: [[3, 3], 6],
        expected: [0, 1],
        description: "Same numbers"
      }
    ]
  }
];

export default function CodingPage() {
  const params = useParams();
  const interviewId = params.id as string;
  const problemIndex = parseInt(params.problemIndex as string);
  
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const problem = dsaProblems[problemIndex];

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language as keyof typeof problem.starterCode]);
    }
  }, [problem, language]);

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const runCode = async () => {
    if (!isEditorReady) {
      setOutput('Please wait for the editor to load...');
      return;
    }

    setIsRunning(true);
    setOutput('Running your code...\n');

    try {
      const results = [];
      
      for (const testCase of problem.testCases) {
        try {
          const response = await fetch('/api/run', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              language,
              testCase: testCase.input,
              functionName: problem.functionName[language as keyof typeof problem.functionName]
            }),
          });

          const result = await response.json();
          
          if (result.success) {
            const actual = result.output;
            const expected = testCase.expected;
            const passed = JSON.stringify(actual) === JSON.stringify(expected);
            
            results.push({
              description: testCase.description,
              input: testCase.input,
              expected: testCase.expected,
              actual: actual,
              passed: passed
            });
            
            setOutput(`prev => prev + Test:${testCase.description}\n`);
            setOutput(`prev => prev + Input: ${JSON.stringify(testCase.input)}\n`);
            setOutput(`prev => prev + Expected: ${JSON.stringify(expected)}\n`);
            setOutput(`prev => prev + Actual: ${JSON.stringify(actual)}\n`);
            setOutput(`prev => prev + Result: ${passed ? 'PASSED' : 'FAILED'}\n\n`);
          } else {
            results.push({
              description: testCase.description,
              input: testCase.input,
              expected: testCase.expected,
              actual: null,
              passed: false,
              error: result.error
            });
            
            setOutput(`prev => prev + Test: ${testCase.description}\n`);
            setOutput(`prev => prev + Error: ${result.error}\n\n`);
          }
        } catch (error) {
          results.push({
            description: testCase.description,
            input: testCase.input,
            expected: testCase.expected,
            actual: null,
            passed: false,
            error: error
          });
          
          setOutput(`prev => prev + Test: ${testCase.description}\n`);
          setOutput(`prev => prev + Error: ${error}\n\n`);
        }
      }
      
      setTestResults(results);
      
      // Save session
      await saveCodingSession({
        interviewId,
        problemIndex,
        code,
        testResults: results,
        completed: false
      });
      
    } catch (error) {
      setOutput(`Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleComplete = async () => {
    await saveCodingSession({
      interviewId,
      problemIndex,
      code,
      testResults,
      completed: true
    });
    setIsCompleted(true);
  };

  if (isCompleted) {
    return <DSAFeedback interviewId={interviewId} problemIndex={problemIndex} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Problem Statement */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">{problem.description}</p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Example:</h3>
            <pre className="whitespace-pre-wrap">{problem.example}</pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Constraints:</h3>
            <ul className="list-disc pl-5">
              {problem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <label className="block text-sm font-medium mb-2">Programming Language:</label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Code Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="h-[400px]">
          <Editor
            height="100%"
            defaultLanguage={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={runCode}
          disabled={isRunning || !isEditorReady}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
        
        <Button
          onClick={handleComplete}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Complete Problem
        </Button>
      </div>

      {/* Output Console */}
      <div className="bg-gray-900 text-white rounded-lg p-4 font-mono">
        <h3 className="text-lg font-semibold mb-2">Output:</h3>
        <pre className="whitespace-pre-wrap">{output || 'No output yet'}</pre>
      </div>
    </div>
  );
}
