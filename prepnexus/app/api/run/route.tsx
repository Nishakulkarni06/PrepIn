import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCase, functionName } = await request.json();

    // Create execution harness based on language
    let fullCode = '';
    let inputFormat = '';

    switch (language) {
      case 'javascript':
        fullCode = `${code}
        
// Test the function
const result = ${functionName}(${JSON.stringify(testCase[0])}, ${testCase[1]});
console.log(JSON.stringify(result));`;
        break;
        
      case 'python':
        fullCode = `${code}

# Test the function
result = ${functionName}(${JSON.stringify(testCase[0])}, ${testCase[1]})
print(result)`;
        break;
        
      case 'java':
        fullCode = `import java.util.*;

${code}

class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.${functionName}(${JSON.stringify(testCase[0])}, ${testCase[1]});
        System.out.println(Arrays.toString(result));
    }
}`;
        break;
        
      case 'cpp':
        fullCode = `#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    Solution solution;
    vector<int> nums = ${JSON.stringify(testCase[0])};
    int target = ${testCase[1]};
    vector<int> result = solution.${functionName}(nums, target);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}`;
        break;
        
      default:
        return NextResponse.json({ success: false, error: 'Unsupported language' });
    }

    // Call Judge0 API
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        language_id: getLanguageId(language),
        source_code: fullCode,
        stdin: ''
      })
    });

    const submission = await response.json();
    
    // Wait for result
    let result;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultResponse = await fetch(  `https://judge0-ce.p.rapidapi.com/submissions/${submission.token}`, {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });
      
      result = await resultResponse.json();
      
      if (result.status.id > 2) break; // Not queued or processing
    }

    if (result.status.id === 3) { // Accepted
      let output = result.stdout || '';
      
      // Parse output based on language
      if (language === 'javascript') {
        try {
          output = JSON.parse(output.trim());
        } catch (e) {
          output = output.trim();
        }
      } else if (language === 'python') {
        try {
          output = eval(output.trim());
        } catch (e) {
          output = output.trim();
        }
      } else if (language === 'java' || language === 'cpp') {
        // Parse array output like [1,2,3]
        const match = output.match(/\[(.*)\]/);
        if (match) {
          output = match[1].split(',').map((x: string) => parseInt(x.trim()));
        }
      }
      
      return NextResponse.json({ success: true, output });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.stderr || result.compile_output || 'Execution failed' 
      });
    }
    
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}

function getLanguageId(language: string): number {
  switch (language) {
    case 'javascript': return 63; // Node.js
    case 'python': return 71; // Python 3
    case 'java': return 62; // Java
    case 'cpp': return 54; // C++
    default: return 63;
  }
}