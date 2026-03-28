import ProductCard from "./ProductCard";

const BestSellers = ({ bestSellers }) => (
  <div className="max-w-screen-xl mx-auto px-4 sm:px-8 my-6 sm:my-10">
    <h1 className="text-2xl font-bold mb-5 text-[#2f3e34] border-l-4 border-[#8da291] pl-3">
      Terpopuler
    </h1>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-1 gap-y-6">
      {bestSellers.map((product) => (
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
  </div>
);

export default BestSellers;
