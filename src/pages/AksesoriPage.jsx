import { useState, useEffect } from "react";
import customGanci from "../utils/Custom_Ganci.json";
import caseCustomHp from "../utils/Case_Custom_Hp.json";
import ProductCard from "../components/ProductCard";
import { IoIosSearch } from "react-icons/io";

const AksesoriPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Format the title properly
    const capitalizeTitle = (title) => {
      if (!title) return "";

      return title
        .split(" ")
        .map((word) => {
          // If the word is already in full caps, keep it as is
          if (word === word.toUpperCase() && word.length > 1) {
            return word;
          }
          // Otherwise, capitalize first letter and make rest lowercase
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    };

    // Process and combine all products
    const mappedProducts = [...customGanci, ...caseCustomHp].map((product) => {
      // Check if product has valid image_url first
      let image =
        product.image_url && !product.image_url.toLowerCase().endsWith(".svg")
          ? product.image_url
          : null;

      // Only try to get detailed images if no valid image_url and if detail_images exists
      if (!image && product.details?.detail_images?.length > 0) {
        const previewImages = product.details.detail_images[0]?.preview || [];

        // Find first non-SVG image (if any)
        for (const img of previewImages) {
          if (img && !img.toLowerCase().endsWith(".svg")) {
            image = img;
            break;
          }
        }
      }

      return {
        ...product,
        title: capitalizeTitle(product.title),
        price: product.displayed_price_final ?? product.price,
        image, // This might be null, ProductCard handles that with the placeholder
        category: product.label?.includes("Ganci")
          ? "Ganci Custom"
          : "Case HP Custom",
      };
    });

    // filter out any product with no valid image
    const validProducts = mappedProducts.filter((p) => p.image);
    setProducts(validProducts);
    setIsLoading(false);
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#f8f9fa] py-12 mb-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2f3e34] mb-4">
            Aksesori Custom
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Temukan berbagai pilihan aksesori yang dapat disesuaikan dengan
            desain unik Anda. Dari ganci hingga case HP, jadikan merchandise
            Anda lebih personal.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 mb-16">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex border border-black/20 items-center p-2 rounded-md max-w-5xl mx-auto">
            <input
              type="text"
              placeholder="Cari aksesori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none px-4 py-2 w-full"
            />
            <button className="text-black/40">
              <IoIosSearch className="text-2xl mr-1.5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8da291]"></div>
          </div>
        ) : (
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  Tidak ada produk yang sesuai dengan pencarian Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showOriginalPrice={true}
                    showRating={true}
                    showSoldCount={true}
                    showDiscount={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AksesoriPage;
