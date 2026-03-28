import ProductCard from "./ProductCard";

const NewArrivals = ({ newArrivals }) => (
  <div className="max-w-screen-xl mx-auto px-4 sm:px-8 my-6 sm:my-10">
    <h1 className="text-2xl font-bold mb-5 text-[#2f3e34] border-l-4 border-[#8da291] pl-3">
      Terbaru
    </h1>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
      {newArrivals.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showOriginalPrice={false}
          showRating={false}
          showSoldCount={false}
          showDiscount={false}
        />
      ))}
    </div>
  </div>
);

export default NewArrivals;
