import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, HeartOff } from "lucide-react";
import API_BASE from "../config/api";



const Wishlist = ({ user }) => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/wishlist/${user.id}`,
          { credentials: "include" }
        );
        const data = await response.json();
        setWishlist(data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };
    fetchWishlist();
  }, [user.id]);

  const handleDelete = async (itemId) => {
    try {
      await fetch(`${API_BASE}/api/wishlist/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setWishlist((prev) => prev.filter((wish) => wish._id !== itemId));
    } catch (err) {
      console.error("Failed to delete wishlist item:", err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-blue-900 mb-8 text-center tracking-tight">
          Wishlist
        </h2>
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-blue-100 rounded-lg shadow-sm">
            <p className="text-blue-400 text-lg">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col relative group"
              >
                
                <img
                  src={
                    item.property.mainImage?.startsWith("http")
                      ? item.property.mainImage
                      : `${API_BASE}${item.property.mainImage || ""}`
                  }
                  alt={item.property.houseName}
                  className="w-full h-44 object-cover rounded-t-xl bg-blue-100"
                />
                <div className="flex-1 flex flex-col p-4">
                  <h3 className="text-lg font-bold text-blue-800 mb-1 truncate">
                    {item.property.houseName}
                  </h3>
                  <p className="text-blue-500 text-sm mb-2 truncate">
                    {item.property.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">
                      Rooms: {item.property.rooms}
                    </span>
                    {item.property.price && (
                      <span className="text-base font-semibold text-blue-700">
                        {item.property.price}৳
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm sm:text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                      onClick={() => navigate(`/properties/${item.property._id}`)}
                      aria-label="View property details"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm sm:text-base hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors"
                      onClick={() => handleDelete(item._id)}
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                    >
                      <HeartOff className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;