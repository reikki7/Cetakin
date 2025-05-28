import { useState, useEffect } from "react";
import webIcon from "../assets/webIcon.png";
import {
  IoIosSearch,
  IoMdPerson,
  IoIosArrowDown,
  IoMdTrash,
} from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import categoryItem1 from "../assets/kategori-item1.jpg";
import categoryItem2 from "../assets/kategori-item2.webp";
import categoryItem3 from "../assets/kategori-item3.webp";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const updateCartItems = () => {
      const items = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(items);
    };

    updateCartItems();
    window.addEventListener("storage", updateCartItems);

    return () => window.removeEventListener("storage", updateCartItems);
  }, []);

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const getCartTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.totalPrice, 0)
      .toFixed(2);
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
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
        <div className="hidden md:flex border border-black/20 items-center p-2 rounded-sm flex-1 mx-6">
          <input
            type="text"
            placeholder="Cari produk"
            className="bg-transparent outline-none px-4 py-2 w-full"
          />
          <button className="text-black/40 cursor-pointer duration-200 hover:text-black transition-colors">
            <IoIosSearch className="text-2xl mr-1.5" />
          </button>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center cursor-pointer gap-4 px-4 py-2 rounded-md">
            <IoMdPerson className="text-2xl" />
            <span>Masuk</span>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
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
        <div className="flex border border-black/20 items-center p-2 rounded-sm">
          <input
            type="text"
            placeholder="Cari produk"
            className="bg-transparent outline-none px-4 py-2 w-full"
          />
          <button className="text-black/40">
            <IoIosSearch className="text-2xl mr-1.5" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation Menu */}
      <div className="hidden md:flex justify-center mt-4 relative">
        <ul className="flex gap-10 tracking-wide text-gray-500">
          <li className="cursor-pointer" onMouseEnter={handleMouseEnter}>
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

            {/* Dropdown Menu */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-[700px] p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
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
            <a href="">Pakaian</a>
          </li>
          <li className="hover:text-accent duration-200 cursor-pointer">
            <a href="">Aksesori</a>
          </li>
          <li className="hover:text-accent duration-200 cursor-pointer">
            <a href="">Dekorasi</a>
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
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
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
              <Link to="/" className="block text-gray-700">
                Beranda
              </Link>
            </li>
            <li>
              <a href="" className="block text-gray-700">
                Pakaian
              </a>
            </li>
            <li>
              <a href="" className="block text-gray-700">
                Aksesori
              </a>
            </li>
            <li>
              <a href="" className="block text-gray-700">
                Dekorasi
              </a>
            </li>
            <li className="pt-6 border-t">
              <button className="flex items-center gap-2 text-gray-700">
                <IoMdPerson />
                <span>Masuk</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
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
          </ul>
        </div>
      </div>

      {/* Cart Sidebar - Adjust z-index */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Keranjang</h2>
            <button
              onClick={() => setIsCartOpen(false)}
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
                        {item.color} - {item.size}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm">
                          ${item.price} × {item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm duration-200 cursor-pointer hover:text-red-700"
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
                    ${getCartTotal()}
                  </span>
                </div>
                <button className="w-full py-3 duration-200 cursor-pointer bg-[#2f3e34] text-white rounded-lg font-semibold hover:bg-[#1f2a22] transition-colors">
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay - Adjust z-index */}
      {(isCartOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => {
            setIsCartOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
