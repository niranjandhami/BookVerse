import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

const StatusBadge = ({ label, tone }) => {
  const toneClasses = {
    green: "bg-green-500/20 text-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    blue: "bg-blue-500/20 text-blue-400",
    red: "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
};

const SummaryCard = ({ label, value }) => (
  <div className="rounded-2xl bg-[#1a2333] border border-gray-800 p-5">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </div>
);

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [search, setSearch] = useState("");

  const filteredOrders =
    orders?.filter((order) => {
      const customer = order.user?.username?.toLowerCase() || "";
      const email = order.user?.email?.toLowerCase() || "";
      const id = order._id?.toLowerCase() || "";

      const term = search.toLowerCase();

      return (
        customer.includes(term) ||
        email.includes(term) ||
        id.includes(term)
      );
    }) || [];

  const totalOrders = orders?.length || 0;
  const deliveredCount =
    orders?.filter((order) => order.isDelivered).length || 0;
  const pendingCount = totalOrders - deliveredCount;
  const revenue =
    orders?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="max-w-7xl mx-auto bg-[#111827] rounded-2xl border border-gray-800 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400">
                All Orders
              </h1>
              <p className="text-gray-400 mt-2">
                Manage every customer order.
              </p>
            </div>

            <input
              type="text"
              placeholder="🔍 Search by customer, email or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <SummaryCard label="Orders" value={totalOrders} />
            <SummaryCard label="Pending" value={pendingCount} />
            <SummaryCard label="Delivered" value={deliveredCount} />
            <SummaryCard
              label="Revenue"
              value={`₹${revenue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}`}
            />
          </div>

          <div className="flex justify-between items-center mt-8 mb-6">
            <h2 className="text-2xl font-bold text-white">All Orders</h2>
            <span className="text-gray-400">
              {filteredOrders.length} Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="text-left pb-3 pr-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    return (
                      <tr
                        key={order._id}
                        className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="py-4">
                          {order.user ? (
                            <Link
                              to={`/admin/user/${order.user._id}`}
                              className="flex items-center gap-3 group"
                            >
                              <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
                                {order.user.username.charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <p className="font-semibold text-white group-hover:text-blue-400 transition">
                                  {order.user.username}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {order.user.email}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        <td className="py-4 text-gray-400 text-sm">
                          {order.createdAt
                            ? order.createdAt.substring(0, 10)
                            : "N/A"}
                        </td>

                        <td className="py-4 text-white font-semibold">
                          ₹{order.totalPrice?.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>

                        <td className="py-4">
                          {order.isPaid ? (
                            <StatusBadge label="Paid" tone="green" />
                          ) : (
                            <StatusBadge label="Pending" tone="yellow" />
                          )}
                        </td>

                        <td className="py-4">
                          {order.isDelivered ? (
                            <StatusBadge label="Delivered" tone="blue" />
                          ) : (
                            <StatusBadge label="Pending" tone="red" />
                          )}
                        </td>

                        <td className="py-4 pr-2 text-right">
                          <Link to={`/order/${order._id}`}>
                            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 transition-colors whitespace-nowrap">
                              👁 View Order
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;