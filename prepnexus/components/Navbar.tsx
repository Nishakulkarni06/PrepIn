"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCaretDown } from "react-icons/fa";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/firebase/client"; // ✅ Firebase client
import { signOut as serverSignOut } from "@/lib/actions/auth.action"; // ✅ Your server action

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);       // 1. Client-side sign out
      await serverSignOut();             // 2. Server-side session cookie deletion
      router.push("/sign-in");           // 3. Navigate to signup
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white px-6 py-3 shadow-md relative">
      <div className="flex items-center justify-between px-6">
        <a href="/" className="flex items-center space-x-1">
          <span className="text-2xl font-semibold text-black">Prep</span>
          <div className="bg-blue-600 text-white text-xl font-bold px-2 py-1 rounded-md">in</div>
        </a>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            role="button"
            tabIndex={0}
            className="flex items-center space-x-1 focus:outline-none cursor-pointer"
          >
            <Image src="/user.png" alt="Profile Avatar" width={32} height={32} className="rounded-full object-cover" />
            <FaCaretDown className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""} text-black`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
              <ul className="py-2 list-none">
                <li>
                  <a
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout(); // ✅ actual logout function
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
