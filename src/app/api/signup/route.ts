import User from "@/models/Users";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";

export const POST = async (request: any) => {
  const { name, email, password } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });
  const existingName = await User.findOne({ name });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  if (existingName) {
    return new NextResponse("Name is already in use", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const otpSecret = process.env.OTP_SECRET;
  if (!otpSecret) {
    console.error("OTP_SECRET is not defined in environment variables.");
    return new NextResponse("Server configuration error. Please try again later.", { status: 500 });
  }

  const otp = speakeasy.totp({
    secret: otpSecret,
    encoding: "base32",
  });

  const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiresAt,
  });

  try {
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html:
        `<html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
              }
              .header h1 {
                font-size: 24px;
                margin: 0;
                color: #007bff;
              }
              .content {
                padding: 20px;
                line-height: 1.6;
              }
              .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #777;
              }
              .otp-code {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
              }
              .expiration {
                font-size: 14px;
                color: #888;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Our Service</h1>
              </div>
              <div class="content">
                <p>Dear User,</p>
                <p>Thank you for signing up. To complete your registration, please use the OTP code below:</p>
                <p class="otp-code">${otp}</p>
                <p class="expiration">The code will expire in ${process.env.OTP_EXPIRATION_MINUTES || 1} minutes.</p>
                <a href="#" class="button">Verify Your Email</a>
                <p>If you did not request this, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} JobHub. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>`
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully.");

    return new NextResponse("User is registered. OTP sent to email.", { status: 200 });
  } catch (err: any) {
    console.error("Error during registration or sending OTP email:", err);
    return new NextResponse("Error processing registration. Please try again later.", { status: 500 });
  }
};
