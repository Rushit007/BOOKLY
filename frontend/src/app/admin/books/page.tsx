'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Book, Category } from '@/types';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    isbn: '',
    publisher: '',
    description: '',
    price: 499,
    discount: 10,
    stock: 25,
    categoryId: '',
    coverImage: '',
  });

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [booksRes, catsRes] = await Promise.all([
        api.getBooks({ limit: 100, search, category: selectedCategory }),
        api.getCategories(),
      ]);
      setBooks(booksRes.data);
      setCategories(catsRes);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load catalog books' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory]);

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      subtitle: '',
      author: '',
      isbn: '978-' + Math.floor(1000000000 + Math.random() * 9000000000),
      publisher: 'Bookly Publications',
      description: '',
      price: 499,
      discount: 10,
      stock: 25,
      categoryId: categories[0]?.id || '',
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      subtitle: book.subtitle || '',
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher || 'Bookly Publications',
      description: book.description,
      price: book.price,
      discount: book.discount || 0,
      stock: book.stock,
      categoryId: book.categoryId,
      coverImage: book.coverImage || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.updateBook(editingBook.id, formData);
        setMessage({ type: 'success', text: `Volume "${formData.title}" updated successfully!` });
      } else {
        await api.createBook(formData);
        setMessage({ type: 'success', text: `Volume "${formData.title}" added to catalog!` });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to retire "${title}" from the catalog?`)) return;
    try {
      await api.deleteBook(id);
      setMessage({ type: 'success', text: `Volume "${title}" deleted from catalog` });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete operation failed' });
    }
  };

  const handleStockUpdate = async (bookId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await api.updateBook(bookId, { stock: newStock });
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, stock: newStock } : b))
      );
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Stock update failed: ' + err.message });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in font-sans">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500">
              CATALOG REPOSITORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[var(--text-main)] tracking-tight">
            Book Inventory & Editions
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Manage archival editions, pricing, discount rates, and warehouse stock levels.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--text-main)] text-[var(--bg-page)] rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 border-2 border-[var(--border-main)] shadow-[3px_3px_0px_var(--border-main)] transition cursor-pointer self-start sm:self-center"
        >
          <span>+</span>
          <span>Add New Edition</span>
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

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)]">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search titles, authors, or ISBN numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-[var(--bg-surface-elevated)] text-[var(--text-main)] placeholder:text-[var(--text-faint)] rounded-xl border-2 border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-mono shadow-xs"
          />
          <span className="w-4 h-4 absolute left-3 top-2.5 text-xs text-[var(--text-faint)]">🔍</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-[var(--text-faint)] hover:text-[var(--text-main)]"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 px-3.5 py-2.5 text-xs bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border-2 border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-mono font-bold shadow-xs cursor-pointer"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* ── Books Table ── */}
      <div className="rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-main)] shadow-[4px_4px_0px_var(--border-main)] overflow-hidden">
        {isLoading && books.length === 0 ? (
          <div className="p-12 text-center space-y-3 animate-pulse">
            <div className="w-8 h-8 mx-auto border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-[var(--text-muted)]">Scanning Archival Inventory...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-3xl">📚</p>
            <p className="font-serif text-lg font-bold text-[var(--text-main)]">No editions found matching query</p>
            <p className="text-xs text-[var(--text-muted)]">Try modifying your search or click &quot;Add New Edition&quot; above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[var(--bg-surface-elevated)] border-b-2 border-[var(--border-main)] text-[var(--text-faint)] font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4 font-bold">Volume Details</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Price & Discount</th>
                  <th className="py-3 px-4 font-bold">Warehouse Stock</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-[var(--bg-surface-elevated)]/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop'}
                        alt={book.title}
                        className="w-11 h-15 object-cover rounded-md border border-[var(--border-main)] shadow-xs shrink-0 bg-[var(--bg-surface-elevated)]"
                      />
                      <div className="min-w-0">
                        <p className="font-serif font-bold text-sm text-[var(--text-main)] line-clamp-1">{book.title}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{book.author}</p>
                        <p className="text-[10px] font-mono text-[var(--text-faint)]">ISBN: {book.isbn}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] font-mono text-[10px] font-bold">
                        {book.category?.name || 'Archival'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-serif font-black text-sm text-[var(--text-main)]">₹{book.price}</p>
                      {book.discount ? (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                          {book.discount}% OFF
                        </p>
                      ) : null}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStockUpdate(book.id, book.stock, -5)}
                          className="w-6 h-6 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-main)] text-[var(--text-main)] font-bold flex items-center justify-center text-xs border border-[var(--border-subtle)] cursor-pointer"
                          title="Subtract 5 units"
                        >
                          -
                        </button>
                        <span className={`px-2.5 py-0.5 rounded-full font-mono font-black text-[11px] min-w-[36px] text-center border ${
                          book.stock === 0
                            ? 'bg-rose-500 text-white border-rose-600'
                            : book.stock <= 5
                            ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/40'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        }`}>
                          {book.stock}
                        </span>
                        <button
                          onClick={() => handleStockUpdate(book.id, book.stock, 5)}
                          className="w-6 h-6 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-main)] text-[var(--text-main)] font-bold flex items-center justify-center text-xs border border-[var(--border-subtle)] cursor-pointer"
                          title="Add 5 units"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(book)}
                        className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-main)] text-[var(--text-main)] transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-500/20 transition cursor-pointer"
                      >
                        Retire
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal for Add / Edit Book ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[var(--bg-surface)] rounded-2xl p-6 sm:p-8 max-w-xl w-full border-2 border-[var(--border-main)] shadow-2xl my-8 animate-scale-in font-sans">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-main)]">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-amber-500">
                  METADATA COMPOSITION
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-[var(--text-main)]">
                  {editingBook ? 'Edit Archival Volume' : 'Add New Edition to Catalog'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-sans font-semibold"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">ISBN Serial *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none focus:border-amber-400 font-mono font-semibold cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 bg-[var(--bg-surface-elevated)] text-[var(--text-main)] rounded-xl border border-[var(--border-main)] focus:outline-none font-mono text-xs"
                  />
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Preview"
                      className="w-9 h-12 object-cover rounded border border-[var(--border-main)] shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono font-bold uppercase text-[10px] text-[var(--text-faint)] block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
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
                  {editingBook ? 'Save Edition' : 'Publish to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
