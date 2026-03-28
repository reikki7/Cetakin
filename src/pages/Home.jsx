import { useEffect, useState } from "react";
import poloPria from "../utils/Polo_Pria.json";
import poloWanita from "../utils/Polo_Shirt_Wanita.json";
import dekorasiCustom from "../utils/Dekorasi_Custom.json";

import HeroSection from "../components/HeroSection";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const combinedProducts = [...poloPria, ...poloWanita, ...dekorasiCustom];

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

    const mapCategory = (originalCategory) => {
      const categoryMap = {
        "Polo Pria": "Pakaian",
        "Polo Shirt Wanita": "Pakaian",
        "Dekorasi Custom": "Dekorasi",
      };

      return categoryMap[originalCategory] || originalCategory;
    };

    const mappedProducts = combinedProducts.map((product) => {
      let image = product.details?.detail_images?.[0]?.preview?.[0];

      return {
        ...product,
        title: capitalizeTitle(product.title), // Apply title capitalization
        price: product.displayed_price_final ?? product.price,
        image,
        category: mapCategory(product.label ?? product.category),
      };
    });

    // filter out any product with no valid image
    const validProducts = mappedProducts.filter((p) => p.image);
    // then shuffle & pick
    const shuffledProducts = validProducts.sort(() => Math.random() - 0.5);
    setNewArrivals(shuffledProducts.slice(0, 4));
    setBestSellers(shuffledProducts.slice(4, 19));
  }, []);

  return (
    <div>
      <HeroSection />

      {newArrivals.length === 0 && bestSellers.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8da291]"></div>
        </div>
      ) : (
        <>
          {newArrivals.length > 0 && (
            <section className="py-6 border-b border-gray-200">
              <NewArrivals newArrivals={newArrivals} />
            </section>
          )}

          {bestSellers.length > 0 && (
            <section className="py-6">
              <BestSellers bestSellers={bestSellers} />
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
