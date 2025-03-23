import { NextRequest, NextResponse } from 'next/server';
import connect from '@/utils/db';
import Job from '@/models/Jobs';
import { Types } from 'mongoose';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connect();

    const objectId = new Types.ObjectId(id);
    const updateData = await request.json();

    const updatedJob = await Job.findByIdAndUpdate(objectId, updateData, { new: true });

    if (updatedJob) {
      return NextResponse.json(updatedJob, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Job not found!' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'An error occurred while updating the job.' }, { status: 500 });
  }
}
