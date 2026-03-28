import { useState, useRef, useEffect } from "react";
import { IoClose, IoSend, IoChatbubbleOutline } from "react-icons/io5";
import { formatCurrency } from "../utils/currency";

const Chat = ({
  product = null,
  onClose = null,
  isProductSpecific = false,
}) => {
  const [isOpen, setIsOpen] = useState(isProductSpecific ? true : false);
  // Add state for currentProduct that will be used by the event listener
  const [currentProduct, setCurrentProduct] = useState(product);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: product
        ? `Halo! Saya tertarik dengan produk "${product.title}". Bisakah Anda memberikan informasi lebih lanjut?`
        : "Halo! Selamat datang di toko kami. Ada yang bisa kami bantu?",
      sender: product ? "user" : "seller",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isProductMessage: !!product,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update this effect to use currentProduct instead of product
  useEffect(() => {
    if (currentProduct && !product) {
      // Only add if triggered by event, not initial prop
      // Reset messages when a new product is set
      setMessages([
        {
          id: 1,
          text: `Halo! Saya tertarik dengan produk "${currentProduct.title}". Bisakah Anda memberikan informasi lebih lanjut?`,
          sender: "user",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isProductMessage: true,
        },
      ]);

      // Add seller response when product is provided
      setTimeout(() => {
        const sellerResponse = {
          id: 2,
          text: "Terima kasih sudah bertanya! Saya akan dengan senang hati membantu Anda dengan produk ini. Ada yang ingin Anda ketahui lebih lanjut?",
          sender: "seller",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, sellerResponse]);
      }, 1000);
    }
  }, [currentProduct, product]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate seller response after 1-2 seconds
    setTimeout(() => {
      const responses =
        currentProduct || product
          ? [
              "Produk ini tersedia dalam berbagai varian. Apakah ada warna atau ukuran khusus yang Anda inginkan?",
              "Untuk produk ini, kami juga menyediakan layanan custom design. Apakah Anda tertarik?",
              "Stok produk ini masih tersedia. Apakah Anda ingin mengetahui estimasi pengiriman?",
              "Produk ini sangat populer dan kualitasnya terjamin. Ada pertanyaan lain yang bisa saya bantu?",
              "Untuk pemesanan dalam jumlah banyak, kami memberikan diskon khusus. Berapa jumlah yang Anda butuhkan?",
            ]
          : [
              "Terima kasih atas pertanyaannya! Kami akan membantu Anda.",
              "Skibidi.",
              "Kami siap membantu dengan pesanan dan customization Anda.",
              "Apakah ada produk khusus yang Anda cari?",
              "Kami melayani custom design sesuai kebutuhan Anda.",
            ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const sellerMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "seller",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, sellerMessage]);
    }, 1000 + Math.random() * 1000);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
      // Reset currentProduct when closing chat
      if (currentProduct) setCurrentProduct(null);
    }
  };

  useEffect(() => {
    const handleProductChat = (event) => {
      setIsOpen(true);
      setCurrentProduct(event.detail.product);
    };

    window.addEventListener("openProductChat", handleProductChat);

    return () => {
      window.removeEventListener("openProductChat", handleProductChat);
    };
  }, []);

  useEffect(() => {
    const handleCartOpen = () => setIsCartOpen(true);
    const handleCartClose = () => setIsCartOpen(false);

    window.addEventListener("cartSidebarOpen", handleCartOpen);
    window.addEventListener("cartSidebarClosed", handleCartClose);

    return () => {
      window.removeEventListener("cartSidebarOpen", handleCartOpen);
      window.removeEventListener("cartSidebarClosed", handleCartClose);
    };
  }, []);

  // If this is not a product-specific chat, show the floating button
  if (!isProductSpecific) {
    return (
      <>
        {/* Chat Toggle Button - Move to left when cart is open */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-6 w-14 h-14 bg-[#2f3e34] text-white rounded-full shadow-lg hover:bg-[#1f2a22] transition-all duration-300 z-50 flex items-center justify-center ${
            isOpen ? "rotate-180" : "hover:scale-110"
          } ${isCartOpen ? "right-[410px] md:right-[410px]" : "right-6"}`}
        >
          {isOpen ? (
            <IoClose className="text-2xl" />
          ) : (
            <IoChatbubbleOutline className="text-2xl" />
          )}
        </button>

        {/* Chat Window - Move to left when cart is open */}
        <div
          className={`fixed bg-white rounded-lg shadow-2xl transition-all duration-300 z-50 w-80 ${
            isOpen
              ? "opacity-100 visible transform translate-y-0"
              : "opacity-0 invisible transform translate-y-4 pointer-events-none"
          } ${isCartOpen ? "right-[410px] md:right-[410px]" : "right-6"}`}
          style={{
            bottom: currentProduct || product ? "80px" : "96px",
            height: currentProduct || product ? "500px" : "384px",
          }}
        >
          <ChatContent
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            handleClose={handleClose}
            messagesEndRef={messagesEndRef}
            product={currentProduct || product}
          />
        </div>
      </>
    );
  }

  // For product-specific chat, show the same floating style but larger - Also move when cart is open
  return (
    <div
      className={`fixed bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 z-50 w-80 ${
        isOpen
          ? "opacity-100 visible transform translate-y-0"
          : "opacity-0 invisible transform translate-y-4 pointer-events-none"
      } ${isCartOpen ? "right-[410px] md:right-[410px]" : "right-6"}`}
      style={{
        bottom: "24px",
        height: currentProduct || product ? "500px" : "384px",
      }}
    >
      <ChatContent
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleClose={handleClose}
        messagesEndRef={messagesEndRef}
        product={currentProduct || product}
      />
    </div>
  );
};

// Separate component for chat content to avoid duplication
const ChatContent = ({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleClose,
  messagesEndRef,
  product,
}) => (
  <>
    {/* Chat Header */}
    <div className="bg-[#2f3e34] text-white p-4 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8da291] rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">CS</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Customer Service</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 mt-0.5 bg-green-400 rounded-full"></div>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <IoClose className="text-xl" />
        </button>
      </div>
    </div>

    {/* Product Context Card - Only show if product is provided */}
    {product && (
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-3 bg-white p-3 rounded-lg border">
          <img
            src={
              product.image || product.details?.detail_images?.[0]?.preview?.[0]
            }
            alt={product.title}
            className="w-12 h-12 object-cover rounded"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23f3f4f6"/><text x="24" y="24" text-anchor="middle" dy="0.3em" font-size="16">📷</text></svg>';
            }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
              {product.title}
            </h4>
            <p className="text-sm font-bold text-[#2f3e34] mt-1">
              {formatCurrency(product.displayed_price_final || product.price)}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          💬 Menanyakan tentang produk di atas
        </p>
      </div>
    )}

    {/* Chat Messages */}
    <div
      className="flex-1 p-4 overflow-y-auto bg-gray-50"
      style={{ height: product ? "260px" : "250px" }}
    >
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                message.sender === "user"
                  ? "bg-[#2f3e34] text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm border"
              } ${
                message.isProductMessage ? "border-l-4 border-l-[#8da291]" : ""
              }`}
            >
              <p className="mb-1">{message.text}</p>
              <p
                className={`text-xs ${
                  message.sender === "user" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>

    {/* Chat Input */}
    <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan Anda..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#8da291] focus:border-transparent outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="w-10 h-10 bg-[#2f3e34] text-white rounded-full flex items-center justify-center hover:bg-[#1f2a22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IoSend className="text-sm" />
        </button>
      </form>
    </div>
  </>
);

export default Chat;
