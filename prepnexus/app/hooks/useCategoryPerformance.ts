import { useEffect, useState } from "react";
import {
  getFeedbackByUser,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";

type CategoryScore = {
  name: string;
  total: number;
  count: number;
};

export const useCategoryPerformance = (userId?: string | null) => {
  const [categoryData, setCategoryData] = useState<{
    labels: string[];
    values: number[];
  }>({
    labels: [],
    values: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchCategoryScores = async () => {
      // Step 1: Get feedback references by user
      const feedbackRefs = await getFeedbackByUser(userId);
      if (!feedbackRefs || feedbackRefs.length === 0) {
        setCategoryData({ labels: [], values: [] });
        setLoading(false);
        return;
      }

      // Step 2: Fetch each feedback
      const feedbacks = await Promise.all(
        feedbackRefs.map((ref: any) =>
          getFeedbackByInterviewId({ interviewId: ref.interviewId, userId })
        )
      );

      // Step 3: Build category score map
      const categoryMap: Record<string, CategoryScore> = {};

      feedbacks.forEach((fb) => {
        if (!fb?.categoryScores) return;

        fb.categoryScores.forEach((cat) => {
          if (!categoryMap[cat.name]) {
            categoryMap[cat.name] = { name: cat.name, total: 0, count: 0 };
          }

          categoryMap[cat.name].total += cat.score;
          categoryMap[cat.name].count += 1;
        });
      });

      // Step 4: Extract labels and average values
      const labels = Object.keys(categoryMap);
      const values = labels.map((label) =>
        Math.round(categoryMap[label].total / categoryMap[label].count)
      );

      setCategoryData({ labels, values });
      setLoading(false);
    };

    fetchCategoryScores();
  }, [userId]);

  return { categoryData, loading };
};
