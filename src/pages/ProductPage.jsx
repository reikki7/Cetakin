import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoCartOutline, IoAdd, IoRemove, IoCloudUpload } from "react-icons/io5";
import { HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi2";

const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const colors = ["Black", "Charcoal", "Chestnut", "Navy", "Vegas Gold"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    setSelectedColor("");
    setSelectedSize("");
    setLogoFile(null);
    setQuantity(1);
    setImageError(false);
  }, [product]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleBuy = () => {
    if (!selectedColor || !selectedSize) {
      alert("Silakan pilih warna dan ukuran terlebih dahulu");
      return;
    }

    const cartItem = {
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      logo: logoFile ? URL.createObjectURL(logoFile) : null,
      totalPrice: product.price * quantity,
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

    existingCart.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage"));
    alert(`Berhasil menambahkan ${quantity} item ke keranjang!`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!product) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {!imageError && product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-8"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                    <span className="text-lg">No Image Available</span>
                  </div>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              >
                {isWishlisted ? (
                  <IoMdHeart className="text-red-500 text-2xl" />
                ) : (
                  <IoMdHeartEmpty className="text-gray-600 text-2xl" />
                )}
              </button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                <HiOutlineTruck className="text-2xl text-[#8DA291]" />
                <div>
                  <p className="font-semibold text-sm">Gratis Ongkir</p>
                  <p className="text-xs text-gray-500">Min. pembelian 100k</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                <HiOutlineShieldCheck className="text-2xl text-[#8DA291]" />
                <div>
                  <p className="font-semibold text-sm">Garansi Kualitas</p>
                  <p className="text-xs text-gray-500">100% original</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              {product.category && (
                <p className="text-sm font-medium text-[#8DA291] uppercase tracking-wider mb-2">
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-[#2f3e34]">
                  ${product.price}
                </span>
              </div>
              {product.description && (
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Warna <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DA291] focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">Pilih Warna</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Ukuran <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8DA291] focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="">Pilih Ukuran</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Tambahan Logo (Opsional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8DA291] transition-colors duration-200">
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <IoCloudUpload className="text-4xl text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Klik untuk upload logo
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG hingga 10MB
                    </p>
                    {logoFile && (
                      <p className="text-xs text-[#8DA291] mt-2">
                        File terpilih: {logoFile.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Jumlah
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  disabled={quantity <= 1}
                >
                  <IoRemove
                    className={
                      quantity <= 1
                        ? "text-gray-300 cursor-pointer"
                        : "text-gray-600 cursor-pointer"
                    }
                  />
                </button>
                <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 rounded-full border  cursor-pointer border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <IoAdd className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-2xl font-bold text-[#2f3e34]">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleBuy}
              disabled={!selectedColor || !selectedSize}
              className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-3  cursor-pointer transition-all duration-200 ${
                selectedColor && selectedSize
                  ? "bg-[#2f3e34] text-white hover:bg-[#1f2a22] hover:shadow-lg transform hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <IoCartOutline className="text-xl" />
              Masukkan Keranjang
            </button>

            {(!selectedColor || !selectedSize) && (
              <p className="text-sm text-red-500 text-center">
                * Silakan pilih warna dan ukuran terlebih dahulu
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
