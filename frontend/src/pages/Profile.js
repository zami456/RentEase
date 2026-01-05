import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/profile/${user.id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-2xl shadow-md border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          {profileData.role} Profile
        </h1>
        {profileData ? (
          <div className="flex flex-col items-center gap-6">
            {profileData.profileImage && (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-blue-200 object-cover mb-2"
              />
            )}
            <div className="w-full grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-blue-700 font-medium">Username</span>
                <span className="text-blue-900">{profileData.username}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-blue-700 font-medium">Email</span>
                <span className="text-blue-900">{profileData.email}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-blue-700 font-medium">First Name</span>
                <span className="text-blue-900">{profileData.firstName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-blue-700 font-medium">Last Name</span>
                <span className="text-blue-900">{profileData.lastName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-blue-700 font-medium">Phone</span>
                <span className="text-blue-900">{profileData.phone}</span>
              </div>
              <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                <span className="text-blue-700 font-medium">Address</span>
                <span className="text-blue-900">{profileData.address}</span>
              </div>
            </div>
            <div className="w-full mt-2">
              <span className="text-blue-700 font-medium">About</span>
              <p className="text-blue-900 bg-blue-50 rounded p-2 mt-1 min-h-[40px] text-sm">
                {profileData.about}
              </p>
            </div>
            <button
              onClick={() => navigate("/editprofile")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <p className="text-blue-400 text-center">
            No profile data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;