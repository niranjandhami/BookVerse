import {
  FaBook,
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaChartLine,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: products, isLoading: loadingProducts } = useAllProductsQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#facc15"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: { color: "#e5e7eb" },
      },
      grid: {
        borderColor: "#374151",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
        labels: { style: { colors: "#9ca3af" } },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
        labels: { style: { colors: "#9ca3af" } },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: { colors: "#e5e7eb" },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const hasChartData = salesDetail && salesDetail.length > 0;

  const cardClass =
    "rounded-2xl bg-[#111827] border border-gray-800 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300";

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem] px-6">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Welcome back, {userInfo?.username} 👋
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Sales — emphasized as the primary metric */}
          <Link to="/admin/orderlist">
            <div
              className={`${cardClass} border-yellow-400/40 bg-gradient-to-br from-[#111827] to-[#1a2333]`}
            >
              <div className="w-14 h-14 rounded-full bg-yellow-400 text-black flex items-center justify-center text-2xl">
                <FaRupeeSign />
              </div>
              <p className="mt-5 text-gray-400">Total Sales</p>
              <h1 className="text-3xl font-bold text-yellow-400">
                {isLoading ? (
                  <Loader />
                ) : (
                  `₹${sales?.totalSales?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  }) ?? "0.00"}`
                )}
              </h1>
            </div>
          </Link>

          <Link to="/admin/userlist">
            <div className={cardClass}>
              <div className="w-14 h-14 rounded-full bg-blue-400 text-black flex items-center justify-center text-2xl">
                <FaUsers />
              </div>
              <p className="mt-5 text-gray-400">Customers</p>
              <h1 className="text-3xl font-bold text-white">
                {loading ? <Loader /> : customers?.length}
              </h1>
            </div>
          </Link>

          <Link to="/admin/orderlist">
            <div className={cardClass}>
              <div className="w-14 h-14 rounded-full bg-green-400 text-black flex items-center justify-center text-2xl">
                <FaShoppingCart />
              </div>
              <p className="mt-5 text-gray-400">All Orders</p>
              <h1 className="text-3xl font-bold text-white">
                {loadingTwo ? <Loader /> : orders?.totalOrders}
              </h1>
            </div>
          </Link>

          <Link to="/admin/allproductslist">
            <div className={cardClass}>
              <div className="w-14 h-14 rounded-full bg-purple-400 text-black flex items-center justify-center text-2xl">
                <FaBook />
              </div>
              <p className="mt-5 text-gray-400">Books</p>
              <h1 className="text-3xl font-bold text-white">
                {loadingProducts ? <Loader /> : products?.length}
              </h1>
            </div>
          </Link>
        </div>

        {/* Chart */}
        <div className="mt-10 bg-[#111827] border border-gray-800 rounded-2xl p-6">
          {hasChartData ? (
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="100%"
              height={350}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FaChartLine className="text-5xl text-gray-600 mb-4" />
              <p className="text-gray-300 text-lg font-medium">
                No sales data yet
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Orders will appear here once customers start buying books.
              </p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;