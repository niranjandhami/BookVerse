import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="block w-[260px] m-4 bg-[#1b1b1b] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 duration-300"
    >
      <div className="relative bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[360px] object-contain p-2"
        />

        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <h2 className="text-white text-lg font-bold line-clamp-1">
          {product.name}
        </h2>

        <p className="text-yellow-400 text-xl font-bold mt-2">
          ₹{product.price}
        </p>
      </div>
    </Link>
  );
};

export default Product;