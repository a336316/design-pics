import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  // data.json 的路径（项目根目录）
  const dataFilePath = path.join(process.cwd(), 'data.json');
  
  try {
    // 读取 data.json 文件内容
    const fileContent = await readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    // 返回 images 数组（如果没有则为空数组）
    return NextResponse.json({ images: data.images || [] });
  } catch (error) {
    // 如果文件不存在或读取失败，返回空数组
    return NextResponse.json({ images: [] });
  }
}