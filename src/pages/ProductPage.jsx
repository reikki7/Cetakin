// ProductPage.jsx
import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  IoCartOutline,
  IoAdd,
  IoRemove,
  IoCloudUpload,
  IoChevronBack,
  IoChevronForward,
  IoChatbubbleOutline,
} from "react-icons/io5";
import { HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi2";
import { formatCurrency } from "../utils/currency";
import { useWishlist } from "../contexts/WishlistContext";

const ProductPage = () => {
  const location = useLocation();
  const product = location.state?.product;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  if (!product) return <Navigate to="/" />;

  // Image gallery state
  const detailGroup = product.details?.detail_images?.[0] || {};
  const previewImages = (detailGroup.preview || []).filter(
    (img) => img && !img.toLowerCase().endsWith(".svg")
  );
  const thumbnailImages = (detailGroup.thumbnail || []).filter(
    (img) => img && !img.toLowerCase().endsWith(".svg")
  );
  const [currentImage, setCurrentImage] = useState(previewImages[0] || "");
  const [thumbIndex, setThumbIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  // Variants
  const variantDefinitions = product.details?.variants || {};
  const variantNames = Object.keys(variantDefinitions);
  const [selectedVariants, setSelectedVariants] = useState(
    variantNames.reduce(
      (acc, name) => ({
        ...acc,
        [name]: variantDefinitions[name]?.[0] || "",
      }),
      {}
    )
  );

  // Quantity, wishlist, reviews pagination
  const [quantity, setQuantity] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const reviews = product.details?.reviews || [];
  const reviewsPerPage = 5;
  const [reviewPage, setReviewPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Description state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Remove the problematic useEffect and fix the wishlist logic
  useEffect(() => {
    setCurrentImage(previewImages[0] || "");
    setQuantity(1);
    setLogoFile(null);
    setThumbIndex(0);
    setReviewPage(1);
    setIsDescriptionExpanded(false);
    setSelectedVariants(
      variantNames.reduce(
        (acc, name) => ({
          ...acc,
          [name]: variantDefinitions[name]?.[0] || "",
        }),
        {}
      )
    );
  }, [product]);

  // Matching variant detail
  const matchedDetail = product.details?.available_variant_details?.find(
    (item) =>
      variantNames.every(
        (name) =>
          selectedVariants[name] &&
          item.variant_options[name] === selectedVariants[name]
      )
  );

  const inStock = matchedDetail?.stock > 0;
  const displayPrice = matchedDetail?.final_price ?? null;
  const originalPrice = matchedDetail?.original_price;
  const stockCount = matchedDetail?.stock ?? 0;

  const handleVariantChange = (name, value) => {
    setSelectedVariants((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (delta) =>
    setQuantity((q) => Math.max(1, q + delta));

  const handleFileUpload = (e) =>
    e.target.files[0] && setLogoFile(e.target.files[0]);

  const handleBuy = () => {
    if (matchedDetail && inStock) {
      const variantString = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}:${value}`)
        .join("-");

      const cartItem = {
        id: `${product.id}-${variantString}`,
        productId: product.id,
        title: product.title,
        image: currentImage,
        variants: selectedVariants,
        price: displayPrice,
        quantity: quantity,
        logo: logoFile ? URL.createObjectURL(logoFile) : null,
        totalPrice: displayPrice * quantity,
        dateAdded: new Date().toISOString(),
      };

      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === cartItem.id
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += quantity;
        existingCart[existingItemIndex].totalPrice =
          existingCart[existingItemIndex].price *
          existingCart[existingItemIndex].quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event("cartUpdated"));

      alert(`Berhasil menambahkan ${quantity} item ke keranjang!`);
    }
  };

  // Handle chat click - trigger the global chat component
  const handleChatClick = () => {
    // Create a custom event with product data
    const event = new CustomEvent("openProductChat", {
      detail: {
        product: {
          ...product,
          image: currentImage || product.image,
        },
      },
    });
    // Dispatch the event to be caught by the Chat component
    window.dispatchEvent(event);
  };

  // Reviews pagination
  const start = (reviewPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(start, start + reviewsPerPage);

  // Description truncation
  const description = product.details?.description || "";
  const shouldTruncate = description.length > 300;
  const displayDescription =
    shouldTruncate && !isDescriptionExpanded
      ? description.substring(0, 300) + "..."
      : description;

  // Move this line here, right before the handler
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        image: currentImage || product.image,
        price: displayPrice || product.price,
        category: product.category,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {" "}
        {/* Adjust padding for mobile */}
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {" "}
          {/* Adjust gap for mobile */}
          {/* Left Column - Images (5 columns) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-42.5 z-40">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg overflow-hidden mb-4">
                <div className="aspect-square">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.title}
                      className="w-full h-full object-contain pt-2 sm:pt-5"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <span className="text-4xl text-gray-400">📷</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  {isWishlisted ? (
                    <IoMdHeart className="text-red-500 text-lg sm:text-xl" />
                  ) : (
                    <IoMdHeartEmpty className="text-gray-600 text-lg sm:text-xl" />
                  )}
                </button>
              </div>

              {/* Thumbnails - Make more responsive */}
              {thumbnailImages.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const thumbnailContainer = document.getElementById(
                        "thumbnail-container"
                      );
                      thumbnailContainer.scrollBy({
                        left: -100,
                        behavior: "smooth",
                      });
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all"
                    aria-label="Previous image"
                  >
                    <span className="text-lg font-bold">‹</span>
                  </button>
                  <div
                    id="thumbnail-container"
                    className="flex gap-2 overflow-x-auto scrollbar-hide max-w-[240px] sm:max-w-[320px] scroll-smooth px-2"
                    style={{
                      scrollbarWidth: "none",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                    }}
                  >
                    {[...new Set(thumbnailImages)].map((thumb, idx) => (
                      <img
                        key={idx}
                        src={thumb}
                        alt={`thumb-${idx}`}
                        className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded cursor-pointer border-2 transition-all flex-shrink-0 ${
                          currentImage === previewImages[idx]
                            ? "border-[#8da291]"
                            : "border-gray-200"
                        }`}
                        onClick={() => setCurrentImage(previewImages[idx])}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const thumbnailContainer = document.getElementById(
                        "thumbnail-container"
                      );
                      thumbnailContainer.scrollBy({
                        left: 100,
                        behavior: "smooth",
                      });
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all"
                    aria-label="Next image"
                  >
                    <span className="text-lg font-bold">›</span>
                  </button>
                </div>
              )}

              {/* Feature Cards - Only show on desktop */}
              <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-white p-3 rounded-lg flex items-center gap-3">
                  <HiOutlineTruck className="text-xl text-[#8da291]" />
                  <div>
                    <p className="font-medium text-sm">Gratis Ongkir</p>
                    <p className="text-xs text-gray-500">Min. pembelian 100k</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg flex items-center gap-3">
                  <HiOutlineShieldCheck className="text-xl text-[#8da291]" />
                  <div>
                    <p className="font-medium text-sm">Garansi Kualitas</p>
                    <p className="text-xs text-gray-500">100% original</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Middle Column - Add a gap between product sections on mobile */}
          <div className="lg:col-span-4 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg pt-6">
              {/* Breadcrumb/Category */}
              {product.category && (
                <p className="text-md text-[#8da291] mb-2">
                  {product.category}
                </p>
              )}

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              {/* Rating & Sold */}
              {(product.product_rating || product.sold_count) && (
                <div className="flex items-center gap-4 mb-4">
                  {product.product_rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(product.product_rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 fill-current"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.product_rating}
                      </span>
                    </div>
                  )}
                  {product.sold_count && (
                    <span className="text-sm text-gray-500">
                      {product.sold_count} terjual
                    </span>
                  )}
                </div>
              )}

              {/* Price Display - Changed to vertical layout */}
              {variantNames.every((n) => selectedVariants[n]) && (
                <div className="mb-6">
                  {displayPrice ? (
                    <div className="flex flex-col">
                      {originalPrice > displayPrice && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg line-through text-gray-400">
                            {formatCurrency(originalPrice)}
                          </span>
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded">
                            {Math.round(
                              ((originalPrice - displayPrice) / originalPrice) *
                                100
                            )}
                            % OFF
                          </span>
                        </div>
                      )}
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(displayPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-semibold text-red-500">
                      Stok Habis
                    </span>
                  )}
                  {matchedDetail && (
                    <p className="text-sm text-gray-500 mt-3">
                      Stok: {stockCount}
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="border-t border-black/25 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Deskripsi Produk
                </h3>
                <div className="text-gray-600 text-sm leading-relaxed">
                  {displayDescription.split("\n").map((line, i) =>
                    line ? (
                      <p key={i} className="mb-2">
                        {line}
                      </p>
                    ) : (
                      <br key={i} />
                    )
                  )}
                  {shouldTruncate && (
                    <button
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                      className="text-[#8da291] hover:text-[#2f3e34] font-medium text-sm mt-2 transition-colors cursor-pointer"
                    >
                      {isDescriptionExpanded
                        ? "Sembunyikan"
                        : "Lihat Selengkapnya"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Purchase Section (3 columns) */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-42.5 z-40">
              <div className="bg-white rounded-lg pt-6">
                {" "}
                {/* Remove ml-7 completely */}
                <h3 className="font-semibold text-gray-900 mb-4">
                  Atur Jumlah dan Catatan
                </h3>
                {/* Variants */}
                {variantNames.map((name) => {
                  const label = name.charAt(0).toUpperCase() + name.slice(1);
                  return (
                    <div key={name} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <select
                        value={selectedVariants[name]}
                        onChange={(e) =>
                          handleVariantChange(name, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8da291] focus:border-transparent outline-none text-sm"
                      >
                        {variantDefinitions[name].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
                {/* Logo Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Logo (Opsional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-[#8da291] transition-colors">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <IoCloudUpload className="text-2xl text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {logoFile ? logoFile.name : "Pilih File"}
                      </p>
                    </label>
                  </div>
                </div>
                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IoRemove className="text-sm" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setQuantity("");
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1) {
                            setQuantity(numValue);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          isNaN(parseInt(value)) ||
                          parseInt(value) < 1
                        ) {
                          setQuantity(1);
                        } else if (
                          matchedDetail &&
                          parseInt(value) > stockCount
                        ) {
                          setQuantity(stockCount);
                        }
                      }}
                      className="w-16 text-center border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#8da291] focus:border-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max={stockCount}
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={!matchedDetail || quantity >= stockCount}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IoAdd className="text-sm" />
                    </button>
                  </div>
                </div>
                {/* Total Price */}
                {displayPrice && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(displayPrice * quantity)}
                      </span>
                    </div>
                  </div>
                )}
                {/* Buy Button */}
                <button
                  onClick={handleBuy}
                  disabled={
                    !matchedDetail ||
                    !inStock ||
                    variantNames.some((n) => !selectedVariants[n])
                  }
                  className={`w-full py-3 sm:py-4 cursor-pointer rounded-md font-medium flex items-center justify-center gap-2 transition-all ${
                    matchedDetail &&
                    inStock &&
                    variantNames.every((n) => selectedVariants[n])
                      ? "bg-[#2f3e34] text-white hover:bg-[#1f2a22]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <IoCartOutline className="text-lg" />
                  Masukkan Keranjang
                </button>
                <button
                  onClick={handleChatClick}
                  className="w-full py-3 sm:py-4 mt-2 border border-[#2f3e34] text-[#2f3e34] rounded-md font-medium flex items-center justify-center gap-2 hover:bg-[#2f3e34] hover:text-white transition-all"
                >
                  <IoChatbubbleOutline className="text-lg" />
                  Chat dengan Penjual
                </button>
                {/* Feature Cards for Mobile - Show below chat button */}
                <div className="lg:hidden grid grid-cols-1 gap-2 mt-4">
                  <div className="bg-green-50 p-3 rounded-lg flex items-center gap-3">
                    <HiOutlineTruck className="text-lg text-[#8da291]" />
                    <div>
                      <p className="font-medium text-sm">Gratis Ongkir</p>
                      <p className="text-xs text-gray-500">
                        Min. pembelian 100k
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                    <HiOutlineShieldCheck className="text-lg text-[#8da291]" />
                    <div>
                      <p className="font-medium text-sm">Garansi Kualitas</p>
                      <p className="text-xs text-gray-500">100% original</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews Section - Adjust padding for mobile */}
        <div className="mt-6 sm:mt-8 bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">
            Ulasan Pembeli ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada ulasan.</p>
          ) : (
            <>
              <div className="space-y-4">
                {currentReviews.map((review, idx) => {
                  const hasImage =
                    review.image_url &&
                    !review.image_url.toLowerCase().endsWith(".svg");
                  return (
                    <div
                      key={idx}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {review.user_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {review.variant}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.time_ago}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(review.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 fill-current"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-700 text-sm mb-2">
                        {review.text}
                      </p>

                      {hasImage && (
                        <img
                          src={review.image_url}
                          alt="review"
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
                    disabled={reviewPage === 1}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 flex items-center justify-center transition-colors"
                    aria-label="Previous page"
                  >
                    <IoChevronBack className="text-sm" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Halaman {reviewPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setReviewPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={reviewPage === totalPages}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100 flex items-center justify-center transition-colors"
                    aria-label="Next page"
                  >
                    <IoChevronForward className="text-sm" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
