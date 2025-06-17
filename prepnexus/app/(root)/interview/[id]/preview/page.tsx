import { getInterviewById } from '@/lib/actions/general.action'; // your DB function
import { notFound } from 'next/navigation';

type InterviewPageProps = {
  params: { id: string };
};

export default async function InterviewPreview({ params }: InterviewPageProps) {
  const interview = await getInterviewById(params.id);

  if (!interview) return notFound();

  return (
    <div className="min-h-screen bg-[#ede7df] flex flex-col">

      {/* Interview Info */}
      <main className="flex justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-black">
            Interview Details
          </h2>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-black">
            <label className="font-medium">Company</label>
            <input
              className="bg-gray-200 text-black px-3 py-2 rounded-md"
              readOnly
              value={interview.company? interview.company : '-'}
            />
            <label className="font-medium">Role</label>
            <input
              className="bg-gray-200 text-black px-3 py-2 rounded-md"
              readOnly
              value={interview.role? interview.role : '-'}
            />
            <label className="font-medium">Level</label>
            <input
              className="bg-gray-200 text-black px-3 py-2 rounded-md"
              readOnly
              value={interview.level? interview.level : '-'}
            />
            <label className="font-medium">Type</label>
            <input
              className="bg-gray-200 text-black px-3 py-2 rounded-md"
              readOnly
              value={interview.type? interview.type : '-'}
            />
            <label className="font-medium">Amount of Questions</label>
            <input
              className="bg-gray-200 text-black px-3 py-2 rounded-md"
              readOnly
              value={interview.questions?.length ?? 0}
            />
            <label className="font-medium">Tech Stack</label>
            <input
              className="bg-gray-200 text-black px-3 py-2 rounded-md"
              readOnly
              value={interview.techstack? interview.techstack : '-'}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={`/interview/${params.id}/`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-bold"
            >
              Start Interview
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
