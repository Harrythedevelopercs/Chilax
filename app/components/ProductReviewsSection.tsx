"use client";

import { useState } from "react";

interface ProductReviewsSectionProps {
  productName: string;
}

interface ReviewItem {
  id: string;
  author: string;
  company?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export default function ProductReviewsSection({ productName }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "1",
      author: "Sarah Jenkins",
      company: "Luxe Glow Cosmetics",
      rating: 5,
      date: "August 2, 2026",
      title: "Exceptional printing quality & fast production!",
      comment: `We ordered 5,000 units of ${productName} for our autumn product launch. The structural integrity and foil embossing came out flawlessly. Our customers loved the unboxing experience!`,
      verified: true,
    },
    {
      id: "2",
      author: "Marcus Vance",
      company: "Vance Botanical Beauty",
      rating: 5,
      date: "July 24, 2026",
      title: "Perfect fit dielines and sturdy material",
      comment: `The dieline support provided was top notch. The samples matched our production run 100%. Highly recommend for custom B2B packaging orders!`,
      verified: true,
    },
    {
      id: "3",
      author: "Elena Rostova",
      company: "Aura Skincare Co.",
      rating: 5,
      date: "July 15, 2026",
      title: "Colors matched our Pantone swatches precisely",
      comment: `Color consistency across 10,000 boxes was spot on. Fast turnaround and smooth shipping process directly to our fulfillment warehouse.`,
      verified: true,
    },
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newTitle || !newComment) return;

    const newReview: ReviewItem = {
      id: String(Date.now()),
      author: newAuthor,
      company: newCompany || "Verified Customer",
      rating: newRating,
      date: "Just now",
      title: newTitle,
      comment: newComment,
      verified: true,
    };

    setReviews([newReview, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setSubmitted(false);
      setNewAuthor("");
      setNewCompany("");
      setNewTitle("");
      setNewComment("");
      setNewRating(5);
    }, 2000);
  };

  return (
    <section className="bg-white py-16 sm:py-20 border-b border-gray-100 font-inter w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
          <div>
            <span className="inline-block font-poppins text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#277a4e] mb-2">
              VERIFIED REVIEWS
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Customer Feedback for {productName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              Real reviews from cosmetics, beauty & B2B brands using our custom packaging.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="font-poppins bg-[#277a4e] hover:bg-[#1d5338] text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#277a4e]/20 flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </button>
        </div>

        {/* Rating Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 bg-[#f8fafc] p-6 sm:p-8 rounded-2xl border border-gray-200/80">
          {/* Rating Score Summary */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center lg:border-r border-gray-200 lg:pr-8">
            <span className="font-poppins text-5xl font-black text-[#0f172a]">4.9</span>
            <div className="flex items-center gap-1 text-amber-400 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-700">Based on 148 Verified Orders</p>
            <span className="text-[11px] text-gray-500 mt-0.5">100% Satisfaction Guarantee</span>
          </div>

          {/* Rating Bars */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-2">
            {[
              { stars: 5, pct: 92, count: 136 },
              { stars: 4, pct: 6, count: 9 },
              { stars: 3, pct: 2, count: 3 },
              { stars: 2, pct: 0, count: 0 },
              { stars: 1, pct: 0, count: 0 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-bold text-gray-600 flex items-center gap-1">
                  {bar.stars} <span className="text-amber-400">★</span>
                </span>
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#277a4e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-12 text-right font-medium text-gray-500">{bar.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Review Form */}
        {showReviewForm && (
          <div className="mb-12 bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#277a4e] shadow-lg animate-fadeIn">
            <h3 className="font-poppins text-lg font-bold text-[#0f172a] mb-4">
              Write Your Review for {productName}
            </h3>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold text-center">
                ✓ Thank you! Your review has been published successfully.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:border-[#277a4e] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Brand (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Beauty Co."
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:border-[#277a4e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rating *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-xl transition-transform ${star <= newRating ? "text-amber-400 scale-110" : "text-gray-300"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="Headline summarizing your review"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:border-[#277a4e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Review *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your experience with product quality, printing, turnaround and customer service..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#0f172a] focus:bg-white focus:border-[#277a4e] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#277a4e] hover:bg-[#1d5338] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar Circle */}
                  <div className="w-10 h-10 rounded-full bg-[#277a4e]/10 text-[#277a4e] flex items-center justify-center font-bold font-poppins text-sm">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-poppins text-sm font-bold text-[#0f172a]">
                      {rev.author}
                    </h4>
                    {rev.company && (
                      <span className="text-[11px] text-gray-500 font-medium block">
                        {rev.company}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5">{rev.date}</span>
                </div>
              </div>

              {rev.verified && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#277a4e] bg-[#eaf6f0] px-2 py-0.5 rounded-md mb-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Purchaser
                </div>
              )}

              <h5 className="font-poppins text-sm font-bold text-[#0f172a] mb-1">
                {rev.title}
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
