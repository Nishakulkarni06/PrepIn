"use server";

import { db } from "@/firebase/admin";

export async function saveCodingSession(params: {
  interviewId: string;
  problemIndex: number;
  code: string;
  testResults: any[];
  completed: boolean;
}) {
  const { interviewId, problemIndex, code, testResults, completed } = params;

  try {
    const sessionRef = db.collection("coding_sessions").doc();
    
    await sessionRef.set({
      interviewId,
      problemIndex,
      code,
      testResults,
      completed,
      timestamp: new Date().toISOString(),
    });

    return { success: true, sessionId: sessionRef.id };
  } catch (error) {
    console.error("Error saving coding session:", error);
    return { success: false };
  }
}

export async function getCodingSession(interviewId: string, problemIndex: number) {
  try {
    const querySnapshot = await db
      .collection("coding_sessions")
      .where("interviewId", "==", interviewId)
      .where("problemIndex", "==", problemIndex)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error getting coding session:", error);
    return null;
  }
}