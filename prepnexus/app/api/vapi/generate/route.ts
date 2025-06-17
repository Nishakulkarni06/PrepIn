import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET(){
    return Response.json({ success: true, data: 'THANK YOU!' },{ status:200 });
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid, company } = await request.json();

    try{
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt:`Generate a list of interview questions tailored for the following job role:

            - Company: ${company}
            - Role: ${role}
            - Experience Level: ${level}
            - Tech Stack: ${techstack}
            - Focus: ${type} (either DSA, System Design, or behavioral)
            - Number of Questions: ${amount}

            Guidelines:
            - Questions should reflect the kind typically asked by ${company}.
            - Avoid using special characters like "/", "*", or any symbols that may break a voice assistant.
            - Format the response strictly as a JSON array of strings, e.g.:
            ["Question 1", "Question 2", "Question 3"]
            - Do not include any extra commentary, explanation, or markdown formatting.

            The questions will be spoken aloud by a voice assistant, so ensure they are concise and clearly worded.
            Only return a raw JSON array of questions. Do not include code fences or Markdown formatting.

            Thank you 
            `,
        })

        const interview = {
            company: company,
            role: role,
            type: type,
            level: level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions.replace(/```json/g, '').replace(/```/g, '').trim()),
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        }

        await db.collection("interviews").add(interview);

        return Response.json({ success: true}, { status: 200 });
    }
    catch (error){
        console.error("Error:",error);
        return Response.json({ success: false, error: error }, { status: 500 });
    }
}