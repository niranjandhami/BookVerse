import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetProductsQuery,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaShoppingCart, FaBookOpen } from "react-icons/fa";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import ProductCard from "./ProductCard";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { data: allProductsData } = useGetProductsQuery({});

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const increaseQty = () => {
    setQty((prev) =>
      Math.min(product?.countInStock || 1, Number(prev) + 1)
    );
  };

  const decreaseQty = () => {
    setQty((prev) => Math.max(1, Number(prev) - 1));
  };

  const relatedProducts = allProductsData?.products
    ?.filter(
      (p) =>
        p.category === product?.category?._id && p._id !== product?._id
    )
    .slice(0, 4);

  return (
    <>
      <div className="ml-[10rem] mt-6">
        <Link
          to="/shop"
          className="text-gray-400 hover:text-yellow-400 transition text-sm tracking-wide uppercase"
        >
          ← Back to Shop
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="mx-[10rem] mt-10">
          {/* Two-column layout */}
          <div className="grid lg:grid-cols-[420px_1fr] gap-16">
            {/* Left: Cover image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[420px] h-[620px] object-contain bg-[#faf8f3] rounded-sm p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition duration-500 border border-yellow-900/10"
                />
              </div>

              <div className="mt-6">
                <HeartIcon product={product} />
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <p className="text-yellow-400/80 text-xs tracking-[0.2em] uppercase mb-3">
                {product.category?.name}
              </p>

              <h1 className="font-serif text-5xl font-bold text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-gray-400 mt-3 text-lg italic">
                by {product.brand}
              </p>

              <div className="mt-5">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>

              <div className="h-px bg-gradient-to-r from-yellow-900/40 via-gray-700 to-transparent my-8" />

              <div className="text-yellow-400 text-3xl font-serif font-bold">
                ₹{product.price}
              </div>

              {/* Description */}
              <p className="font-serif text-[#c9c9c9] text-[1.05rem] leading-[1.9] mt-8 max-w-[38rem]">
                {product.description}
              </p>

              <div className="h-px bg-gradient-to-r from-yellow-900/40 via-gray-700 to-transparent my-8" />

              {/* Info rows */}
              <div className="grid grid-cols-2 gap-y-4 max-w-md">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Author
                  </p>
                  <p className="text-white mt-1">{product.brand}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Category
                  </p>
                  <p className="text-white mt-1">
                    {product.category?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Availability
                  </p>
                  <p
                    className={`mt-1 ${
                      product.countInStock > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {product.countInStock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Reviews
                  </p>
                  <p className="text-white mt-1">
                    {product.numReviews} reader
                    {product.numReviews === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              {/* Quantity + Actions */}
              {product.countInStock > 0 && (
                <div className="flex items-center gap-4 mt-10">
                  <span className="text-gray-500 text-sm uppercase tracking-wider">
                    Qty
                  </span>
                  <div className="flex items-center border border-gray-700 rounded-sm">
                    <button
                      type="button"
                      onClick={decreaseQty}
                      className="px-4 py-2 text-gray-300 hover:text-yellow-400 text-lg"
                    >
                      −
                    </button>
                    <span className="px-5 text-white border-x border-gray-700">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={increaseQty}
                      className="px-4 py-2 text-gray-300 hover:text-yellow-400 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="mt-6 w-full max-w-md flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold py-4 rounded-sm transition uppercase tracking-wide text-sm"
              >
                <FaShoppingCart />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Reviews / Tabs */}
          <div className="mt-20">
            <div className="h-px bg-gray-800 mb-10" />
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>

          {/* Related books */}
          {relatedProducts?.length > 0 && (
            <div className="mt-20 mb-20">
              <div className="flex items-center gap-3 mb-10">
                <FaBookOpen className="text-yellow-400" />
                <h2 className="font-serif text-3xl font-bold text-white">
                  You May Also Like
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductDetails;