'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, Pencil } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from "@/lib/actions/auth.action";
import { toast } from 'sonner';

interface UserData {
  name: string;
  email: string;
  profileURL?: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setName(userData?.name || '');
      setEmail(userData?.email || '');
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    const success = await updateUserProfile({ name, email });
    if (success) {
      toast.success('Profile updated successfully');
      setUser((prev) => ({ ...prev!, name, email }));
      setIsEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F4F0EB]">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black">
            <User className="w-5 h-5 text-black" />
          </div>
          <span className="font-medium text-black">{user.name}</span>
        </div>
        <button
          className="flex items-center gap-1 text-black hover:text-blue-600"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"} <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md">
        {isEditing ? (
          <>
            <div>
              <label className="text-sm text-gray-700 font-semibold">Username</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-white"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 font-semibold">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black bg-white"
                placeholder="Enter your email"
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md self-start mt-4"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-black" />
              <span className="text-black"><strong>Username:</strong> {user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-black" />
              <span className="text-black"><strong>Email:</strong> {user.email}</span>
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-black" />
                <span className="text-black"><strong>Account created:</strong> {user.createdAt}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
