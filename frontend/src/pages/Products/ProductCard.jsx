import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Book added to cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };


  return (
  <div className="group bg-[#111827] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
    <div className="relative">
      <Link to={`/product/${p._id}`}>
        <div className="bg-white h-[340px] flex items-center justify-center overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="absolute top-4 right-4">
        <HeartIcon product={p} />
      </div>

      <span className="absolute bottom-4 left-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
        {p.brand}
      </span>
    </div>

    <div className="p-5">
   <Link to={`/product/${p._id}`}>
  <h2 className="text-xl font-bold text-white line-clamp-2 hover:text-yellow-400 transition">
    {p.name}
  </h2>
</Link>

<p className="text-gray-400 text-sm mt-1">
  by {p.brand}
</p>

<div className="flex items-center gap-2 mt-2">
  <span className="text-yellow-400">
    ⭐ {p.rating || 0}
  </span>

  <span className="text-gray-500 text-sm">
    ({p.numReviews || 0} Reviews)
  </span>
</div>

<p className="text-gray-400 text-sm mt-3 line-clamp-3">
  {p.description}
</p>

      <div className="flex items-center justify-between mt-6">
        <span className="text-2xl font-bold text-yellow-400">
          ₹{p.price}
        </span>

        <button
          onClick={() => addToCartHandler(p, 1)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-xl transition"
        >
          <AiOutlineShoppingCart size={20} />
          Cart
        </button>
      </div>
    </div>
  </div>
  );
}

export default ProductCard;