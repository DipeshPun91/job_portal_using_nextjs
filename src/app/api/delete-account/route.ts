import { NextResponse } from 'next/server';
import User from '@/models/Users';
import Job from '@/models/Jobs';
import connect from '@/utils/db';

export async function DELETE(req: Request) {
  const { email } = await req.json();

  try {
    await connect();
    
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await Job.deleteMany({ userId: user._id });

    await User.findOneAndDelete({ email });

    return NextResponse.json({ message: "Account and associated jobs deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Account deletion error:", error.message);
      return NextResponse.json({ message: "Error deleting account", error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error during account deletion");
      return NextResponse.json({ message: "Unknown error during account deletion" }, { status: 500 });
    }
  }
}
