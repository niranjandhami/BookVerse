import { useEffect, useState } from "react";
import moment from "moment";
import { FaTrash, FaEdit, FaCheck, FaUsers } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
// ⚠️⚠️⚠️ don't forget this ⚠️⚠️⚠️⚠️
// import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [search, setSearch] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredUsers =
    users?.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const term = search.toLowerCase();
      return username.includes(term) || email.includes(term);
    }) || [];

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-yellow-400">Users</h1>
          <p className="text-gray-400 mt-2">Manage registered users.</p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 max-w-sm px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white"
          />

          <span className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1a2333] text-gray-300 border border-gray-800 whitespace-nowrap">
            <FaUsers className="text-yellow-400" />
            {filteredUsers.length} Users
          </span>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-lg overflow-x-auto">
  <table className="w-full text-white">
    <thead>
              <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm">
                <th className="px-4 py-3 text-left">NAME</th>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-center">ADMIN</th>
                <th className="px-4 py-3 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-gray-800/40 transition"
                >
                  <td className="px-4 py-5">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserName}
                          onChange={(e) => setEditableUserName(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold">
                          {user.username?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {user.username || "Unnamed"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.createdAt
                              ? moment(user.createdAt).format("DD MMM YYYY")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    {editableUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editableUserEmail}
                          onChange={(e) => setEditableUserEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <a
                        href={`mailto:${user.email}`}
                        className="text-gray-300 hover:text-yellow-400"
                      >
                        {user.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center">
                      {user.isAdmin ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                          User
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          toggleEdit(user._id, user.username, user.email)
                        }
                        className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                      >
                        <FaEdit /> Edit
                      </button>

                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                        >
                          <FaTrash /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;