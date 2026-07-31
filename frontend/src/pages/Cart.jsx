import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaLock } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const formatPrice = (value) =>
  Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const increaseQty = (item) => {
    if (item.qty < item.countInStock) {
      addToCartHandler(item, item.qty + 1);
    }
  };

  const decreaseQty = (item) => {
    if (item.qty > 1) {
      addToCartHandler(item, item.qty - 1);
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const totalBooks = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  // Placeholder: sums any item.savings field if you add one later
  // (e.g. original vs discounted price). Defaults to 0 for now.
  const savings = cartItems.reduce(
    (acc, item) => acc + (item.savings || 0) * item.qty,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your bookshelf is empty
          </h2>
          <p className="text-gray-400 mb-6">Browse our collection.</p>
          <Link
            to="/shop"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-3 rounded-xl transition"
          >
            Explore Books
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaShoppingCart className="text-yellow-400" />
              Shopping Cart
            </h1>

            <Link
              to="/shop"
              className="text-gray-400 hover:text-yellow-400 transition text-sm inline-block mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-10">
            {/* Cart Items */}
            <div>
              {cartItems.map((item) => {
                const atMaxStock = item.qty >= item.countInStock;
                const lineTotal = item.qty * item.price;

                return (
                  <div
                    key={item._id}
                    className="bg-[#111827] border border-gray-800 rounded-2xl p-5 mb-5 flex items-center gap-5 hover:border-yellow-500 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-28 h-40 bg-white rounded-xl p-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-xl font-bold text-white hover:text-yellow-400"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-2 text-gray-400">{item.brand}</div>

                      <p className="text-green-400 text-sm mt-1">
                        🟢 In Stock ({item.countInStock})
                      </p>

                      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                        <span className="text-yellow-400 font-bold text-lg">
                          ₹{formatPrice(item.price)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          × {item.qty} = ₹{formatPrice(lineTotal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-700 rounded-lg">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item)}
                            disabled={item.qty <= 1}
                            className="px-3 py-1 text-gray-300 hover:text-yellow-400 text-lg disabled:opacity-30 disabled:hover:text-gray-300"
                          >
                            −
                          </button>
                          <span className="px-4 text-white border-x border-gray-700">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => increaseQty(item)}
                            disabled={atMaxStock}
                            className="px-3 py-1 text-gray-300 hover:text-yellow-400 text-lg disabled:opacity-30 disabled:hover:text-gray-300"
                          >
                            +
                          </button>
                        </div>

                        {atMaxStock && (
                          <span className="text-xs text-yellow-500">
                            Max stock reached
                          </span>
                        )}

                        <button
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white hover:scale-110 transition ml-auto"
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-24 bg-[#111827] border border-gray-800 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Books ({totalBooks})</span>
                    <span>{totalBooks}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Savings</span>
                      <span>−₹{formatPrice(savings)}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-800 my-5" />

                <div className="flex justify-between text-white text-lg font-bold">
                  <span>Total</span>
                  <span>₹{formatPrice(subtotal)}</span>
                </div>

                <button
                  className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg transition mt-6 flex items-center justify-center gap-2"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  <FaLock size={16} />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;