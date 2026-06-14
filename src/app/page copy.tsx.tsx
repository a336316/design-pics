"use client";
import { CldImage } from 'next-cloudinary';

// 模拟的竞品图片数据（后续你会改成自己上传的）
const demoImages = [
  {
    id: '1',
    title: '微信朋友圈-卡片式设计',
    appName: '微信',
    tags: ['社交', '卡片', 'iOS'],
    cloudinaryId: '生成绵绵打哈欠图片_dsy9mc',
  },
  {
    id: '2',
    title: '抖音全屏沉浸式播放页',
    appName: '抖音',
    tags: ['短视频', '全屏', '沉浸式'],
    cloudinaryId: '生成绵绵打哈欠图片_dsy9mc',
  },
  {
    id: '3',
    title: '淘宝商品详情页',
    appName: '淘宝',
    tags: ['电商', '商品卡', '红色'],
    cloudinaryId: '生成绵绵打哈欠图片_dsy9mc',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 页头 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">📱 竞品图片库</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            + 上传图片（仅管理员）
          </button>
        </div>
      </header>

      {/* 筛选栏 */}
      <div className="sticky top-[73px] z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {['全部', '社交', '电商', '短视频', '金融'].map((tag) => (
            <button
              key={tag}
              className="px-4 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 图片网格 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {demoImages.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <div className="relative aspect-[9/16]">
                <CldImage
                  src={img.cloudinaryId}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  alt={img.title}
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {img.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{img.appName}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {img.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}