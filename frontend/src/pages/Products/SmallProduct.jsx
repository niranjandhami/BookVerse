import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="block w-[20rem] ml-[2rem] p-3 hover:scale-105 transition duration-300"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-auto rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <h2 className="flex justify-between items-center">
          <span>{product.name}</span>

          <span className="bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
            ₹{product.price}
          </span>
        </h2>
      </div>
    </Link>
  );
};

export default SmallProduct;