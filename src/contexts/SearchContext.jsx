import { createContext, useContext, useState } from "react";
import poloPria from "../utils/Polo_Pria.json";
import poloWanita from "../utils/Polo_Shirt_Wanita.json";
import dekorasiCustom from "../utils/Dekorasi_Custom.json";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);

    try {
      // Combine all products (same logic as Home.jsx)
      const allProducts = [...poloPria, ...poloWanita, ...dekorasiCustom];

      // Process products with the same logic as Home.jsx
      const processedProducts = allProducts.map((product) => {
        const capitalizeTitle = (title) => {
          if (!title) return "";
          return title
            .split(" ")
            .map((word) => {
              if (word === word.toUpperCase() && word.length > 1) {
                return word;
              }
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
        };

        const mapCategory = (originalCategory) => {
          const categoryMap = {
            "Polo Pria": "Pakaian",
            "Polo Shirt Wanita": "Pakaian",
            "Dekorasi Custom": "Dekorasi",
          };
          return categoryMap[originalCategory] || originalCategory;
        };

        let image = product.details?.detail_images?.[0]?.preview?.[0];

        return {
          ...product,
          title: capitalizeTitle(product.title),
          price: product.displayed_price_final ?? product.price,
          image,
          category: mapCategory(product.label ?? product.category),
        };
      });

      // Filter products based on search query
      const filteredProducts = processedProducts
        .filter((product) => {
          const searchLower = query.toLowerCase();
          return (
            product.title?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) ||
            product.details?.description?.toLowerCase().includes(searchLower) ||
            product.label?.toLowerCase().includes(searchLower)
          );
        })
        .filter((p) => p.image); // Only include products with valid images

      console.log("Search results:", filteredProducts); // Debug log
      setSearchResults(filteredProducts);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
