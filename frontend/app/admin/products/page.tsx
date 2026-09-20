'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, X, Loader2, UploadCloud, Eye, ExternalLink, Star, Tag, Layers, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/interfaces';
import { productService } from '@/services';
import { getImageUrl } from '@/helper/image';
import AdminLoading from '../loading';

interface ImageEntry {
  id: string;
  file?: File;
  previewUrl: string;
  existingUrl?: string;
}

const CATEGORY_OPTIONS = [
  'Tops',
  'Trousers',
  'Denim',
  'Knitwear',
  'Accessories',
  'Loungewear',
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categorySelection, setCategorySelection] = useState<string>('Tops');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [imagesList, setImagesList] = useState<ImageEntry[]>([]);
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await productService.adminGetProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setName('');
    setPrice('');
    setCategorySelection('Tops');
    setCustomCategory('');
    setGender('men');
    setImagesList([]);
    setDescription('');
    setFormError('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    const prodCat = product.category || 'Tops';
    if (CATEGORY_OPTIONS.includes(prodCat)) {
      setCategorySelection(prodCat);
      setCustomCategory('');
    } else {
      setCategorySelection('Other');
      setCustomCategory(prodCat);
    }
    setGender(product.gender === 'women' ? 'women' : 'men');

    const initialImages: ImageEntry[] = [];
    if (product.images && product.images.length > 0) {
      product.images.slice(0, MAX_IMAGES).forEach((img, idx) => {
        initialImages.push({
          id: `existing-${idx}-${Date.now()}`,
          previewUrl: getImageUrl(img),
          existingUrl: img,
        });
      });
    } else if (product.image) {
      initialImages.push({
        id: `existing-0-${Date.now()}`,
        previewUrl: getImageUrl(product.image),
        existingUrl: product.image,
      });
    }

    setImagesList(initialImages);
    setDescription(product.description || '');
    setFormError('');
  };

  const handleOpenViewModal = (product: Product) => {
    setViewingProduct(product);
    setActivePreviewIndex(0);
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = MAX_IMAGES - imagesList.length;
    if (availableSlots <= 0) {
      setFormError(`Maximum limit of ${MAX_IMAGES} images reached.`);
      return;
    }

    const selectedFiles = Array.from(files).slice(0, availableSlots);
    const newEntries: ImageEntry[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select valid image files only (PNG, JPG, WEBP, GIF, SVG).');
        continue;
      }
      newEntries.push({
        id: `file-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (files.length > availableSlots) {
      setFormError(`Only ${availableSlots} more image(s) could be added (max ${MAX_IMAGES} images).`);
    } else {
      setFormError('');
    }

    setImagesList((prev) => [...prev, ...newEntries].slice(0, MAX_IMAGES));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    setImagesList((prev) => prev.filter((img) => img.id !== id));
    setFormError('');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (imagesList.length === 0) {
      setFormError('Please upload at least 1 product image.');
      return;
    }

    if (imagesList.length > MAX_IMAGES) {
      setFormError(`A maximum of ${MAX_IMAGES} images is allowed per product.`);
      return;
    }

    setSubmitting(true);

    try {
      const uploadedUrls: string[] = [];

      for (const item of imagesList) {
        if (item.file) {
          const uploadRes = await productService.uploadImage(item.file);
          if (!uploadRes.success || !uploadRes.data?.imageUrl) {
            throw new Error(uploadRes.message || 'Failed to upload product image');
          }
          uploadedUrls.push(uploadRes.data.imageUrl);
        } else if (item.existingUrl) {
          uploadedUrls.push(item.existingUrl);
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error('No valid images were uploaded.');
      }

      const primaryImage = uploadedUrls[0];
      const finalCategory = (categorySelection === 'Other' ? customCategory.trim() : categorySelection) || 'General';

      const response = await productService.adminCreateProduct({
        name,
        price: parseFloat(price) || 0,
        category: finalCategory,
        gender,
        image: primaryImage,
        mainImage: primaryImage,
        images: uploadedUrls,
        description,
      });

      if (!response.success) {
        setFormError(response.message || 'Failed to add product');
      } else {
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err: any) {
      setFormError(err.message || 'Error creating product. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setFormError('');

    if (imagesList.length === 0) {
      setFormError('Please upload at least 1 product image.');
      return;
    }

    if (imagesList.length > MAX_IMAGES) {
      setFormError(`A maximum of ${MAX_IMAGES} images is allowed per product.`);
      return;
    }

    setSubmitting(true);

    try {
      const finalImageUrls: string[] = [];

      for (const item of imagesList) {
        if (item.file) {
          const uploadRes = await productService.uploadImage(item.file);
          if (!uploadRes.success || !uploadRes.data?.imageUrl) {
            throw new Error(uploadRes.message || 'Failed to upload product image');
          }
          finalImageUrls.push(uploadRes.data.imageUrl);
        } else if (item.existingUrl) {
          finalImageUrls.push(item.existingUrl);
        }
      }

      const primaryImage = finalImageUrls.length > 0 ? finalImageUrls[0] : editingProduct.image;
      const finalCategory = (categorySelection === 'Other' ? customCategory.trim() : categorySelection) || 'General';

      const response = await productService.adminUpdateProduct(editingProduct.id, {
        name,
        price: parseFloat(price) || 0,
        category: finalCategory,
        gender,
        image: primaryImage,
        mainImage: primaryImage,
        images: finalImageUrls,
        description,
      });

      if (!response.success) {
        setFormError(response.message || 'Failed to update product');
      } else {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err: any) {
      setFormError(err.message || 'Error updating product. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await productService.adminDeleteProduct(id);
      if (response.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  // Extract gallery images for view modal
  const viewGalleryImages = viewingProduct?.images && viewingProduct.images.length > 0
    ? viewingProduct.images
    : viewingProduct?.image
      ? [viewingProduct.image]
      : [];

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Products</h1>
          <p className="text-xs text-gray-500 mt-1">Manage and inspect your online store catalog</p>
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
              {products.map((product) => {
                const totalImages = (product.images && product.images.length) || (product.image ? 1 : 0);
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-off-white/50 transition-all duration-150">
                    <td className="p-4 flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100 flex-shrink-0">
                        <img src={getImageUrl(product.image)} alt={product.name} className="object-cover size-full" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1a1a1a]">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-gray-400">ID: {product.id}</p>
                          <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded font-medium">
                            {totalImages} {totalImages === 1 ? 'image' : 'images'}
                          </span>
                        </div>
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
                        {/* VIEW PRODUCT BUTTON */}
                        <button
                          onClick={() => handleOpenViewModal(product)}
                          className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors cursor-pointer"
                          title="View Product Details"
                        >
                          <Eye size={14} />
                        </button>
                        {/* EDIT PRODUCT BUTTON */}
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        {/* DELETE PRODUCT BUTTON */}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PRODUCT DETAILS MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[720px] border border-[#e7f1f3] overflow-hidden shadow-2xl p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">Product Inspection</span>
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a]">{viewingProduct.name}</h3>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* GALLERY & MAIN DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IMAGE CAROUSEL / VIEWER */}
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center relative">
                  {viewGalleryImages.length > 0 ? (
                    <img
                      src={getImageUrl(viewGalleryImages[activePreviewIndex] || viewingProduct.image)}
                      alt={viewingProduct.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">No image available</div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                    {activePreviewIndex + 1} / {viewGalleryImages.length || 1}
                  </span>
                </div>

                {/* THUMBNAILS */}
                {viewGalleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {viewGalleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePreviewIndex(idx)}
                        className={`size-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                          activePreviewIndex === idx
                            ? 'border-brand-teal ring-2 ring-brand-teal/20'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={getImageUrl(img)} alt={`Thumb ${idx + 1}`} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* DETAILS COLUMN */}
              <div className="space-y-4 text-xs text-gray-600">
                <div className="p-4 bg-off-white rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold text-[#1a1a1a]">${viewingProduct.price.toFixed(2)}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal">
                      {viewingProduct.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                    <span>Category: <strong className="text-gray-800">{viewingProduct.category || 'General'}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <strong className="text-gray-800">{viewingProduct.rating || 0}</strong> ({viewingProduct.reviewCount || 0} reviews)
                    </span>
                  </div>
                  {viewingProduct.slug && (
                    <div className="text-[11px] text-gray-400 pt-1 border-t border-gray-200/60 truncate">
                      Slug: <code className="text-gray-600">{viewingProduct.slug}</code>
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-1">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {viewingProduct.description || 'No description provided.'}
                  </p>
                </div>

                {/* SIZES */}
                {viewingProduct.sizes && viewingProduct.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Available Sizes</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {viewingProduct.sizes.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* COLORS */}
                {viewingProduct.colors && viewingProduct.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Color Variants</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingProduct.colors.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs">
                          <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                          <span className="font-medium text-gray-700">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DETAILS LIST */}
                {viewingProduct.details && viewingProduct.details.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Details & Highlights</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-600 text-[11px]">
                      {viewingProduct.details.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Link
                href={`/products/${viewingProduct.id}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:underline"
              >
                <span>View on Storefront</span>
                <ExternalLink size={14} />
              </Link>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewingProduct(null)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prod = viewingProduct;
                    setViewingProduct(null);
                    handleOpenEditModal(prod);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow transition cursor-pointer"
                >
                  <Edit size={14} />
                  <span>Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODALS */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[560px] border border-[#e7f1f3] overflow-hidden shadow-2xl p-8 space-y-6 max-h-[92vh] overflow-y-auto">
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
                    placeholder="e.g. Structured Wool Overcoat"
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
                      placeholder="0.00"
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
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</label>
                    <select
                      value={categorySelection}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategorySelection(val);
                        if (val !== 'Other') {
                          setCustomCategory('');
                        }
                      }}
                      className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Other">Other (Custom Category)</option>
                    </select>
                  </div>

                  {categorySelection === 'Other' && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Custom Category Name</label>
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter category name (e.g. Footwear, Outerwear)"
                        className="w-full bg-off-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-[#1a1a1a]"
                      />
                    </div>
                  )}
                </div>

                {/* MULTI-IMAGE UPLOADER (UP TO 5 IMAGES) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      Product Images ({imagesList.length}/{MAX_IMAGES} max) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">1st image will be the primary cover</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFilesSelect}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  {/* GALLERY GRID */}
                  <div className="grid grid-cols-5 gap-2.5">
                    {imagesList.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative group aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center"
                      >
                        <img
                          src={img.previewUrl}
                          alt={`Product preview ${index + 1}`}
                          className="size-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-brand-teal text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[9px] font-bold cursor-pointer"
                        >
                          <Trash2 size={16} className="text-rose-400" />
                          <span>Remove</span>
                        </button>
                      </div>
                    ))}

                    {/* UPLOAD TRIGGER BUTTON */}
                    {imagesList.length < MAX_IMAGES && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-200 hover:border-brand-teal rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-off-white/50 hover:bg-off-white transition-all text-gray-400 hover:text-brand-teal p-2 text-center group"
                      >
                        <UploadCloud size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          + Add ({imagesList.length}/{MAX_IMAGES})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed product description..."
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
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>{showAddModal ? 'Uploading & Creating...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <span>{showAddModal ? 'Create Product' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
