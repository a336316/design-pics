import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// 配置 Cloudinary（使用环境变量）
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

    // 将文件转为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 上传到 Cloudinary
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

    // 读取现有的 data.json
    let data = { images: [] };
    try {
      const fileContent = await readFile(dataFilePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // 文件不存在就使用默认空数组
    }

    // 添加新图片信息
    const newImage = {
      id: Date.now().toString(),
      title,
      appName,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      cloudinaryId,
    };
    data.images.push(newImage);

    // 写回 data.json
    await writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: '上传失败：' + (error as Error).message }, { status: 500 });
  }
}