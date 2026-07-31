import { Link } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [search, setSearch] = useState("");

  const filteredProducts =
    products?.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <div className="container mx-[9rem]">
        <div className="flex flex-col  md:flex-row">
          <div className="p-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-yellow-400">
                  All Books
                </h1>
                <p className="text-gray-400 mt-2">
                  Manage your bookstore inventory.
                </p>
              </div>

              <span className="px-4 py-2 rounded-xl bg-[#1a2333] text-gray-300 border border-gray-800">
                {filteredProducts.length} Books
              </span>
            </div>

            <div className="flex justify-end mb-5">
              <input
                type="text"
                placeholder="🔍 Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-72 px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#111827]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-sm">
                    <th className="text-left p-4">Book</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Added On</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-800 hover:bg-gray-800/30"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-16 rounded object-cover"
                          />
                          <span className="font-semibold text-white">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">{product.category?.name}</td>

                      <td className="p-4">₹{product.price}</td>

                      <td className="p-4">{product.countInStock}</td>

                      <td className="p-4">
                        {moment(product.createdAt).format("DD MMM YYYY")}
                      </td>

                      <td className="p-4">
                        {product.countInStock > 10 ? (
                          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                            In Stock
                          </span>
                        ) : product.countInStock > 0 ? (
                          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;