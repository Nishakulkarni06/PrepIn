import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <section className="section-feedback">
      <div className=" bg-white p-8 text-black rounded-lg shadow-md max-w-7xl mx-auto">
        <div className="flex flex-row justify-center">
          <h1 className="text-4xl font-semibold p-4">
            Feedback on the Interview -{" "}
            <span className="capitalize">{interview.role}</span> Interview
          </h1>
        </div>

        <div className="flex flex-row justify-center my-2">
          <div className="flex flex-row gap-5">
            {/* Overall Impression */}
            <div className="flex flex-row gap-2 items-center ">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p className="text-gray-700">
                Overall Impression:{" "}
                <span className="text-gray-700 font-bold">
                  {feedback?.totalScore}
                </span>
                /100
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-row gap-2">
              <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
              <p className="text-gray-700">
                {feedback?.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <hr />

        <p className="text-gray-700 my-2">{feedback?.finalAssessment}</p>

        {/* Interview Breakdown */}
        <div className="flex flex-col gap-4">
          <h2>Breakdown of the Interview:</h2>
          {feedback?.categoryScores?.map((category, index) => (
            <div key={index}>
              <p className="font-bold text-black">
                {index + 1}. {category.name} ({category.score}/100)
              </p>
              <p className="text-gray-700">{category.comment}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 my-2">
          <h3>Strengths</h3>
          <ul>
            {feedback?.strengths?.map((strength, index) => (
              <li className="text-gray-700" key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 my-2">
          <h3>Areas for Improvement</h3>
          <ul>
            {feedback?.areasForImprovement?.map((area, index) => (
              <li className="text-gray-700" key={index}>{area}</li>
            ))}
          </ul>
        </div>

        {feedback?.resources?.length > 0 && (
          <div className="flex flex-col gap-3 my-2">
            <h3>Suggested Resources</h3>
            <ul className="list-disc list-inside">
              {feedback.resources.map((resource, index) => (
                <li className="text-gray-600" key={index}>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="buttons">
          <Button className="btn-secondary flex-1 hover:bg-gray-50">
            <Link href="/" className="flex w-full justify-center">
              <p className="text-sm font-semibold text-white text-center">
                Back to dashboard
              </p>
            </Link>
          </Button>

          <Button className="btn-secondary flex-1 hover:bg-gray-50">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center"
            >
              <p className="text-sm font-semibold text-white text-center">
                Retake Interview
              </p>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Feedback;