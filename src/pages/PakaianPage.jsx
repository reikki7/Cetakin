import { useState, useEffect } from "react";
import poloPria from "../utils/Polo_Pria.json";
import poloWanita from "../utils/Polo_Shirt_Wanita.json";
import ProductCard from "../components/ProductCard";
import { IoIosSearch } from "react-icons/io";

const PakaianPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const capitalizeTitle = (title) => {
      if (!title) return "";
      return title
        .split(" ")
        .map((w) =>
          w === w.toUpperCase() && w.length > 1
            ? w
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join(" ");
    };

    const mapped = [...poloPria, ...poloWanita].map((product) => {
      let image =
        product.image_url && !product.image_url.toLowerCase().endsWith(".svg")
          ? product.image_url
          : null;

      if (!image && product.details?.detail_images?.length > 0) {
        const previews = product.details.detail_images[0]?.preview || [];
        for (const img of previews) {
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
        image,
        category:
          product.label === "Polo Pria" ? "Pakaian Pria" : "Pakaian Wanita",
      };
    });

    // Exclude items without any valid image
    const validProducts = mapped.filter((p) => p.image);
    setProducts(validProducts);
    setIsLoading(false);
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section for Pakaian */}
      <div className="bg-[#f8f9fa] py-12 mb-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2f3e34] mb-4">
            Pakaian Custom
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Temukan koleksi polo shirt berkualitas tinggi untuk pria dan wanita
            yang dapat disesuaikan dengan kebutuhan Anda.
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 mb-16">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex border border-black/20 items-center p-2 rounded-md max-w-5xl mx-auto">
            <input
              type="text"
              placeholder="Cari pakaian..."
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

export default PakaianPage;
