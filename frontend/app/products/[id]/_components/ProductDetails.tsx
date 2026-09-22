'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Review } from '@/interfaces';
import { useAuth, useFavorites, useProducts, useCart } from '@/context';
import { notify } from '@/helper/toast';
import { Star, MessageSquare, Send, CheckCircle2, User as UserIcon } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getProductReviews, postReview } = useProducts();
  const { addToCart } = useCart();
  const favorited = isFavorite(product.id);

  const availableSizes = product.sizes && product.sizes.length > 0
    ? product.sizes.map((s) => (typeof s === 'string' ? s : String(s)))
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const [selectedSize, setSelectedSize] = useState<string | null>(
    availableSizes.length > 0 ? availableSizes[0] : 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      if (!product.id) return;
      setLoadingReviews(true);
      try {
        const res = await getProductReviews(product.id);
        if (isMounted && res.success && res.data) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        if (isMounted) setLoadingReviews(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [product.id, getProductReviews]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      notify.warning('Please select a size before adding to cart.');
      return;
    }
    await addToCart(
      product,
      quantity,
      selectedSize
    );
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewErrorMsg('');
    setReviewSuccessMsg('');

    if (!reviewComment.trim()) {
      const err = 'Please write your review message.';
      setReviewErrorMsg(err);
      notify.warning(err);
      return;
    }

    setSubmittingReview(true);
    try {
      const authorFullName = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
        : undefined;
      const authorEmail = user?.email || undefined;

      const response = await postReview(product.id, {
        rating: reviewRating,
        authorName: authorFullName,
        authorEmail: authorEmail,
        comment: reviewComment.trim(),
      });

      if (response.success && response.data) {
        setReviews((prev) => [response.data as Review, ...prev]);
        const msg = 'Thank you! Your review has been submitted.';
        setReviewSuccessMsg(msg);
        notify.success(msg);
        setReviewComment('');
        setReviewRating(5);
        setShowReviewForm(false);
      } else {
        const msg = response.message || 'Failed to submit review';
        setReviewErrorMsg(msg);
        notify.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Error submitting review';
      setReviewErrorMsg(msg);
      notify.apiError(err, 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const currentRating = product.rating || (reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 5);
  const totalReviewsCount = reviews.length > 0 ? reviews.length : (product.reviewCount || 0);

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex flex-wrap text-xs uppercase tracking-widest text-[#4e8b97] gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
          </li>
          {product.category && (
            <>
              <li>/</li>
              <li className="capitalize">
                {product.category}
              </li>
            </>
          )}
          <li>/</li>
          <li className="font-semibold text-gray-800 truncate max-w-[200px]">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold italic tracking-tight mb-4 leading-tight text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={star <= Math.round(currentRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
            />
          ))}
        </div>

        <span className="text-xs uppercase tracking-widest text-[#4e8b97] font-medium">
          ({totalReviewsCount} {totalReviewsCount === 1 ? 'Review' : 'Reviews'})
        </span>
      </div>

      {/* Price */}
      <p className="text-3xl font-serif mb-8 tracking-tight text-gray-900">
        Rs. {product.price?.toLocaleString()}
      </p>

      {/* Size Selection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
            Select Size:{' '}
            <span className="font-semibold text-brand-teal normal-case ml-1 font-serif text-sm">
              {selectedSize ? `Size ${selectedSize}` : 'Please Select'}
            </span>
          </h4>

          <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-brand-teal border-b border-brand-teal/30 hover:border-brand-teal transition-all cursor-pointer">
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {availableSizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`
                  min-w-12 h-11 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 border cursor-pointer flex items-center justify-center
                  ${isSelected
                    ? 'border-brand-teal bg-brand-teal text-white shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:border-brand-teal text-gray-700 hover:bg-[#f6f8f8]'
                  }
                `}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4">
          Quantity
        </h4>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="size-10 rounded-lg bg-white border border-[#e7f1f3] hover:border-brand-teal transition-colors flex items-center justify-center font-bold text-gray-600 cursor-pointer"
          >
            -
          </button>

          <span className="w-12 text-center font-medium text-sm">{quantity}</span>

          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="size-10 rounded-lg bg-white border border-[#e7f1f3] hover:border-brand-teal transition-colors flex items-center justify-center font-bold text-gray-600 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-4 bg-brand-teal text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1499b5] transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-lg">
            shopping_bag
          </span>
          <span>Add to Cart</span>
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite({ id: product.id, name: product.name })}
          className={`px-6 py-4 border text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-xl flex items-center justify-center gap-2 cursor-pointer ${
            favorited
              ? 'bg-[#e7f1f3] text-brand-teal border-brand-teal hover:bg-[#d8eaee] shadow-sm'
              : 'bg-white border-[#e7f1f3] text-gray-700 hover:text-brand-teal hover:border-brand-teal'
          }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span
            className="material-symbols-outlined text-lg"
            style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* Accordions */}
      <div className="border-t border-[#e7f1f3] divide-y divide-[#e7f1f3]">
        {/* Product Details Accordion */}
        <div className="py-5">
          <button
            type="button"
            onClick={() => toggleAccordion('details')}
            className="flex justify-between items-center w-full group cursor-pointer"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-900">
              Product Details
            </h4>
            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 text-gray-500 ${
                activeAccordion === 'details' ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeAccordion === 'details' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 text-sm text-[#4e8b97] leading-relaxed">
              <p>{product.description || 'Crafted with premium quality materials for lasting luxury and comfort.'}</p>

              {product.details && product.details.length > 0 && (
                <ul className="list-disc pl-5 mt-4 space-y-1 text-xs text-gray-600">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Material & Care Accordion */}
        <div className="py-5">
          <button
            type="button"
            onClick={() => toggleAccordion('care')}
            className="flex justify-between items-center w-full group cursor-pointer"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-900">
              Material &amp; Care
            </h4>
            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 text-gray-500 ${
                activeAccordion === 'care' ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeAccordion === 'care' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 text-sm text-[#4e8b97] leading-relaxed">
              <p>{product.material || '100% Sustainable Organic Textile.'}</p>

              {product.careInstructions && product.careInstructions.length > 0 && (
                <>
                  <p className="mt-3 font-semibold text-xs text-gray-800">Care Instructions:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-xs text-gray-600">
                    {product.careInstructions.map((care, idx) => (
                      <li key={idx}>{care}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Accordion */}
        <div className="py-5">
          <button
            type="button"
            onClick={() => toggleAccordion('reviews')}
            className="flex justify-between items-center w-full group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-900">
                Customer Reviews ({reviews.length})
              </h4>
            </div>
            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 text-gray-500 ${
                activeAccordion === 'reviews' ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeAccordion === 'reviews' ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 space-y-4">
              {reviewSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{reviewSuccessMsg}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <p className="text-xs text-[#4e8b97]">
                  {reviews.length > 0 ? `Showing ${reviews.length} reviews` : 'No reviews yet for this product.'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-bold uppercase tracking-wider text-brand-teal hover:underline cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare size={14} />
                  <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReviewSubmit} className="p-5 bg-off-white rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/70 pb-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-900">Leave a Review</h5>
                    
                    {/* Auto-detected User Identity Badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-2xs">
                      <UserIcon size={14} className="text-brand-teal shrink-0" />
                      {user ? (
                        <span className="truncate">
                          Posting as <strong className="text-gray-900 font-semibold">{user.firstName} {user.lastName}</strong> <span className="text-gray-400">({user.email})</span>
                        </span>
                      ) : (
                        <span>Posting as <strong className="text-gray-800">Verified Customer</strong></span>
                      )}
                    </div>
                  </div>

                  {reviewErrorMsg && (
                    <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-medium">
                      {reviewErrorMsg}
                    </div>
                  )}

                  {/* Interactive Star Rating Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Rating: <span className="text-gray-900 normal-case font-semibold">
                          {(hoverRating || reviewRating) === 5 ? '5 - Excellent' :
                           (hoverRating || reviewRating) === 4 ? '4 - Very Good' :
                           (hoverRating || reviewRating) === 3 ? '3 - Average' :
                           (hoverRating || reviewRating) === 2 ? '2 - Poor' : '1 - Terrible'}
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5 pt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hoverRating !== null ? hoverRating : reviewRating);
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                            title={`${star} star${star > 1 ? 's' : ''}`}
                          >
                            <Star
                              size={24}
                              className={`transition-colors ${
                                active
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                                  : 'text-gray-300 hover:text-amber-200'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message / Feedback Only */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your thoughts about product quality, fit, or material..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/20 text-gray-900 resize-none shadow-2xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2.5 bg-brand-teal hover:bg-[#1499b5] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send size={14} />
                      <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {loadingReviews ? (
                <div className="py-4 text-xs text-gray-400">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-800">{r.authorName || 'Verified Buyer'}</span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                      </div>
                      {r.title && <p className="text-xs font-semibold text-gray-700">{r.title}</p>}
                      <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Shipping & Returns Accordion */}
        <div className="py-5">
          <button
            type="button"
            onClick={() => toggleAccordion('shipping')}
            className="flex justify-between items-center w-full group cursor-pointer"
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-900">
              Shipping &amp; Returns
            </h4>
            <span
              className={`material-symbols-outlined text-xl transition-transform duration-300 text-gray-500 ${
                activeAccordion === 'shipping' ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeAccordion === 'shipping' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 text-xs text-[#4e8b97] leading-relaxed space-y-2">
              <p>Free standard shipping on all orders over Rs. 25,000. Delivered within 3-5 business days.</p>
              <p>Returns accepted within 30 days of purchase in original condition with tags attached.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}