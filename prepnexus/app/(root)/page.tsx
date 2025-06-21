import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getFeedbackByUser,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  if (!user?.id) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Please sign in to view your interviews.
      </div>
    );
  }

  const [allInterviews, feedbacks] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getFeedbackByUser(user?.id!)
  ]);

  const feedbackInterviewIds = new Set(feedbacks.map(f => f.interviewId));

  const upcomingInterviews = allInterviews?.filter(
    interview => !feedbackInterviewIds.has(interview.id)
  );

  const pastInterviews = allInterviews?.filter(
    interview => feedbackInterviewIds.has(interview.id)
  );

  return (
    <>
      <section className="card-cta bg-white">
        <Image
          src="/home.jpg"
          alt="learning illustration"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
        <div className="flex flex-col gap-6 max-w-lg text-black">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg  text-black">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-2 px-6 rounded-md">
            <Link href="/create-interview">Create Interview</Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-4">
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-black font-sans my-6">My Interviews</h2>

          { <div className="interviews-section">
            {upcomingInterviews?.length ? (
              upcomingInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  company={interview.company}
                />
              ))
            ) : (
              <p className="text-gray-400">No upcoming interviews available</p>
            )}
          </div> }
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-4">
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-black font-sans my-6">Past Interviews</h2>

          <div className="interviews-section">
            {pastInterviews?.length ? (
              pastInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  company={interview.company}
                />
              ))
            ) : (
              <p className="text-gray-400">You haven&apos;t taken any interviews yet</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;