import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Job from '@/models/Jobs';
import { Types } from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connect();

    const objectId = new Types.ObjectId(id);
    const job = await Job.findById(objectId);

    if (job) {
      return NextResponse.json(job, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Job not found!' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ message: 'An error occurred while fetching the job.' }, { status: 500 });
  }
}
