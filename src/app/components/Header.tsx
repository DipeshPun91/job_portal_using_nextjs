"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const isOnDashboard = pathname === "/dashboard";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200"
        >
          JobHub
        </Link>

        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link
            href="/about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About Us
          </Link>
          <Link
            href="/blog"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Blog
          </Link>
          <Link
            href="/pages"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Pages
          </Link>
        </nav>

        <nav className="flex items-center gap-6">
          {!session ? (
            <>
              <Link
                href="/signin"
                className="py-2 px-4 text-gray-800 rounded-md hover:bg-gray-100 transition duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {!isOnDashboard && (
                <Link
                  href="/dashboard"
                  className="py-2 px-4 text-gray-800 rounded-md hover:bg-gray-100 transition duration-200"
                >
                  Dashboard
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center focus:outline-none"
                  aria-expanded={showProfileMenu}
                  aria-label="Toggle profile menu"
                >
                  <FaUserCircle size={30} className="text-blue-600 cursor-pointer" />
                </button>
                {showProfileMenu && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-72 bg-white p-5 shadow-md shadow-purple-200/50 rounded-md transform translate-x-2" 
                  >
                    <ul className="w-full flex flex-col gap-2">
                      <li className="text-center">
                        <FaUserCircle size={48} className="text-blue-600 mx-auto" />
                        <p className="text-sm text-gray-500 mt-4">
                          {session?.user?.email || "user@example.com"}
                        </p>
                      </li>

                      <hr className="border-t-2 border-blue-600 my-4" />

                      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
                        <Link href="/dashboard">
                          <button className="flex items-center gap-4 p-4 size-full group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
                            <svg
                              stroke="#000000"
                              className="icon glyph size-6 group-focus:fill-white group-focus:stroke-white"
                              id="dashboard-alt"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#000000"
                            >
                              <path d="M14,10V22H4a2,2,0,0,1-2-2V10Z"></path>
                              <path d="M22,10V20a2,2,0,0,1-2,2H16V10Z"></path>
                              <path d="M22,4V8H2V4A2,2,0,0,1,4,2H20A2,2,0,0,1,22,4Z"></path>
                            </svg>
                            Dashboard
                          </button>
                        </Link>
                      </li>
                      
                      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
                        <Link href="/profile">
                          <button className="flex items-center gap-4 p-4 size-full group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-gray-700 transition-all ease-linear">
                            <FaCog size={24} className="group-focus:fill-white" />
                            Settings
                          </button>
                        </Link>
                      </li>
                      
                      <li className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap">
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-4 p-4 size-full group font-semibold rounded-full bg-cover hover:bg-purple-100 hover:shadow-inner focus:bg-gradient-to-r from-purple-400 to-purple-600 focus:text-white text-red-600 transition-all ease-linear"
                        >
                          <FaSignOutAlt size={24} className="group-focus:fill-white" />
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
