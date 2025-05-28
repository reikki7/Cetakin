import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleProductClick = () => {
    const productSlug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    navigate(`/produk/${productSlug}`, { state: { product } });
  };

  return (
    <div
      onClick={handleProductClick}
      className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full p-4 sm:p-6 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-base sm:text-xl">📷</span>
              </div>
              <span className="text-xs sm:text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
        >
          {isWishlisted ? (
            <IoMdHeart className="text-red-500 text-base sm:text-lg" />
          ) : (
            <IoMdHeartEmpty className="text-gray-600 text-base sm:text-lg" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {product.category && (
          <div className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            {typeof product.category === "object"
              ? product.category.name
              : product.category}
          </div>
        )}
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 leading-tight group-hover:text-accent transition-colors duration-200">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
