// import Image from "next/image";
// import { redirect } from "next/navigation";

// import Agent from "@/components/Agent";
// import { getCompanyLogo } from "@/lib/utils";
// import {
//   getFeedbackByInterviewId,
//   getInterviewById,
// } from "@/lib/actions/general.action";
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import DisplayTechIcons from "@/components/DisplayTechIcons";

// const InterviewDetails = async ({ params }: RouteParams) => {
//   const { id } = await params;

//   const user = await getCurrentUser();

//   const interview = await getInterviewById(id);
//   if (!interview) redirect("/");

//   const feedback = await getFeedbackByInterviewId({
//     interviewId: id,
//     userId: user?.id!,
//   });

//   return (
//     <div className="flex flex-col bg-white gap-8 p-8 rounded-lg shadow-md">
//       <div className="flex flex-row gap-4 justify-between">
//         <div className="flex flex-row gap-4 items-center max-sm:flex-col">
//           <div className="flex flex-row gap-4 items-center">
//             <Image
//               src={getCompanyLogo(interview.company)}
//               alt="cover-image"
//               width={40}
//               height={40}
//               className="rounded-full object-cover size-[40px]"
//             />
//             <h3 className="capitalize text-black font-sans">{interview.role} Interview</h3>
//           </div>

//           <DisplayTechIcons techStack={interview.techstack} /> 
//         </div>

//         <p className="bg-[#EDECEC] text-black text-bold px-4 py-2 rounded-md h-fit">
//           {interview.type}
//         </p>
//       </div>

//       <Agent
//         userName={user?.name!}
//         userId={user?.id}
//         interviewId={id}
//         type="interview"
//         questions={interview.questions}
//         feedbackId={feedback?.id}
//       />
//     </div>
//   );
// };

// export default InterviewDetails;

import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getCompanyLogo } from "@/lib/utils";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="flex flex-col bg-white gap-8 p-8 rounded-lg shadow-md">
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getCompanyLogo(interview.company)}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize text-black font-sans">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-[#EDECEC] text-black text-bold px-4 py-2 rounded-md h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />

      {interview.type === "DSA" ? (
        <a
          href={`/interview/${id}/coding/0`}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-bold"
        >
          Start Coding Interview
        </a>
      ) : (
        <a
          href={`/interview/${id}/`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-bold"
        >
          Start Interview
        </a>
      )}
    </div>
  );
};

export default InterviewDetails;