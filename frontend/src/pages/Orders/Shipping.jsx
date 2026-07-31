import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const inputClass =
    "w-full rounded-xl bg-[#1f2937] border border-gray-700 text-white px-4 py-3 placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40";

  const labelClass = "block text-sm font-medium text-gray-300 mb-2 tracking-wide";

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-10">
      <ProgressSteps step1 step2 />

      <div className="flex justify-center mt-12 mb-16">
        <div className="w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl shadow-black/40 p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] text-yellow-400 uppercase mb-2">
              Step 2 of 3
            </span>
            <h1 className="text-3xl font-bold text-white">
              Where should we deliver your books?
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Enter your shipping details to continue.
            </p>
          </div>

          <form onSubmit={submitHandler}>
            <div className="mb-5">
              <label className={labelClass}>Address</label>
              <input
                type="text"
                className={inputClass}
                placeholder="123 Main Street"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* City + Postal side by side */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Bengaluru"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Postal Code</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="560001"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className={labelClass}>Country</label>
              <input
                type="text"
                className={inputClass}
                placeholder="India"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            {/* Payment method as a selectable card */}
            <div className="mb-8">
              <label className={labelClass}>Payment Method</label>
              <label
                htmlFor="paypal"
                className={`flex items-center justify-between rounded-xl border px-4 py-4 cursor-pointer transition-colors duration-200 ${
                  paymentMethod === "PayPal"
                    ? "border-yellow-400 bg-yellow-400/5"
                    : "border-gray-700 bg-[#1f2937]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    id="paypal"
                    type="radio"
                    className="accent-yellow-400 w-4 h-4"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-white font-medium">
                    PayPal or Credit Card
                  </span>
                </div>
                <span className="text-xs text-gray-500">Secure checkout</span>
              </label>
            </div>

            <button
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-[0.99]"
              type="submit"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;