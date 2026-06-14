import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const dataFilePath = path.join(process.cwd(), 'data.json');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const appName = formData.get('appName') as string;
    const tags = formData.get('tags') as string;

    if (!file || !title || !appName) {
      return NextResponse.json({ error: '缺少必要字段' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'design_pics' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const cloudinaryId = (uploadResult as any).public_id;

    // 明确指定类型
    let data: { images: any[] } = { images: [] };
    try {
      const fileContent = await readFile(dataFilePath, 'utf-8');
      data = JSON.parse(fileContent) as { images: any[] };
    } catch (error) {
      // 文件不存在就使用默认空数组
    }

    const newImage = {
      id: Date.now().toString(),
      title,
      appName,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      cloudinaryId,
    };
    data.images.push(newImage);

    await writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: '上传失败：' + (error as Error).message }, { status: 500 });
  }
}