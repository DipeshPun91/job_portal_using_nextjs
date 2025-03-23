import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/Users';
import connect from '@/utils/db';

export async function POST(req: Request) {
  const { email, oldPassword, newPassword } = await req.json();
  
  try {
    await connect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Old password is incorrect" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ message: "Error updating password" }, { status: 500 });
  }
}
