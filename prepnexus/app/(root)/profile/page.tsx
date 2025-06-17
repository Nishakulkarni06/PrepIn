'use client';

import React from 'react';
import { User, Mail, Calendar, Pencil } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F4F0EB] ">
      
      {/* Header with avatar, name, and Edit button */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black">
            <User className="w-5 h-5 text-black" />
          </div>
          <span className="font-medium text-black">test User</span>
        </div>
        <button className="flex items-center gap-1  text-black hover:text-blue-600">
          Edit Profile <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* User Details */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-black" />
          <span className="text-black"><strong>Username:</strong> test12</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-black" />
          <span className="text-black"><strong>Email:</strong> test12@gmail.com</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-black" />
          <span className="text-black"><strong>Account created:</strong> 14 June 2025</span>
        </div>
      </div>
    </div>
  );
}
