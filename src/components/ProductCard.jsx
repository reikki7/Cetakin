import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useWishlist } from "../contexts/WishlistContext";

const ProductCard = ({
  product,
  showOriginalPrice,
  showRating,
  showSoldCount,
  showDiscount,
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        image: product.image || product.image_url, // Handle both image properties
        price: product.displayed_price_final || product.price, // Use consistent price
        category: product.category,
      });
    }
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
      className="group cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md max-w-[260px] w-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {!imageError && (product.image_url || product.image) ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full p-3 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-10 h-10 mx-auto mb-1 bg-gray-200/50 rounded-full flex items-center justify-center">
                <span className="text-lg">🎨</span>
              </div>
              <span className="text-xs">No Image</span>
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {isWishlisted ? (
            <IoMdHeart className="text-red-500 text-sm" />
          ) : (
            <IoMdHeartEmpty className="text-gray-600 text-sm" />
          )}
        </button>

        {/* Discount Badge */}
        {showDiscount && product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
            {product.title}
          </h3>
          {showSoldCount && product.sold_count && (
            <div className="text-xs text-gray-500 mt-1">
              {product.sold_count} terjual
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-gray-900">
              {formatCurrency(product.displayed_price_final || product.price)}
            </span>
            {product.displayed_price_original > 0 && showOriginalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.displayed_price_original)}
              </span>
            )}
          </div>

          {/* Rating - Only show for best sellers */}
          {showRating && product.product_rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${
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
              <span className="text-xs text-gray-500">
                ({product.product_rating})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
