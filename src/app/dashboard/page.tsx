import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Jobs from "@/app/components/Jobs";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SessionProvider from "@/utils/SessionProvider";
import { Session } from "next-auth";
import { Toaster } from "@/components/ui/toaster";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const user = (session as Session).user;

  return (
    <>
      <Toaster />
      <SessionProvider session={session}>
        <div>
          <Header />
          <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              {session && (
                <Link
                  href="/newlisting"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Post Job
                </Link>
              )}
            </div>

            {/* <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Welcome, {user?.name || "User"}!
              </h2>
              <p className="text-gray-500">User ID: {user?.id}</p>
            </div> */}

            <div className="bg-white shadow-md rounded-lg p-3">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Job Listings</h2>
              <Jobs />
            </div>
          </div>
        </div>
      </SessionProvider>
    </>
  );
};

export default Dashboard;
