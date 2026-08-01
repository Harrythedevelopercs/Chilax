"use client";

import { useState } from "react";

export default function CustomPackagingFormSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName("");
    setEmail("");
    setIndustry("");
    setProjectDetails("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-gray-100 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side Content & Value Props */}
          <div className="lg:col-span-6 pr-0 lg:pr-4">
            {/* Creative Packaging Icon Badge */}
            <div className="mb-6 inline-flex items-center justify-center">
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-[#e4f7ee] to-[#d1fae5] border border-[#bbf7d0] text-[#00684a] shadow-xs group">
                {/* Isometric 3D Box Icon */}
                <svg className="w-9 h-9 text-[#00684a] group-hover:rotate-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7.5L12 3 4 7.5M20 7.5L12 12M20 7.5v9l-8 4.5M12 12L4 7.5M12 12v9M4 7.5v9l8 4.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v2.5M8.5 2.5l1.5 2M15.5 2.5l-1.5 2" />
                </svg>
                
                {/* Small floating idea spark badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#00684a] text-white flex items-center justify-center shadow-xs">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7zm-2 18h4v1h-4v-1z" />
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-[1.18] mb-5 font-inter">
              Have a Custom Packaging Idea?
            </h2>

            <p className="text-base sm:text-lg text-[#475569] font-normal leading-relaxed mb-10">
              Bring your vision to life with our expert structural designers and manufacturing team. Whether you have a fully-realized concept or just a rough idea, we provide the technical roadmap to realization.
            </p>

            {/* Feature List */}
            <div className="space-y-7">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#e4f7ee] text-[#00684a] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#c3f0da]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">
                    Certified Quality Control
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                    Every order undergoes a rigorous 3-point inspection process.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#e4f7ee] text-[#00684a] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#c3f0da]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">
                    Reliable Lead Times
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                    Global supply chain management ensures on-time delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#f1f2f6] rounded-3xl p-6 sm:p-10 border border-gray-200/50 shadow-2xs">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-[#e4f7ee] text-[#00684a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#c3f0da]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0f172a] mb-2 font-inter">Request Received!</h3>
                  <p className="text-sm text-[#475569] max-w-md mx-auto mb-6">
                    Thank you for submitting your custom packaging request. Our expert team will review your project details and attached artwork and get back to you shortly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-[#00684a] text-white text-xs font-bold rounded-xl hover:bg-[#00543c] transition-colors"
                  >
                    Submit Another Idea
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0f172a] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Industry Select Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-2">
                      Industry
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Industry</option>
                        <option value="Cosmetics">Cosmetics & Beauty</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Retail">Retail & E-Commerce</option>
                        <option value="CBD & Cannabis">CBD & Cannabis</option>
                        <option value="Pharmaceutical">Pharmaceutical & Health</option>
                        <option value="Jewelry">Jewelry & Luxury Goods</option>
                        <option value="Bakery">Bakery & Confectionery</option>
                        <option value="Apparel">Apparel & Fashion</option>
                        <option value="Electronics">Electronics & Tech</option>
                        <option value="Other">Other Custom Application</option>
                      </select>

                      {/* Custom Select Chevron */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Project Details Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-2">
                      Project Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Tell us about your packaging needs, quantities, and timelines..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00684a] focus:ring-2 focus:ring-[#00684a]/20 transition-all resize-none"
                    />
                  </div>

                  {/* Row 4: File Upload Image Field */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-2">
                      Upload Reference Image / Artwork <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>

                    {selectedFile ? (
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {previewUrl ? (
                            /* Image thumbnail preview */
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={previewUrl} alt="Artwork preview" className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                          ) : (
                            <div className="w-10 h-10 bg-[#e4f7ee] text-[#00684a] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#c3f0da]">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="truncate">
                            <p className="text-xs font-bold text-gray-800 truncate">{selectedFile.name}</p>
                            <p className="text-[10px] text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                          title="Remove file"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full bg-white border-2 border-dashed border-gray-300 hover:border-[#00684a] rounded-xl p-4 cursor-pointer transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#f8f9fb] text-gray-500 group-hover:text-[#00684a] group-hover:bg-[#e4f7ee] flex items-center justify-center transition-colors flex-shrink-0 border border-gray-100">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 group-hover:text-[#00684a] transition-colors">
                              Click to upload reference image or artwork
                            </p>
                            <p className="text-[10px] text-gray-400">PNG, JPG, WEBP, PDF up to 10MB</p>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#00684a] hover:bg-[#00543c] active:bg-[#00422f] text-white font-bold text-base rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Get Started Now</span>
                    )}
                  </button>

                  {/* Footer Note */}
                  <p className="text-center text-[11px] sm:text-xs text-gray-500 font-normal pt-1">
                    We typically respond within 12 business hours.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
