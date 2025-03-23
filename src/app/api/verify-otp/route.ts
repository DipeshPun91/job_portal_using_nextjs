import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/Users';
import db from '@/utils/db';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    await db();

    const user = await User.findOne({
      email,
      otp,
      otpExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      console.error("Invalid OTP or OTP expired for email:", email);
      return NextResponse.json({ message: 'Invalid OTP or OTP expired' }, { status: 400 });
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    console.log("OTP verified successfully for email:", email);
    return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}
