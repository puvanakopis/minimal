'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { Product } from '@/data/products';
import AdminLoading from '../loading';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setName('');
    setPrice('');
    setCategory('Outerwear');
    setGender('unisex');
    setImage('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6');
    setDescription('');
    setFormError('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category || 'General');
    setGender(product.gender);
    setImage(product.image);
    setDescription(product.description || '');
    setFormError('');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category, gender, image, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to add product');
      } else {
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err) {
      setFormError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProduct.id, name, price, category, gender, image, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to update product');
      } else {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      setFormError('Network error. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Products</h1>
          <p className="text-xs text-gray-500 mt-1">Manage and edit your online store catalog</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-off-white">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Product</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Gender</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Price</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-off-white/50 transition-all duration-150">
                  <td className="p-4 flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="object-cover size-full" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1a1a1a]">{product.name}</h4>
                      <p className="text-[10px] text-gray-400">ID: {product.id}</p>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium text-gray-600">{product.category || 'General'}</td>
                  <td className="p-4">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {product.gender}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold text-[#1a1a1a]">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-rose-500 hover:border-rose-500 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODALS */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[500px] border border-[#e7f1f3] overflow-hidden shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-normal text-[#1a1a1a]">
                {showAddModal ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-[#1a1a1a] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold text-center">
                {formError}
              </div>
            )}

            <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Gender</label>
                    <select
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Image URL</label>
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : showAddModal ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
