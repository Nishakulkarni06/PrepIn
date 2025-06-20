'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// Dynamically import Monaco editor to avoid SSR issues
const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" /> }
);

// Mock problem statement - This would come from your backend in production
const mockProblem = {
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
  ]
};

export default function CodingPage() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [code, setCode] = useState<string>(`function twoSum(nums, target) {
    // Write your solution here
    
}`);

  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);

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
      // Mock test cases
      const testCases = [
        { nums: [2, 7, 11, 15], target: 9 },
        { nums: [3, 2, 4], target: 6 },
        { nums: [3, 3], target: 6 }
      ];

      // Create a safe evaluation environment
      const safeEval = new Function('nums', 'target', code);
      
      let results = '';
      for (const testCase of testCases) {
        try {
          const result = safeEval(testCase.nums, testCase.target);
          // results += Test case: nums=${JSON.stringify(testCase.nums)}, target=${testCase.target}\n;
          results += `Test case: nums=${JSON.stringify(testCase.nums)}, target=${testCase.target}\n`;
          // results += Result: ${JSON.stringify(result)}\n\n;
          results += `Result: ${JSON.stringify(result)}\n\n`;
        } catch (error) {
          // results += Error in test case: ${error}\n\n;
          results += `Error in test case: ${error}\n\n`;
        }
      }

      setOutput(results);
    } catch (error) {
      setOutput(`Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Problem Statement */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4">{mockProblem.title}</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">{mockProblem.description}</p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Example:</h3>
            <pre className="whitespace-pre-wrap">{mockProblem.example}</pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Constraints:</h3>
            <ul className="list-disc pl-5">
              {mockProblem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="h-[400px]">
          <Editor
            height="100%"
            defaultLanguage="javascript"
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

      {/* Run Button */}
      <div className="flex justify-end">
        <Button
          onClick={runCode}
          disabled={isRunning || !isEditorReady}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md"
        >
          {isRunning ? 'Running...' : 'Run Code'}
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
