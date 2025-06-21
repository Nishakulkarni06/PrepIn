'use client';

import React, { useState } from 'react';
import { changePassword, deleteAccount, logout } from '@/firebase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // ✅ Handle password change with re-auth
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Enter current and new password');
      return;
    }

    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success('Password updated successfully');
      setShowPasswordInput(false);
      setCurrentPassword('');
      setNewPassword('');
    } else {
      toast.error(result.message || 'Failed to update password');
    }
  };

  // ✅ Handle account deletion with re-auth
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete || !deletePassword) return;

    setIsDeleting(true);
    const result = await deleteAccount(deletePassword);

    if (result.success) {
      toast.success('Account deleted successfully');
      await logout();
      router.push('/sign-in');
    } else {
      toast.error(result.message || 'Failed to delete account');
    }

    setIsDeleting(false);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Account Settings</h1>

      {/* Password Section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700">Change Password</h2>
        {!showPasswordInput ? (
          <button
            onClick={() => setShowPasswordInput(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        ) : (
          <div className="mt-3 space-y-2">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-black"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowPasswordInput(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-700">Danger Zone</h2>
        <input
          type="password"
          placeholder="Enter current password to confirm"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded text-black"
        />
        <button
          onClick={handleDeleteAccount}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
