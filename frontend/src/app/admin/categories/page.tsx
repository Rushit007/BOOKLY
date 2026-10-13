'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.getCategories();
      setCategories(res);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load categories' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : slugVal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        setMessage({ type: 'success', text: `Genre "${formData.name}" updated successfully` });
      } else {
        await api.createCategory(formData);
        setMessage({ type: 'success', text: `Genre "${formData.name}" established in taxonomy` });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to retire genre "${name}"? Books in this category may need reassignment.`)) return;
    try {
      await api.deleteCategory(id);
      setMessage({ type: 'success', text: `Genre "${name}" deleted` });
      loadCategories();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete operation failed' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF66B3]">
              LITERARY TAXONOMY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-main)] tracking-tight">
            Categories & Genres
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Organize catalog volumes into genres, disciplines, and curatorial themes.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--text-main)] text-[var(--bg-page)] rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 border-2 border-[var(--border-main)] shadow-[3px_3px_0px_var(--border-main)] transition cursor-pointer self-start sm:self-center"
        >
          <span>+</span>
          <span>Create Genre</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border-2 animate-scale-in ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100 cursor-pointer">✕</button>
        </div>
      )}

      {/* ── Categories Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-black text-lg text-[var(--text-main)]">{cat.name}</h3>
                <span className="font-mono text-[10px] text-amber-500 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  /{cat.slug}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-3 mb-5 leading-relaxed">
                {cat.description || 'Curated physical editions cataloged under this archival genre.'}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)] text-xs">
              <button
                onClick={() => openEditModal(cat)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-main)] font-mono font-bold text-[10px] text-[var(--text-main)] transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-500/20 font-mono font-bold text-[10px] transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--bg-surface)] rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-[var(--border-main)] shadow-2xl animate-scale-in font-sans">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-main)]">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-500">
                  GENRE DEFINITION
                </span>
                <h2 className="text-xl font-serif font-black text-[var(--text-main)]">
                  {editingCategory ? 'Edit Category' : 'Establish New Category'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-main)] text-sm font-bold flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5 text-xs">
              <div>
                <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Genre Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-sans font-semibold"
                />
              </div>

              <div>
                <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Slug URL Identifier *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-[var(--border-main)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] font-mono font-bold uppercase text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--text-main)] text-[var(--bg-page)] font-mono font-bold uppercase text-[11px] hover:opacity-90 border-2 border-[var(--border-main)] shadow-[3px_3px_0px_var(--border-main)] cursor-pointer"
                >
                  {editingCategory ? 'Update Genre' : 'Save Genre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
