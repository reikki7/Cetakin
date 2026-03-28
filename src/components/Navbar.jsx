import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import webIcon from "../assets/webIcon.png";
import {
  IoIosSearch,
  IoMdPerson,
  IoIosArrowDown,
  IoMdTrash,
} from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiOutlineSquares2X2, HiOutlinePaintBrush } from "react-icons/hi2";
import categoryItem1 from "../assets/kategori-item1.jpg";
import categoryItem2 from "../assets/kategori-item2.webp";
import categoryItem3 from "../assets/kategori-item3.webp";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { formatCurrency } from "../utils/currency";
import { useWishlist } from "../contexts/WishlistContext";
import { IoMdHeart } from "react-icons/io";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const navigate = useNavigate();
  const { performSearch } = useSearch();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const updateCartItems = () => {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(items);
    };

    updateCartItems();
    // Listen for both storage events and custom cartUpdated
    window.addEventListener("storage", updateCartItems);
    window.addEventListener("cartUpdated", updateCartItems);

    return () => {
      window.removeEventListener("storage", updateCartItems);
      window.removeEventListener("cartUpdated", updateCartItems);
    };
  }, []);

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // dispatch custom event so navbar updates immediately
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);

  const handleCheckout = () => {
    closeCart(); // Use closeCart() instead
    navigate("/checkout");
  };

  // Updated hover handlers with timeout for better UX
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay to prevent accidental closing
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    // Handle login/register logic here
    console.log(isLoginMode ? "Login" : "Register");
    setIsAuthModalOpen(false);
  };

  const handleMobileAuth = () => {
    setIsMobileMenuOpen(false);
    navigate("/auth");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const openCart = () => {
    setIsCartOpen(true);
    // Dispatch event for chat component
    window.dispatchEvent(new CustomEvent("cartSidebarOpen"));
  };

  const closeCart = () => {
    setIsCartOpen(false);
    // Dispatch event for chat component
    window.dispatchEvent(new CustomEvent("cartSidebarClosed"));
  };

  const openWishlist = () => {
    setIsWishlistOpen(true);
    // Dispatch event for chat component
    window.dispatchEvent(new CustomEvent("wishlistSidebarOpen"));
  };

  const closeWishlist = () => {
    setIsWishlistOpen(false);
    // Dispatch event for chat component
    window.dispatchEvent(new CustomEvent("wishlistSidebarClosed"));
  };

  const handleProductClick = (product) => {
    const productSlug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    closeWishlist();
    navigate(`/produk/${productSlug}`, { state: { product } });
  };

  const getVariantLabel = (item) => {
    const variants = item?.variants;
    if (!variants || typeof variants !== "object")
      return "Varian tidak tersedia";

    const values = Object.values(variants).filter(Boolean);
    return values.length ? values.join(" • ") : "Varian tidak tersedia";
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img
              src={webIcon}
              alt="web icon"
              className="w-16 md:w-20 mx-2 md:mx-5"
            />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex border border-black/20 items-center p-2 rounded-sm flex-1 mx-6"
          >
            <input
              type="text"
              placeholder="Cari produk"
              value={searchQuery}
              onChange={handleSearchInput}
              className="bg-transparent outline-none px-4 py-2 w-full"
            />
            <button
              type="submit"
              className="text-black/40 cursor-pointer duration-200 hover:text-black transition-colors"
            >
              <IoIosSearch className="text-2xl mr-1.5" />
            </button>
          </form>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center cursor-pointer gap-4 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <IoMdPerson className="text-2xl" />
              <span>Masuk</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              className="relative rounded-full mx-2 bg-gray-100 aspect-square flex items-center gap-4 px-4 py-2 cursor-pointer duration-150 hover:bg-gray-200 transition-colors"
            >
              <IoMdHeart
                className={
                  wishlistItems.length > 0 ? "text-red-500" : "text-gray-400"
                }
              />
            </button>

            <button
              onClick={openCart}
              className="relative rounded-full mx-2 bg-gray-100 aspect-square flex items-center gap-4 px-4 py-2 cursor-pointer duration-150 hover:bg-gray-200 transition-colors"
            >
              <IoCartOutline className="text-2xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl p-2"
          >
            <HiMenuAlt3 />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <form
            onSubmit={handleSearch}
            className="flex border border-black/20 items-center p-2 rounded-sm"
          >
            <input
              type="text"
              placeholder="Cari produk"
              value={searchQuery}
              onChange={handleSearchInput}
              className="bg-transparent outline-none px-4 py-2 w-full"
            />
            <button type="submit" className="text-black/40">
              <IoIosSearch className="text-2xl mr-1.5" />
            </button>
          </form>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex justify-center mt-4 relative">
          <ul className="flex gap-10 tracking-wide text-gray-500">
            <li
              className="cursor-pointer relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="hover:text-accent duration-200 flex items-center gap-1 border-r border-gray-200 pr-8">
                <span className="flex items-center gap-1">
                  <HiOutlineSquares2X2 />
                  Kategori
                </span>
                <IoIosArrowDown
                  className={`text-sm transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Dropdown Menu - Remove the gap and adjust positioning */}
              <div
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-[700px] p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
                  isDropdownOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
              >
                <div className="py-2 flex justify-between">
                  <div>
                    <img
                      src={categoryItem1}
                      alt="printing"
                      className="w-64 rounded-2xl px-2 py-2"
                    />
                    <div className="px-2 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-2">
                      Produk Printing
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Digital Printing
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Sticker Custom
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Kartu Nama & Undangan
                    </a>
                  </div>

                  <div>
                    <img
                      src={categoryItem2}
                      alt="printing"
                      className="w-64 rounded-2xl px-2 py-2"
                    />
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-2">
                      Produk Kustom
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Pakaian Custom
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Merchandise
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Dekorasi Rumah
                    </a>
                  </div>

                  <div>
                    <img
                      src={categoryItem3}
                      alt="printing"
                      className="w-64 rounded-2xl px-2 py-2"
                    />
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-2">
                      Layanan
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Design Service
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Print On Demand
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                    >
                      Bulk Orders
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="hover:text-accent duration-200 cursor-pointer">
              <Link to="/">Beranda</Link>
            </li>
            <li className="hover:text-accent duration-200 cursor-pointer">
              <Link to="/pakaian">Pakaian</Link>
            </li>
            <li className="hover:text-accent duration-200 cursor-pointer">
              <Link to="/aksesori">Aksesori</Link>
            </li>
            <li className="hover:text-accent duration-200 cursor-pointer">
              <Link to="/dekorasi">Dekorasi</Link>
            </li>
            <li className="hover:text-accent duration-200 cursor-pointer border-l border-gray-200 pl-8">
              <Link to="/design-studio" className="flex items-center gap-1">
                <HiOutlinePaintBrush />
                Design Studio
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            <ul className="space-y-6">
              <li>
                <button className="flex items-center gap-2 text-gray-700">
                  <HiOutlineSquares2X2 />
                  <span>Kategori</span>
                </button>
              </li>
              <li>
                <Link
                  to="/"
                  className="block text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/pakaian"
                  className="block text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pakaian
                </Link>
              </li>
              <li>
                <Link
                  to="/aksesori"
                  className="block text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Aksesori
                </Link>
              </li>
              <li>
                <Link
                  to="/dekorasi"
                  className="block text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dekorasi
                </Link>
              </li>
              <li className="pt-6 border-t">
                <Link
                  to="/design-studio"
                  className="flex items-center gap-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HiOutlinePaintBrush />
                  Design Studio
                </Link>
              </li>
              <li className="pt-6 border-t">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true); // Use the same modal as desktop
                  }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <IoMdPerson />
                  <span>Masuk / Daftar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <IoCartOutline />
                  <span>Keranjang</span>
                  {cartItems.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWishlist();
                  }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <IoMdHeart className="text-red-500" />
                  <span>Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Auth Dropdown - Always rendered for smooth transitions */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-150 ease-in-out ${
            isAuthModalOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
        >
          {/* Invisible overlay to close dropdown */}
          <div
            className="fixed inset-0"
            onClick={() => setIsAuthModalOpen(false)}
          />

          {/* Auth Dropdown with smooth transitions */}
          <div
            className={`absolute top-20 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50 transform transition-all duration-150 ease-out ${
              isAuthModalOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4"
            }`}
          >
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-1">
                {isLoginMode ? "Masuk" : "Daftar"}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLoginMode ? "Masuk ke akun Anda" : "Buat akun baru"}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {!isLoginMode && (
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    !isLoginMode ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required={!isLoginMode}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f3e34] transition-all duration-150"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f3e34] transition-all duration-150"
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f3e34] transition-all duration-150"
                  placeholder="Masukkan password"
                />
              </div>

              {!isLoginMode && (
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    !isLoginMode ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    required={!isLoginMode}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f3e34] transition-all duration-150"
                    placeholder="Konfirmasi password"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-[#2f3e34] text-white rounded-md hover:bg-[#1f2a22] transition-all duration-150 font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoginMode ? "Masuk" : "Daftar"}
              </button>
            </form>

            <div className="mt-3 text-center">
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-[#2f3e34] hover:underline text-sm transition-all duration-150 hover:text-[#1f2a22]"
              >
                {isLoginMode
                  ? "Belum punya akun? Daftar di sini"
                  : "Sudah punya akun? Masuk di sini"}
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[9999] ${
            isWishlistOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Wishlist</h2>
              <button
                onClick={closeWishlist}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer duration-200"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <IoMdHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p>Wishlist kosong</p>
                  <p className="text-sm mt-2">Tambahkan produk favorit Anda</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 py-4"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-sm font-medium cursor-pointer hover:text-[#8da291] transition-colors"
                          onClick={() => handleProductClick(item)}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {getVariantLabel(item)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <button
                            onClick={() => handleProductClick(item)}
                            className="text-xs bg-[#2f3e34] text-white px-3 py-1 rounded hover:bg-[#1f2a22] transition-colors"
                          >
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-red-500 text-sm duration-200 hover:text-red-700"
                          >
                            <IoMdTrash className="inline-block text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cart Sidebar - Increase z-index to be above chat */}
        <div
          className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[9999] ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Keranjang</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer duration-200"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Keranjang kosong
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 py-4"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {getVariantLabel(item)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm">
                            {formatCurrency(item.price)}{" "}
                            <span className="text-black/50">
                              x {item.quantity}
                            </span>
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm duration-200 hover:text-red-700"
                          >
                            <IoMdTrash className="inline-block text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-[#2f3e34]">
                      {formatCurrency(getCartTotal())}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 duration-200 bg-[#2f3e34] text-white rounded-lg font-semibold cursor-pointer hover:bg-[#1f2a22] transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
