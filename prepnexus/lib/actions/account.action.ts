"use server";
import { auth, db } from "@/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

// Fetch user profile from Firestore
export async function getUserProfile(uid: string) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      console.log("User profile not found for:", uid);
      return null;
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// Update user profile fields like name, role, etc.
export async function updateUserProfile(uid: string, data: { name?: string; role?: string }) {
  try {
    await db.collection("users").doc(uid).update({
      ...data,
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false };
  }
}

export async function deleteUserAccount(uid: string) {
  try {
    // 1. Delete user document from Firestore
    await db.collection("users").doc(uid).delete();

    // 2. Optionally delete related collections (interviews, feedback, etc.)
    const feedbacks = await db.collection("feedback").where("userId", "==", uid).get();
    const interviews = await db.collection("interviews").where("userId", "==", uid).get();

    const batch = db.batch();

    feedbacks.forEach(doc => batch.delete(doc.ref));
    interviews.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // 3. Delete user from Firebase Auth
    await auth.deleteUser(uid);

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return { success: false, error: error.message };
  }
}
