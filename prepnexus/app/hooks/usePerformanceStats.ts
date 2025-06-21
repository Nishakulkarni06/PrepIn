import { useEffect, useState } from "react";
import { getInterviewsByUserId, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getFeedbackByUser } from "@/lib/actions/general.action";


export const usePerformanceStats = (userId?: string | null) => {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    accuracy: 0,
    loading: true,
    chartData: {
      labels: [] as string[],
      scores: [] as number[],
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      // Step 1: Get all feedback interview IDs
      const feedbackRefs = await getFeedbackByUser(userId);
      if (!feedbackRefs || feedbackRefs.length === 0) {
        setStats({
          totalInterviews: 0,
          avgScore: 0,
          accuracy: 0,
          loading: false,
          chartData: { labels: [], scores: [] },
        });
        return;
      }
 // Step 2: For each interviewId, fetch the actual feedback
      const feedbacks = await Promise.all(
        feedbackRefs.map((ref: any) =>
          getFeedbackByInterviewId({ interviewId: ref.interviewId, userId })
        )
      );

    // Step 3: Extract valid feedback data
     const feedbackData = feedbacks
  .filter((f: any) => f?.totalScore != null && f?.createdAt != null)
  .map((f: any) => ({
    score: f.totalScore,
    date: new Date(f.createdAt),
  }))
  .sort((a, b) => a.date.getTime() - b.date.getTime()); // <-- Sort by date

const scores = feedbackData.map((f) => f.score);
const labels = feedbackData.map((f) =>
  f.date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })
);

const avgScore =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;
      const accuracy = avgScore;


      setStats({
  totalInterviews: feedbackData.length,
  avgScore: Number((avgScore / 10).toFixed(1)),
  accuracy: Number(accuracy.toFixed(1)),
  chartData: { labels, scores },
  loading: false,
});
    }

    fetchStats();
  }, [userId]);

  return stats;
};
