import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(request: Request) {
  const formData = await request.formData();  
  let imageName = '';

  const image = formData.get('file') as File;
  
  if (image) {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    imageName = `${Date.now()}_${image.name}`;
    const imagePath = path.join(uploadsDir, imageName);
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);
  }

  return new NextResponse(JSON.stringify({ fileName: imageName }), { status: 200 });
}
