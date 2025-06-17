'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ChevronDownIcon } from '@heroicons/react/24/solid';





export default function AccountPage() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const router = useRouter();

  // Handlers
  const handlePasswordUpdate = () => {
    setShowPasswordInput((prev) => !prev);
  };

  const handleConfirmPassword = () => {
    alert('✅ Password successfully changed!');
    setShowPasswordInput(false);
    setNewPassword('');
  };

    const handleDeleteConfirm = () => {

    alert('🗑️ Account deleted successfully!');
    router.push('/home');
  };

  const handleCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-[#F4F0EB]">
      
      {/* Account Settings Header */}
      <div className="bg-white p-3 rounded-lg shadow-md font-medium text-gray-700">
        Account settings
      </div>

      {/* Change Password */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showPasswordInput ? (
    <ChevronDownIcon className="w-5 h-5 text-black" />
  ) : (
    <ChevronRightIcon className="w-5 h-5 text-black" />
  )}
            <span className="font-medium text-black">change password</span>
          </div>
          <button
            onClick={handlePasswordUpdate}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-700"
          >
            update
          </button>
        </div>

        {showPasswordInput && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <p className="text-black text-sm text-center">enter a new password.</p>
            <input
              type="password"
              placeholder="enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-b border-black bg-transparent text-center outline-none"
            />
            <button
              onClick={handleConfirmPassword}
              className="bg-green-400 text-white text-sm px-4 py-1 rounded-full hover:bg-green-500"
            >
              confirm
            </button>
          </div>
        )}
      </div>

      {/* Delete Account */}
       <div className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showDeleteConfirm ? (
    <ChevronDownIcon className="w-5 h-5 text-black" />
  ) : (
    <ChevronRightIcon className="w-5 h-5 text-black" />
  )}
          <span className="font-medium text-black">Delete Account</span>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-600 text-white text-sm px-3 py-1 rounded-full hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <p className="text-red-700 text-sm text-center">Are you sure you want to delete this account?</p>
          <div className="flex gap-4">
            <button
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white text-sm px-4 py-1 rounded-full hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-black text-sm px-4 py-1 rounded-full hover:bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
