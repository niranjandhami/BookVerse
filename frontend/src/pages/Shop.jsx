import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="sticky top-24 bg-[#111827] border border-gray-700 rounded-2xl p-6 shadow-xl h-fit">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">
            Browse Books
          </h2>

          {/* Categories */}
          <h3 className="text-lg font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2">
            Categories
          </h3>

          {categories?.map((c) => (
            <div key={c._id} className="flex items-center mb-3">
              <input
                type="checkbox"
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="mr-2"
              />
              <label>{c.name}</label>
            </div>
          ))}

          {/* Brands */}
          <h3 className="text-lg font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2 mt-8">
            Authors
          </h3>

          {uniqueBrands?.map((brand) => (
            <div key={brand} className="flex items-center mb-3">
              <input
                type="radio"
                name="brand"
                onChange={() => handleBrandClick(brand)}
                className="mr-2"
              />
              <label>{brand}</label>
            </div>
          ))}

          {/* Price */}
          <h3 className="text-lg font-semibold text-yellow-400 mb-4 border-b border-gray-700 pb-2 mt-8">
            Price
          </h3>

          <input
            type="number"
            placeholder="Maximum Price (₹)"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full rounded-xl bg-[#1f2937] text-white border border-gray-700 px-4 py-3 focus:outline-none focus:border-yellow-400"
          />

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-xl bg-yellow-400 text-black py-3 font-semibold transition hover:bg-yellow-300"
          >
            Reset Filters
          </button>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Explore Books
              </h1>
              <p className="text-gray-400 mt-2">
                {products.length} books available
              </p>
            </div>

            <input
              type="text"
              placeholder="🔍 Search books..."
              className="mt-4 md:mt-0 w-full md:w-72 px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h2 className="text-3xl font-bold text-gray-300">
                No books found 📚
              </h2>
              <p className="text-gray-500 mt-2">
                Try changing your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;