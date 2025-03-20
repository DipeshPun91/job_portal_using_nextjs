'use client';
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Profile = () => {
  const { data: session, status } = useSession();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const checkPasswordStrength = (password: string) => {
    let strength = "Weak";
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria && uppercaseCriteria && lowercaseCriteria && numberCriteria && specialCharCriteria) {
      strength = "Strong";
    } else if (lengthCriteria && (uppercaseCriteria || lowercaseCriteria) && (numberCriteria || specialCharCriteria)) {
      strength = "Moderate";
    } else if (lengthCriteria) {
      strength = "Weak";
    }

    return strength;
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex-col gap-4 flex items-center justify-center">
          <div
            className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-green-600 rounded-full"
          >
            <div
              className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-cyan-600 rounded-full"
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <p>You need to be signed in to view your profile.</p>;
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "error",
      });
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session.user.email, 
          oldPassword, 
          newPassword: password 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Password updated successfully",
          variant: "success",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update password",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "error",
      });
    }
  };

  const handleAccountDelete = async () => {
    setShowModal(false);
    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Account deleted successfully",
          variant: "success",
        });
        signOut({ callbackUrl: '/' });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete account",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Account deletion error:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "error",
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  return (
    <section className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h2>
            <div className="flex flex-col items-center">
              <FaUserCircle size={90} className="text-blue-600 mb-2" />
              <p className="text-lg font-semibold">
                {session.user.name || "User Name"}
              </p>
              <p className="text-sm text-gray-500">
                {session.user.email || "john.doe@example.com"}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="old-password" className="block text-sm font-medium text-gray-600 mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    id="old-password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                    className="block w-full px-4 py-2 text-black bg-gray-100 border border-gray-300 rounded-md placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="block w-full px-4 py-2 text-black bg-gray-100 border border-gray-300 rounded-md placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <p className={`mt-2 text-sm ${passwordStrength === "Strong" ? "text-green-600" : passwordStrength === "Moderate" ? "text-yellow-600" : "text-red-600"}`}>
                    {password && (passwordStrength === "Strong" ? "Password is strong" : passwordStrength === "Moderate" ? "Password is moderate" : "Password is weak")}
                  </p>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="block w-full px-4 py-2 text-black bg-gray-100 border border-gray-300 rounded-md placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delete Account</h2>
            <button
              onClick={() => setShowModal(true)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      aria-hidden="true"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-6 w-6 text-red-600"
                    >
                      <path
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      id="modal-title"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Delete account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to Delete your account? All of your
                        data will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={handleAccountDelete}
                  type="button"
                >
                  Delete
                </button>
                <button
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={() => setShowModal(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </section>
  );
};

export default Profile;
