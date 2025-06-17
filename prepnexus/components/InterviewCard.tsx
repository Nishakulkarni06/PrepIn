import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";

import { getCompanyLogo } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  company,
}: InterviewCardProps & { company: string }) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const isFeedbackAvailable = !!feedback;
  const logoSrc = getCompanyLogo(company);

  return (
    <div className="w-[450px] rounded-md overflow-hidden shadow-md bg-[#ece8e2] flex flex-col items-center">
      {/* Top section with logo */}
      <div className="bg-[#566779] w-full h-20 relative flex justify-center items-end">
        <div className="absolute -bottom-6 w-[64px] h-[64px] rounded-full bg-white flex items-center justify-center shadow-lg">
          <Image
            src={logoSrc}
            alt="Company Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      <div className="pt-10 pb-4 flex flex-col items-center">
        {/* Type and Role */}
        <p className="text-gray-700 font-semibold text-md text-center">
          {type} - {role}
        </p>

        {/* Feedback Score and Date */}
        <p className="text-sm text-gray-500 mt-1">
          {formattedDate} | Score: {feedback?.totalScore ?? "---"}/100
        </p>

        {/* Button */}
        <Link
          href={
            isFeedbackAvailable
              ? `/interview/${interviewId}/feedback`
              : `/interview/${interviewId}/preview`
          }
        >
          <Button className="mt-4 bg-[#566779] hover:bg-[#445262] text-white text-sm">
            {isFeedbackAvailable ? "Check Feedback" : "Take Interview"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;