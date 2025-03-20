"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

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

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.status === 400) {
        setEmailError("This email is already registered");
      } else if (res.status === 200) {
        setError("");
        setIsOtpStep(true);

        toast({
          title: "Success",
          description: "Sign-up successful! Please enter the OTP.",
          variant: "success",
        });
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (res.status === 200) {
        setError("");
        router.push("/signin");
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (error) {
      setError("Error verifying OTP, try again");
      console.log(error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  if (sessionStatus === "loading") {
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

  return (
    sessionStatus !== "authenticated" && (
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            {isOtpStep ? "Please verify your account" : "Sign Up to create your account"}
          </h2>

          {isOtpStep ? (
            <form onSubmit={handleOtpSubmit} className="otp-form bg-white shadow-md rounded-lg p-6 w-full h-72 flex flex-col items-center justify-center gap-5 relative">
              <span className="mainHeading text-lg font-bold text-gray-900">Enter OTP</span>
              <p className="otpSubheading text-xs text-center text-black leading-tight">
                We have sent a verification code to your email address.
              </p>
              <div className="inputContainer flex gap-3 justify-center items-center w-full">
                <input
                  required
                  placeholder="Enter OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="otp-input bg-gray-200 w-full h-8 text-center rounded-md border-none outline-none font-semibold text-gray-700 focus:bg-blue-100 transition duration-300 ease-in-out"
                />
              </div>
              <button
                type="submit"
                className="verifyButton w-full h-8 bg-blue-500 text-white font-semibold rounded-md transition duration-200 ease-in-out hover:bg-blue-600"
              >
                Verify
              </button>
              {/* <p className="resendNote text-xs text-center text-black flex flex-col items-center justify-center gap-1">
                Didn't receive the code?
                <button
                  type="button"
                  className="resendBtn text-blue-500 font-bold cursor-pointer hover:underline"
                >
                  Resend Code
                </button>
              </p> */}
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="mt-8" method="POST" action="#">
              <div className="space-y-5">
                <div>
                  <label className="text-base font-medium text-gray-900">Name</label>
                  <div className="mt-2">
                    <input
                      placeholder="Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1"
                    />
                  </div>
                  {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">Email address</label>
                  <div className="mt-2">
                    <input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1"
                    />
                  </div>
                  {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">Password</label>
                  <div className="mt-2">
                    <input
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1"
                    />
                  </div>
                  <p className={`mt-2 text-sm ${passwordStrength === "Strong" ? "text-green-600" : passwordStrength === "Moderate" ? "text-yellow-600" : "text-red-600"}`}>
                    {password && (passwordStrength === "Strong" ? "Password is strong" : passwordStrength === "Moderate" ? "Password is moderate" : "Password is weak")}
                  </p>
                  {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">Confirm Password</label>
                  <div className="mt-2">
                    <input
                      placeholder="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1"
                    />
                  </div>
                  {confirmPasswordError && <p className="text-red-600 text-sm">{confirmPasswordError}</p>}
                </div>
                {error && <p className="text-red-600 text-[16px]">{error}</p>}
                <div>
                  <button
                    className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    type="submit"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    )
  );
}
