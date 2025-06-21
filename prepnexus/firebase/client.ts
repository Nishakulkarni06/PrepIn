import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  updatePassword,
  deleteUser,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAbW7x_phtbAG83dH7JROAF-x-hwjvIJQ",
  authDomain: "prepnexus-b9328.firebaseapp.com",
  projectId: "prepnexus-b9328",
  storageBucket: "prepnexus-b9328.appspot.com",
  messagingSenderId: "905643568779",
  appId: "1:905643568779:web:9aa9d37eb1f39716a8ee8e",
  measurementId: "G-YVQFD0QLDX"
};

// ✅ Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Change password (with re-authentication)
export async function changePassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    return { success: false, message: "No user is logged in." };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error: any) {
    console.error("Password update error:", error);
    return { success: false, message: error.message };
  }
}

// ✅ Delete account (with re-authentication)
export async function deleteAccount(currentPassword: string) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    return { success: false, message: "No user is logged in." };
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await deleteUser(user);
    return { success: true };
  } catch (error: any) {
    console.error("Account deletion failed:", error);
    return { success: false, message: error.message };
  }
}

// ✅ Logout
export async function logout() {
  try {
    await signOut(auth);
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
