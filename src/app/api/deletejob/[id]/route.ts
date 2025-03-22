import { NextResponse } from 'next/server';
import connect from "@/utils/db";
import Job from "@/models/Jobs";
import { Types } from 'mongoose';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connect();

    const objectId = new Types.ObjectId(id);

    const result = await Job.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Job deleted successfully!' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Job not found!' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'An error occurred while deleting the job.' }, { status: 500 });
  }
}
