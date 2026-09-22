'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  UploadCloud,
  Loader2,
  Star,
  ExternalLink,
  Tag,
  Layers,
  CheckCircle2,
  Package,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/interfaces';
import { useProducts } from '@/context';
import { getImageUrl } from '@/helper/image';
import { notify } from '@/helper/toast';
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

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size'];

export default function AdminProducts() {
  const {
    adminGetProducts,
    uploadImage,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
  } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  // Modals state
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
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await adminGetProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch products';
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Unique category list from existing products + defaults
  const availableCategories = useMemo(() => {
    const cats = new Set<string>(CATEGORY_OPTIONS);
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.category || ''} ${product.description || ''} ${product.id}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' ||
        product.category?.toLowerCase() === categoryFilter.toLowerCase();

      const matchesGender =
        genderFilter === 'all' ||
        product.gender?.toLowerCase() === genderFilter.toLowerCase();

      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [products, searchQuery, categoryFilter, genderFilter]);

  // Key Metrics
  const metrics = useMemo(() => {
    const totalCount = products.length;
    let menCount = 0;
    let womenCount = 0;
    const categoriesSet = new Set<string>();

    products.forEach((p) => {
      if (p.gender?.toLowerCase() === 'men') menCount++;
      else if (p.gender?.toLowerCase() === 'women') womenCount++;
      if (p.category) categoriesSet.add(p.category);
    });

    return {
      totalCount,
      menCount,
      womenCount,
      categoriesCount: categoriesSet.size,
    };
  }, [products]);

  const handleOpenAddModal = () => {
    setName('');
    setPrice('');
    setCategorySelection('Tops');
    setCustomCategory('');
    setGender('men');
    setImagesList([]);
    setSelectedSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    setCustomSizeInput('');
    setDescription('');
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
    setSelectedSizes(
      product.sizes && product.sizes.length > 0
        ? product.sizes.map((s) => String(s).trim()).filter(Boolean)
        : ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    );
    setCustomSizeInput('');
    setDescription(product.description || '');
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase();
    if (!trimmed) return;
    if (selectedSizes.includes(trimmed)) {
      setCustomSizeInput('');
      return;
    }
    setSelectedSizes((prev) => [...prev, trimmed]);
    setCustomSizeInput('');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSelectedSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleSelectAllStandardSizes = () => {
    setSelectedSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  };

  const handleClearAllSizes = () => {
    setSelectedSizes([]);
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
      notify.warning(`Maximum limit of ${MAX_IMAGES} images reached.`);
      return;
    }

    const selectedFiles = Array.from(files).slice(0, availableSlots);
    const newEntries: ImageEntry[] = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        notify.warning('Please select valid image files only (PNG, JPG, WEBP, GIF, SVG).');
        continue;
      }
      newEntries.push({
        id: `file-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (files.length > availableSlots) {
      notify.warning(`Only ${availableSlots} more image(s) could be added (max ${MAX_IMAGES} images).`);
    }

    setImagesList((prev) => [...prev, ...newEntries].slice(0, MAX_IMAGES));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    setImagesList((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imagesList.length === 0) {
      notify.warning('Please upload at least 1 product image.');
      return;
    }

    if (imagesList.length > MAX_IMAGES) {
      notify.warning(`A maximum of ${MAX_IMAGES} images is allowed per product.`);
      return;
    }

    setSubmitting(true);

    try {
      const uploadedUrls: string[] = [];

      for (const item of imagesList) {
        if (item.file) {
          const uploadRes = await uploadImage(item.file);
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

      const response = await adminCreateProduct({
        name,
        price: parseFloat(price) || 0,
        category: finalCategory,
        gender,
        image: primaryImage,
        mainImage: primaryImage,
        images: uploadedUrls,
        sizes: selectedSizes,
        description,
      });

      if (!response.success) {
        const msg = response.message || 'Failed to add product';
        notify.error(msg);
      } else {
        notify.success(`Product "${name}" created successfully!`);
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err: unknown) {
      notify.apiError(err, 'Error creating product. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (imagesList.length === 0) {
      notify.warning('Please upload at least 1 product image.');
      return;
    }

    if (imagesList.length > MAX_IMAGES) {
      notify.warning(`A maximum of ${MAX_IMAGES} images is allowed per product.`);
      return;
    }

    setSubmitting(true);

    try {
      const finalImageUrls: string[] = [];

      for (const item of imagesList) {
        if (item.file) {
          const uploadRes = await uploadImage(item.file);
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

      const response = await adminUpdateProduct(editingProduct.id, {
        name,
        price: parseFloat(price) || 0,
        category: finalCategory,
        gender,
        image: primaryImage,
        mainImage: primaryImage,
        images: finalImageUrls,
        sizes: selectedSizes,
        description,
      });

      if (!response.success) {
        const msg = response.message || 'Failed to update product';
        notify.error(msg);
      } else {
        notify.success(`Product "${name}" updated successfully!`);
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err: unknown) {
      notify.apiError(err, 'Error updating product. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number, productName: string) => {
    try {
      const response = await adminDeleteProduct(id);
      if (response.success) {
        notify.success(`Product "${productName}" deleted successfully.`);
        fetchProducts();
      } else {
        notify.error(response.message || 'Failed to delete product.');
      }
    } catch (err: unknown) {
      notify.apiError(err, 'An error occurred while deleting product.');
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
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a1a1a]">Product Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your store&apos;s catalog, inventory, categories, and pricing
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer w-fit"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Total Products</span>
            <div className="size-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
              <Package size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.totalCount}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Active catalog items</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Men&apos;s Collection</span>
            <div className="size-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Tag size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.menCount}</div>
          <div className="text-[11px] text-sky-600 font-medium mt-0.5">Men&apos;s apparel</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Women&apos;s Collection</span>
            <div className="size-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.womenCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5">Women&apos;s apparel</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#e7f1f3] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Categories</span>
            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Layers size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#1a1a1a]">{metrics.categoriesCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Distinct categories</div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-[#e7f1f3] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name, category, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter products by category"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            aria-label="Filter products by gender"
            className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-brand-teal"
          >
            <option value="all">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-2xl border border-[#e7f1f3] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7f1f3] bg-[#fbfdfe]">
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Product</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Category</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Gender</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Price</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Rating</th>
                <th className="p-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-xs">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const totalImages = (product.images && product.images.length) || (product.image ? 1 : 0);

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-[#fcfefe] transition-all duration-150"
                    >
                      {/* PRODUCT INFO */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-200/80 shrink-0">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="object-cover size-full"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#1a1a1a] block line-clamp-1">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-gray-400">#{product.id}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                {totalImages} {totalImages === 1 ? 'img' : 'imgs'}
                              </span>
                            </div>
                            {product.sizes && product.sizes.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {product.sizes.slice(0, 4).map((s, idx) => (
                                  <span key={idx} className="text-[9px] font-semibold text-gray-600 bg-gray-100/90 px-1.5 py-0.2 rounded">
                                    {s}
                                  </span>
                                ))}
                                {product.sizes.length > 4 && (
                                  <span className="text-[9px] font-semibold text-brand-teal">
                                    +{product.sizes.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="p-4">
                        <span className="text-xs font-medium text-gray-700">
                          {product.category || 'General'}
                        </span>
                      </td>

                      {/* GENDER */}
                      <td className="p-4">
                        <span className="inline-flex items-center text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          {product.gender || 'unisex'}
                        </span>
                      </td>

                      {/* PRICE */}
                      <td className="p-4">
                        <span className="text-xs font-bold text-[#1a1a1a]">
                          Rs. {product.price.toFixed(2)}
                        </span>
                      </td>

                      {/* RATING */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Star size={13} className="text-amber-400 fill-amber-400" />
                          <span className="font-semibold text-gray-800">{product.rating || 0}</span>
                          <span className="text-[11px] text-gray-400">({product.reviewCount || 0})</span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* VIEW PRODUCT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(product)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal hover:bg-brand-teal/5 transition-colors cursor-pointer"
                            title="Inspect Product"
                          >
                            <Eye size={14} />
                          </button>

                          {/* EDIT PRODUCT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:text-brand-teal hover:border-brand-teal hover:bg-brand-teal/5 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </button>

                          {/* DELETE PRODUCT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="size-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PRODUCT INSPECTION MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal">Product Inspection</span>
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">{viewingProduct.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                aria-label="Close modal"
                className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* GALLERY & MAIN DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* IMAGE GALLERY / VIEWER */}
              <div className="space-y-3">
                <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-200 flex items-center justify-center relative">
                  {viewGalleryImages.length > 0 ? (
                    <img
                      src={getImageUrl(viewGalleryImages[activePreviewIndex] || viewingProduct.image)}
                      alt={viewingProduct.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">No image available</div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
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
                        className={`size-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activePreviewIndex === idx
                            ? 'border-brand-teal ring-2 ring-brand-teal/20'
                            : 'border-gray-200 opacity-60 hover:opacity-100'
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
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold text-[#1a1a1a]">Rs. {viewingProduct.price.toFixed(2)}</span>
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

            {/* MODAL ACTIONS FOOTER */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-100">
              <Link
                href={`/products/${viewingProduct.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal hover:underline"
              >
                <span>View on Storefront</span>
                <ExternalLink size={13} />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Edit size={13} />
                  <span>Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">
                  {showAddModal ? 'Add New Product' : 'Edit Product'}
                </h3>
                <p className="text-xs text-gray-500">
                  {showAddModal ? 'Create a new catalog item with images and pricing' : `Editing ${editingProduct?.name || 'product'}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                aria-label="Close modal"
                className="size-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="space-y-4 pt-4">
              {/* PRODUCT NAME */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Structured Wool Overcoat"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                />
              </div>

              {/* PRICE & GENDER */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Price (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'men' | 'women')}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal bg-white"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Category
                </label>
                <select
                  value={categorySelection}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategorySelection(val);
                    if (val !== 'Other') {
                      setCustomCategory('');
                    }
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal bg-white"
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
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Custom Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter category name (e.g. Footwear, Outerwear)"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  />
                </div>
              )}

              {/* MULTI-IMAGE UPLOADER */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Product Images ({imagesList.length}/{MAX_IMAGES}) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400">1st image is cover</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFilesSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="grid grid-cols-5 gap-2 pt-1">
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
                        <span className="absolute top-1 left-1 bg-brand-teal text-white text-[8px] font-bold uppercase px-1 py-0.2 rounded shadow-xs">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        title="Remove Image"
                      >
                        <Trash2 size={16} className="text-rose-300" />
                      </button>
                    </div>
                  ))}

                  {imagesList.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border border-dashed border-gray-300 hover:border-brand-teal rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-gray-50 hover:bg-brand-teal/5 transition-all text-gray-400 hover:text-brand-teal"
                    >
                      <UploadCloud size={16} />
                      <span className="text-[9px] font-bold uppercase">+ Add</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AVAILABLE SIZES MANAGEMENT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Available Sizes ({selectedSizes.length})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllStandardSizes}
                      className="text-[10px] text-brand-teal font-semibold hover:underline cursor-pointer"
                    >
                      All Standard
                    </button>
                    <span className="text-gray-300">•</span>
                    <button
                      type="button"
                      onClick={handleClearAllSizes}
                      className="text-[10px] text-gray-400 font-semibold hover:text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Standard Preset Size Toggles */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {STANDARD_SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand-teal text-white border-brand-teal shadow-2xs font-bold'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-teal hover:bg-brand-teal/5'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Size Adder */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    placeholder="Custom size (e.g. 28, 30, 32, 34, 40)"
                    className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-brand-teal hover:text-white text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 hover:border-brand-teal transition-all cursor-pointer"
                  >
                    + Add Size
                  </button>
                </div>

                {/* Active Selected Sizes List */}
                {selectedSizes.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Active:</span>
                    {selectedSizes.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[11px] font-semibold"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(s)}
                          className="hover:text-rose-500 cursor-pointer text-brand-teal/70 hover:bg-rose-50 rounded"
                          title={`Remove size ${s}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                    No sizes selected. Standard sizes (XS–XXL) will be enabled by default.
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product description..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>

              {/* FORM ACTIONS */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-teal hover:bg-brand-teal/90 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="size-3.5 animate-spin" />}
                  <span>
                    {submitting
                      ? showAddModal
                        ? 'Creating...'
                        : 'Saving...'
                      : showAddModal
                      ? 'Create Product'
                      : 'Save Changes'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
