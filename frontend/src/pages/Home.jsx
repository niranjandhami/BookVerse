import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <div className="ml-20 px-6">
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || error?.message || "Something went wrong"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center mt-8 mb-8 px-8">
            <h1 className="text-4xl font-bold text-white">
              Featured Books
            </h1>

            <Link
              to="/shop"
              className="bg-yellow-500 text-black font-bold rounded-full py-3 px-8 hover:bg-yellow-400"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center mt-8 px-8">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;