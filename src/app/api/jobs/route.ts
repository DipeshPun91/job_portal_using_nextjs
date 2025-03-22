import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import JobModel from "@/models/Jobs";
import { authOptions } from "../auth/[...nextauth]/route";
import connect from "@/utils/db";

export async function GET(req: Request) {
  try {
    await connect();

    const session: Session | null = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const skip = (page - 1) * limit;

    let jobs;
    let totalJobs;

    if (!session || !session.user?.id) {
      jobs = await JobModel.find().skip(skip).limit(limit).lean();
      totalJobs = await JobModel.countDocuments(); 
    } else {
      const userId = session.user.id;
      jobs = await JobModel.find({ userId }).skip(skip).limit(limit).lean();
      totalJobs = await JobModel.countDocuments({ userId }); 
    }

    return NextResponse.json({ jobs, total: totalJobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
