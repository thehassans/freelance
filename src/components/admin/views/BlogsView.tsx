import React, { useState, useEffect } from 'react';
import { storage } from '../../../lib/adminStorage';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { DEFAULT_BLOGS } from '../../../lib/adminSeedData';

export default function BlogsView({ showToast, typeFilter }: { showToast: (msg: string) => void, typeFilter: 'blogs' | 'sops' }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setBlogs(storage.get('fk_blogs') || DEFAULT_BLOGS);
  }, []);

  const saveBlogs = (newData: any[]) => {
    setBlogs(newData);
    storage.set('fk_blogs', newData);
    showToast('Saved successfully');
  };

  const deleteBlog = (id: string) => {
    if (confirm('Delete this item?')) {
      saveBlogs(blogs.filter(b => b.id !== id));
    }
  };

  // Filter based on typeFilter
  const filteredBlogs = blogs.filter(b => {
    if (typeFilter === 'blogs') {
      return !['SOP', 'GUIDE'].includes(b.type);
    } else {
      return ['SOP', 'GUIDE'].includes(b.type);
    }
  });

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {typeFilter === 'blogs' ? 'Blog Posts' : 'SOPs & Guides'}
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> New {typeFilter === 'blogs' ? 'Post' : 'SOP'}
        </button>
      </div>

      <div className="bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">TITLE</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">TYPE</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">STATUS</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">VIEWS</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">DATE</th>
              <th className="p-4 border-b border-slate-200 text-slate-500 text-xs font-mono tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map(blog => (
              <tr key={blog.id} className="border-b border-slate-200 hover:bg-[#252E4A]/30">
                <td className="p-4 text-slate-900 text-sm max-w-xs truncate">{blog.title}</td>
                <td className="p-4 text-slate-500 text-sm">{blog.type}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded tracking-widest ${blog.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-[#252E4A] text-slate-500'}`}>
                    {blog.status === 'published' ? '● Published' : '○ Draft'}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-sm font-mono">{blog.views || 0}</td>
                <td className="p-4 text-slate-500 text-sm">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '—'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 bg-[#252E4A] text-white rounded hover:bg-[#343F61] transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteBlog(blog.id)} className="p-1.5 bg-[#252E4A] text-[#F87171] rounded hover:bg-[#F87171]/20 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBlogs.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No {typeFilter === 'blogs' ? 'blog posts' : 'SOPs'} found.
          </div>
        )}
      </div>
    </div>
  );
}
