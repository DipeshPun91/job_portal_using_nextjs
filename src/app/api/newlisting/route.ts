import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import JobModel from '@/models/Jobs';
import fs from 'fs';
import path from 'path';
import connect from "@/utils/db";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function POST(req: NextRequest) {
  await connect();

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      const title = formData.get('title') as string;
      const organization = formData.get('organization') as string;
      const remote = formData.get('remote') === 'yes';
      const city = formData.get('city') as string;
      const country = formData.get('country') as string;
      const jobType = formData.get('jobType') as string;
      const description = formData.get('description') as string;
      const userId = formData.get('userId') as string;

      if (!userId || !isValidObjectId(userId)) {
        return NextResponse.json({ error: 'Invalid or missing user ID' }, { status: 400 });
      }

      let imageUrl = '';
      const image = formData.get('image') as File;

      if (image) {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        imageUrl = `${Date.now()}_${image.name}`;
        const imagePath = path.join(uploadsDir, imageUrl);

        const imageBuffer = Buffer.from(await image.arrayBuffer());
        fs.writeFileSync(imagePath, imageBuffer);
      }

      const newJob = new JobModel({
        title,
        organization,
        image: imageUrl, 
        city,
        country,
        remote,
        jobType, 
        description,
        userId,
      });

      await newJob.save();
      return NextResponse.json({ message: 'Job added successfully', job: newJob });

    } catch (error) {
      console.error('Error adding job:', error);
      const errorMessage = (error as Error).message || 'Failed to add job';
      return NextResponse.json({ error: errorMessage, details: errorMessage }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }
}
