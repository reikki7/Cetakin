import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import ProductCard from "../components/ProductCard";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { searchResults, isSearching, performSearch } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  if (isSearching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8da291]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hasil Pencarian
          </h1>
          {query && (
            <p className="text-gray-600">
              Menampilkan {searchResults.length} hasil untuk "{query}"
            </p>
          )}
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak ada produk ditemukan
            </h2>
            <p className="text-gray-500 mb-4">
              Coba gunakan kata kunci yang berbeda atau lebih umum
            </p>
            <Link
              to="/"
              className="inline-block bg-[#2f3e34] text-white px-6 py-2 rounded-md hover:bg-[#1f2a22] transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showOriginalPrice={true}
                showRating={true}
                showSoldCount={true}
                showDiscount={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
