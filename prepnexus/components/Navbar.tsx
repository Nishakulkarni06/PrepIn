"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa"


export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white px-6 py-3 shadow-md relative">
      <div className="flex items-center justify-between px-6">
        {/* Left Logo */}
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-2xl font-semibold text-black">Prep</span>
          <div className="bg-blue-600 text-white text-xl font-bold px-2 py-1 rounded-md">
            in
          </div>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
           <div
  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  role="button"
  tabIndex={0}
  className="flex items-center space-x-1 focus:outline-none cursor-pointer"
>
  <Image
    src="/user.png"
    alt="Profile Avatar"
    width={32}
    height={32}
    className="rounded-full object-cover"
  />
  <FaCaretDown
    className={`transition-transform duration-200 ${
      isDropdownOpen ? "rotate-180" : ""
    } text-black`} 
  />
</div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
              <ul className="py-2 list-none">
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
