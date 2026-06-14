"use client";

import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react';

type ImageItem = {
  id: string;
  title: string;
  appName: string;
  tags: string[];
  cloudinaryId: string;
};

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [appName, setAppName] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !appName) {
      alert('请完整填写标题、应用名称并选择图片');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('appName', appName);
    formData.append('tags', tags);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('上传成功！');
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        alert('上传失败：' + (err.error || '未知错误'));
      }
    } catch (error) {
      alert('网络错误，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">上传竞品截图</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">标题</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">应用名称</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">标签（逗号分隔）</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="社交, 电商, iOS"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">截图</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">取消</button>
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {uploading ? '上传中...' : '上传'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedTag, setSelectedTag] = useState('全部');

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('获取图片失败', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = selectedTag === '全部'
    ? images
    : images.filter(img => img.tags.includes(selectedTag));

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">📱 竞品图片库</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + 上传图片（仅管理员）
          </button>
        </div>
      </header>

      <div className="sticky top-[73px] z-10 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {['全部', '社交', '电商', '短视频', '金融'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredImages.length === 0 ? (
          <div className="text-center text-gray-500 py-20">暂无图片，点击上方按钮上传第一张</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img) => (
              <div key={img.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
                <div className="relative aspect-[9/16]">
                  {/* 使用 CldImage 组件显示 Cloudinary 图片 */}
                  <CldImage
                    src={img.cloudinaryId}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    alt={img.title}
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{img.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{img.appName}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {img.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => fetchImages()}
        />
      )}
    </main>
  );
}