import { useState, useEffect } from "react";
import {
  IoCheckmarkCircle,
  IoCard,
  IoWallet,
  IoLocationOutline,
  IoAdd,
  IoTrash,
  IoClose,
  IoRocketOutline,
  IoCarOutline,
  IoBoatOutline,
  IoCreateOutline,
} from "react-icons/io5";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import { formatCurrency } from "../utils/currency";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [selectedShipping, setSelectedShipping] = useState("regular");
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [isGuaranteeEnabled, setIsGuaranteeEnabled] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    isDefault: false,
  });
  const [countdown, setCountdown] = useState(3);

  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);

    // Load addresses from localStorage
    const savedAddresses = JSON.parse(localStorage.getItem("addresses")) || [];
    setAddresses(savedAddresses);

    // Set default selected address
    const defaultAddress = savedAddresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.id);
    } else if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0].id);
    }
  }, []);

  useEffect(() => {
    if (isTransactionComplete) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTransactionComplete, navigate]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getShippingCost = () => {
    const selectedOption = shippingOptions.find(
      (option) => option.id === selectedShipping
    );
    return selectedOption ? selectedOption.price : 0;
  };

  const getProtectionCost = () => {
    return Math.round(getCartTotal() * 0.02);
  };

  const getGuaranteeCost = () => {
    return Math.round(getCartTotal() * 0.05);
  };

  const getTotalWithShipping = () => {
    let total = getCartTotal() + getShippingCost();

    if (isProtectionEnabled) {
      total += getProtectionCost();
    }

    if (isGuaranteeEnabled) {
      total += getGuaranteeCost();
    }

    return total;
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Silakan pilih alamat pengiriman");
      return;
    }

    setIsTransactionComplete(true);
    // Clear cart
    localStorage.setItem("cart", "[]");
    setCartItems([]);

    // Trigger cart update in Navbar
    window.dispatchEvent(new Event("storage"));

    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const shippingOptions = [
    {
      id: "regular",
      name: "Reguler",
      estimate: "5-7 hari",
      price: getCartTotal() >= 100000 ? 0 : 7500,
      icon: IoCarOutline,
      description:
        getCartTotal() >= 100000
          ? "Gratis ongkir untuk pembelian di atas Rp 100.000"
          : "Pengiriman standar dengan keamanan terjamin",
    },
    {
      id: "express",
      name: "Express",
      estimate: "2-3 hari",
      price: 15000,
      icon: IoRocketOutline,
      description: "Pengiriman cepat untuk kebutuhan mendesak",
    },
    {
      id: "same-day",
      name: "Same Day",
      estimate: "Hari ini",
      price: 25000,
      icon: IoBoatOutline,
      description: "Pengiriman di hari yang sama (area terbatas)",
    },
  ];

  const handleAddAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.postalCode
    ) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const addressToAdd = {
      ...newAddress,
      id: Date.now(),
      // Automatically set as default if no other addresses exist
      isDefault: addresses.length === 0 ? true : newAddress.isDefault,
    };

    let updatedAddresses = addresses;
    if (addressToAdd.isDefault) {
      updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    const newAddresses = [...updatedAddresses, addressToAdd];
    setAddresses(newAddresses);
    setSelectedAddress(addressToAdd.id);
    localStorage.setItem("addresses", JSON.stringify(newAddresses));

    setNewAddress({
      name: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false,
    });
    setIsAddingAddress(false);
  };

  const handleEditAddress = () => {
    if (
      !newAddress.name ||
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.postalCode
    ) {
      alert("Mohon lengkapi semua field");
      return;
    }

    let updatedAddresses = addresses.map((addr) => {
      if (addr.id === editingAddressId) {
        return { ...newAddress, id: editingAddressId };
      }
      return addr;
    });

    // If setting this address as default, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === editingAddressId,
      }));
    }

    setAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));

    setNewAddress({
      name: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false,
    });
    setIsEditingAddress(false);
    setEditingAddressId(null);
  };

  const startEditingAddress = (address) => {
    setNewAddress(address);
    setIsEditingAddress(true);
    setEditingAddressId(address.id);
    setIsAddingAddress(false);
  };

  const cancelAddressForm = () => {
    setIsAddingAddress(false);
    setIsEditingAddress(false);
    setEditingAddressId(null);
    setNewAddress({
      name: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      isDefault: false,
    });
  };

  const handleDeleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== addressId);
    setAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));

    if (selectedAddress === addressId) {
      setSelectedAddress(null); // Changed from updatedAddresses[0]?.id to null
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSetDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
  };

  const selectedAddressData = addresses.find(
    (addr) => addr.id === selectedAddress
  );

  if (isTransactionComplete) {
    return (
      <div className="min-h-[calc(100vh-146px)]  bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoCheckmarkCircle className="text-4xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Transaksi Berhasil!
          </h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah berbelanja. Pesanan Anda sedang diproses.
          </p>
          <div className="text-sm text-gray-500">
            Mengalihkan ke beranda dalam {countdown} detik...
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-146px)] bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineShoppingBag className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Keranjang Kosong
          </h2>
          <p className="text-gray-600 mb-6">
            Tidak ada item dalam keranjang untuk checkout.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#2f3e34] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1f2a22] transition-colors duration-200"
          >
            Kembali Berbelanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-146px)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 text-sm mt-2">
            Tinjau pesanan Anda dan selesaikan pembelian
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address, Shipping and Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-6">
                Ringkasan Pesanan ({getTotalItems()} item)
              </h2>

              <div className="space-y-4 text-sm">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-gray-100 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.color} - {item.size}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Address Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[15px] font-semibold text-gray-900">
                  Alamat Pengiriman
                </h2>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-[#3b5042] text-sm font-medium duration-200 cursor-pointer hover:text-[#0f1411] transition-colors"
                >
                  Kelola Alamat
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-center text-gray-500 py-4">
                    <p className="text-sm">
                      Silakan tambah alamat pengiriman untuk melanjutkan
                      checkout
                    </p>
                  </div>
                </div>
              ) : !selectedAddressData ? (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-center text-gray-500 py-4">
                    <p className="text-sm">Silakan pilih alamat pengiriman</p>
                  </div>
                </div>
              ) : (
                selectedAddressData && (
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {selectedAddressData.name}
                          </span>
                          {selectedAddressData.isDefault && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedAddressData.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedAddressData.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedAddressData.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedAddressData.city},{" "}
                          {selectedAddressData.postalCode}
                        </p>
                      </div>
                      <IoLocationOutline className="text-xl text-gray-400 mt-1" />
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Shipping Options - Only show when address is selected */}
            {selectedAddressData && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-[15px] font-semibold text-gray-900 mb-6">
                  Pilih Pengiriman
                </h2>

                <div className="space-y-3">
                  {shippingOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedShipping === option.id
                            ? "border-[#2f3e34] bg-green-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="mr-4 text-[#2f3e34] focus:ring-[#2f3e34]"
                        />
                        <IconComponent className="text-xl text-gray-600 mr-4" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {option.name}
                            </span>
                            <span className="font-semibold text-gray-900 text-sm">
                              {option.price === 0
                                ? "Gratis"
                                : formatCurrency(option.price)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-green-600 font-medium">
                              Estimasi: {option.estimate}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Method and Order Total */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm text-sm p-6">
                <h2 className="text-[15px] font-semibold text-gray-900 mb-6">
                  Metode Pembayaran
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <IoCard className="text-xl text-gray-600 mr-3" />
                    <span className="font-medium">Kartu Kredit/Debit</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      checked={selectedPayment === "wallet"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-3"
                    />
                    <IoWallet className="text-xl text-gray-600 mr-3" />
                    <span className="font-medium">E-Wallet</span>
                  </label>
                </div>
              </div>

              {/* Additional Services Section */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-[15px] font-semibold text-gray-900 mb-6">
                  Layanan Tambahan
                </h2>

                {/* Protection Option */}
                <div className="mb-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isProtectionEnabled}
                      onChange={(e) => setIsProtectionEnabled(e.target.checked)}
                      className="mt-1 text-[#2f3e34] focus:ring-[#2f3e34]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 text-sm">
                          Proteksi Pesanan
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {formatCurrency(getProtectionCost())}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Lindungi pesanan Anda dari kerusakan dan kehilangan
                        selama pengiriman
                      </p>
                    </div>
                  </label>
                </div>

                {/* Guarantee Option */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGuaranteeEnabled}
                      onChange={(e) => setIsGuaranteeEnabled(e.target.checked)}
                      className="mt-1 text-[#2f3e34] focus:ring-[#2f3e34]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 text-sm">
                          Jaminan Revisi & Pengembalian Dana
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {formatCurrency(getGuaranteeCost())}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Dapatkan jaminan revisi gratis atau pengembalian dana
                        100% jika tidak puas
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                <h2 className="text-md font-semibold text-gray-900 mb-6">
                  Total Pesanan
                </h2>

                <div className="space-y-3 mb-6 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} item)</span>
                    <span>{formatCurrency(parseFloat(getCartTotal()))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Pengiriman (
                      {
                        shippingOptions.find(
                          (option) => option.id === selectedShipping
                        )?.name
                      }
                      )
                    </span>
                    <span
                      className={
                        getShippingCost() === 0
                          ? "text-green-600"
                          : "text-gray-600"
                      }
                    >
                      {getShippingCost() === 0
                        ? "Gratis"
                        : formatCurrency(getShippingCost())}
                    </span>
                  </div>
                  {isProtectionEnabled && (
                    <div className="flex justify-between text-gray-600">
                      <span>Proteksi Pesanan</span>
                      <span>{formatCurrency(getProtectionCost())}</span>
                    </div>
                  )}
                  {isGuaranteeEnabled && (
                    <div className="flex justify-between text-gray-600">
                      <span>Jaminan Revisi & Refund</span>
                      <span>{formatCurrency(getGuaranteeCost())}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Pajak</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-[15px] font-semibold text-gray-900">
                      <span>Total</span>
                      <span>
                        {formatCurrency(parseFloat(getTotalWithShipping()))}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#2f3e34] flex justify-center items-center gap-2 text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1f2a22] hover:shadow-lg transform transition-all duration-200 cursor-pointer"
                >
                  <svg
                    className="mt-0.5"
                    width="18"
                    height="18"
                    fill="currentcolor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.641 5.18a3.46 3.46 0 0 0 1.439.37 1.68 1.68 0 0 1 1.61 1.84v3.5c0 5.42-3.37 8.21-6.69 10.21a3 3 0 0 1-2.01.64 3.7 3.7 0 0 1-2-.6c-4.05-2.33-6.76-4.97-6.76-10.25v-3.5a1.75 1.75 0 0 1 1.65-1.84 3.57 3.57 0 0 0 2.41-1.26 6.46 6.46 0 0 1 4.69-2.05 5.9 5.9 0 0 1 4.51 2 3.46 3.46 0 0 0 1.151.94ZM13.23 19.89c4.25-2.61 6-5.21 6-9l.02-3.5c0-.08-.01-.34-.15-.34a4.89 4.89 0 0 1-3.62-1.72A4.42 4.42 0 0 0 12 3.74a5 5 0 0 0-3.71 1.67 4.92 4.92 0 0 1-3.35 1.64c-.07 0-.15.18-.15.34v3.54c0 4.57 2.28 6.82 6 8.95.362.25.79.39 1.23.4a1.51 1.51 0 0 0 1.07-.28l.14-.11ZM11 13l3-3a.75.75 0 0 1 1 1l-3.46 3.53a.74.74 0 0 1-.53.22.78.78 0 0 1-.51-.2l-2.08-1.91a.75.75 0 0 1 1-1.11L11 13Z"
                    />
                  </svg>
                  Bayar Sekarang
                </button>

                <p className="text-[9px] text-gray-500 text-center mt-4">
                  Dengan melakukan pemesanan ini, kamu menyetujui Ketentuan
                  Layanan kami
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Management Modal */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ease-in-out ${
          isAddressModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className={`bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out ${
              isAddressModalOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Kelola Alamat
                </h3>
                <button
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    cancelAddressForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoClose className="text-2xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Add New Address Button */}
              {!isAddingAddress && !isEditingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 hover:border-[#2f3e34] hover:text-[#2f3e34] transition-colors mb-6"
                >
                  <IoAdd className="text-2xl mx-auto mb-2" />
                  <span className="font-medium">Tambah Alamat Baru</span>
                </button>
              )}

              {/* Add/Edit Address Form */}
              {(isAddingAddress || isEditingAddress) && (
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {isEditingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nama alamat (contoh: Rumah, Kantor)"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                      className="col-span-1 md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3e34] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      value={newAddress.fullName}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          fullName: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3e34] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Nomor telepon"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3e34] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Alamat lengkap"
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                      className="col-span-1 md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3e34] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Kota"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3e34] focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Kode pos"
                      value={newAddress.postalCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3e34] focus:border-transparent"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          addresses.length === 0 ? true : newAddress.isDefault
                        }
                        disabled={addresses.length === 0}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            isDefault: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        Jadikan alamat utama
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={
                        isEditingAddress ? handleEditAddress : handleAddAddress
                      }
                      className="bg-[#2f3e34] cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1f2a22] transition-colors"
                    >
                      {isEditingAddress ? "Update" : "Simpan"}
                    </button>
                    <button
                      onClick={cancelAddressForm}
                      className="border cursor-pointer border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                      selectedAddress === address.id
                        ? "border-[#2f3e34] bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {address.name}
                          </span>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              Utama
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 font-medium">
                          {address.fullName}
                        </p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600">
                          {address.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.postalCode}
                        </p>

                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingAddress(address);
                            }}
                            className="text-xs cursor-pointer text-[#2f3e34] hover:text-[#1f2a22] font-medium flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg transition-colors hover:bg-green-200"
                          >
                            <IoCreateOutline className="text-sm" />
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefaultAddress(address.id);
                              }}
                              className="text-xs text-[#2f3e34] hover:text-[#1f2a22] font-medium"
                            >
                              Jadikan Alamat Utama
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        className="text-red-500 cursor-pointer hover:text-red-700 ml-4"
                      >
                        <IoTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
