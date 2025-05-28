import { useEffect, useState } from "react";
import axios from "axios";

import HeroSection from "../components/HeroSection";
import NewArrivals from "../components/NewArrivals";
import BestSellers from "../components/BestSellers";

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const [menResponse, womenResponse] = await Promise.all([
          axios.get(
            "https://fakestoreapi.com/products/category/men's%20clothing"
          ),
          axios.get(
            "https://fakestoreapi.com/products/category/women's%20clothing"
          ),
        ]);

        const combinedProducts = [...menResponse.data, ...womenResponse.data];
        console.log("Combined Products:", combinedProducts);
        const shuffledProducts = combinedProducts.sort(
          () => Math.random() - 0.5
        );

        const newArrivalsItems = shuffledProducts.slice(0, 4);
        const bestSellersItems = shuffledProducts.slice(4);

        setNewArrivals(newArrivalsItems);
        setBestSellers(bestSellersItems);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchNewArrivals();
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
          {newArrivals.length > 0 && <NewArrivals newArrivals={newArrivals} />}
          {bestSellers.length > 0 && (
            <div className="bg-[#8da291] py-1">
              <BestSellers bestSellers={bestSellers} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
