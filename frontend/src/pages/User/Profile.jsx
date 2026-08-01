import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const initials = username ? username.charAt(0).toUpperCase() : "?";

  const memberSince = userInfo?.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  // Autofill fix: forces Chrome's yellow/white autofill background
  // back to the dark theme instead of overriding it visually.
  const autofillFix = {
    WebkitBoxShadow: "0 0 0 1000px #1F2937 inset",
    WebkitTextFillColor: "#ffffff",
  };

  const noChanges =
    !password &&
    username === userInfo.username &&
    email === userInfo.email;

  return (
    <div className="min-h-screen bg-[#0B1120] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div
          className="bg-[#111827] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-yellow-400/10 hover:shadow-2xl"
        >
          {/* Header banner */}
          <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-transparent px-8 pt-10 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-3xl font-bold text-black shrink-0 shadow-lg">
                {initials}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {username || "My Profile"}
                </h1>
                <p className="text-gray-400 mt-1">{email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-block text-xs font-medium text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                    📚 BookVerse Member 
                  </span>
                  {memberSince && (
                    <span className="inline-block text-xs font-medium text-gray-400 bg-gray-700/30 px-3 py-1 rounded-full">
                      Member since {memberSince}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="px-8 py-8">
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Account Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    autoComplete="name"
                    className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    autoComplete="email"
                    className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Change Password
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      style={autofillFix}
                      className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      style={autofillFix}
                      className="w-full bg-[#1F2937] text-white border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>

                  {confirmPassword && (
                    <p
                      className={`mt-2 text-sm ${
                        password === confirmPassword
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {password === confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-800">
              <Link
                to="/user-orders"
                className="flex items-center gap-2 bg-[#1F2937] hover:bg-[#2A3648] text-white py-3 px-6 rounded-xl transition font-medium"
              >
                <HiOutlineShoppingBag size={18} />
                My Orders
              </Link>

              <button
                type="submit"
                disabled={loadingUpdateProfile || noChanges}
                className={`min-w-[180px] font-semibold py-3 px-8 rounded-xl transition ${
                  noChanges
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-300 text-black"
                } disabled:opacity-60`}
              >
                {loadingUpdateProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;